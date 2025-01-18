import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/components/Hooks/useAxiosSecure/useAxiosSecure';
import { toast } from 'react-toastify';
import useAuth from '@/components/Hooks/useAuth/useAuth';
import { useState } from 'react';
import Swal from 'sweetalert2';

const GiveVote = () => {
    const axiosSecure = useAxiosSecure();
    const electionId = window.location.pathname.split('/').pop();
    const [me, setMe] = useState({});
    const [loading, setLoading] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [votedCandidate, setVotedCandidate] = useState(null);
    const auth = useAuth();
    const email = auth?.user?.email;
    const [showVotedCandidate, setShowVotedCandidate] = useState(false);

    // Fetch mySelf using TanStack Query
    const { data: mySelf = [], isLoading: meLoading, refetch } = useQuery({
        queryKey: ['mySelf'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/email/${email}`);
            if (res?.data) {
                setMe(res?.data);
                // Check if the user has already voted
                const voteRes = await axiosSecure.get(`/elections/${electionId}/votes/${res.data._id}`);
                if (voteRes?.data?.voted) {
                    setHasVoted(true);
                    setVotedCandidate(voteRes.data.candidate);
                }
            }
            return [mySelf, meLoading, refetch];
        },
    });

    // Fetch candidates using TanStack Query
    const { data: candidates = [], isLoading: candidatesLoading } = useQuery({
        queryKey: ['candidates', electionId],
        queryFn: async () => {
            const response = await axiosSecure.get(`/elections/${electionId}/candidates`);
            return response.data.result || [];
        },
        enabled: !!electionId, // Only fetch if electionId exists
        onError: () => {
            toast.error('Failed to load candidates. Please try again.');
        },
    });

    // Submit vote mutation
    const handleVoteSubmit = async (e) => {
        e.preventDefault();

        const candidateId = e.target.candidate?.value;
        if (!candidateId) {
            toast('Please select a candidate to vote.');
            return;
        }

        setLoading(true);
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Vote Now!"
            }).then((result) => {
                if (result.isConfirmed) {
                    axiosSecure.post(`/elections/vote/${electionId}`, {
                        candidateId: candidateId,
                        userId: me._id,
                    })
                        .then((res) => {
                            if (res.data) {
                                Swal.fire({
                                    title: "Voted!",
                                    text: "Vote submitted successfully!",
                                    icon: "success",
                                });
                                setHasVoted(true);
                                setVotedCandidate(candidates.find(candidate => candidate._id === candidateId));
                                refetch();
                            }
                        })
                } else {
                    toast.error('Failed to submit vote. Please try again.');
                }
            });
        } catch (error) {
            console.error('Error submitting vote:', error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading || candidatesLoading || meLoading) {
        return <div className='h-dvh w-dvw text-center flex items-center justify-center'>Loading candidates...</div>;
    }

    return (
        <div className='bg-customGulabi py-8 p-0 m-0'>
            {
                meLoading && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'> </div>
            }
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">

                {hasVoted ? (
                    <div className="text-center py-6">
                        <p className="font-semibold text-xl text-customBlue">You have already voted in this election.</p>

                        <button
                            onClick={() => setShowVotedCandidate(true)}
                            className="mt-4 px-4 py-2 bg-customNil text-white font-semibold rounded-lg hover:bg-customGulabi focus:ring-4 focus:ring-customGulabi"
                        >
                            See Voted Candidate
                        </button>

                        {showVotedCandidate && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                                    <h2 className="text-xl font-bold mb-4">Your Voted Candidate:</h2>
                                    <p className="text-lg font-semibold">{votedCandidate.name} ({votedCandidate.party})</p>
                                    <p className="text-sm text-gray-600">{votedCandidate.position}, {votedCandidate.experience} years experience</p>
                                    {votedCandidate.partyImage && (
                                        <img
                                            src={votedCandidate.partyImage}
                                            alt={votedCandidate.party}
                                            className="mt-2 h-16 w-16 object-cover rounded-lg mx-auto border-2 border-customBlue bg-white text-black"
                                        />
                                    )}
                                    <button
                                        onClick={() => setShowVotedCandidate(false)}
                                        className="mt-4 px-4 py-2 bg-customNil text-white font-semibold rounded-lg hover:bg-customGulabi focus:ring-4 focus:ring-customGulabi"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleVoteSubmit}>
                        <h1 className="text-2xl font-bold text-center mb-10">Vote for Your Candidate</h1>
                        {candidates.length > 0 ? (
                            <div className="space-y-4">
                                {candidates.map((candidate) => (
                                    <div
                                        key={candidate._id}
                                        className="flex items-center p-4 border rounded-lg shadow-sm hover:shadow-md hover:bg-customBlue active:bg-customBlue focus:bg-customBlue hover:text-white transition duration-300 ease-in-out"
                                    >
                                        <label className="flex items-center w-full cursor-pointer">
                                            <input
                                                type="radio"
                                                name="candidate"
                                                value={candidate._id}
                                                className="form-radio h-5 w-5 text-customGulabi focus:ring-customGulabi"
                                            />
                                            <div className="ml-4 flex flex-col">
                                                <span className="text-lg font-semibold">
                                                    {candidate.name} ({candidate.party})
                                                </span>
                                                <p className="text-sm mt-1">
                                                    {candidate.position}, {candidate.experience} years experience
                                                </p>
                                            </div>
                                        </label>
                                        {candidate.partyImage && (
                                            <img
                                                src={candidate.partyImage}
                                                alt={candidate.party}
                                                className="ml-4 h-16 w-16 object-cover rounded-lg border-2 border-customBlue bg-white text-black"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-4 text-center text-gray-600">No candidates available.</p>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`mt-6 w-full py-2 px-4 text-white font-semibold rounded-lg ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-customNil hover:bg-customGulabi focus:ring-4 focus:ring-customGulabi'
                                }`}
                        >
                            {loading ? 'Submitting...' : 'Submit Vote'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default GiveVote;
