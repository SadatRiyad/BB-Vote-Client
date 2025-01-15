import { useState, useEffect } from 'react';
import useAxiosSecure from '@/components/Hooks/useAxiosSecure/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAuth from '@/components/Hooks/useAuth/useAuth';
import { toast } from 'react-toastify';

const SeeCurrentVote = () => {
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [loading, setLoading] = useState(false);
    const axiosSecure = useAxiosSecure();
    const [me, setMe] = useState({});
    const auth = useAuth();
    const email = auth?.user?.email;

    // Fetch candidates from the backend
    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await axiosSecure.get('/Candidates');
                console.log('API Response:', response?.data);
                setCandidates(Array.isArray(response?.data) ? response?.data : []);
            } catch (error) {
                console.error('Error fetching candidates:', error);
                toast('Failed to load candidates. Please try again.');
            }
        };
        fetchCandidates();
    }, [axiosSecure]);

    const { data: mySelf = [], refetch } = useQuery({
        queryKey: ['mySelf'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/email/${email}`)
            if (res?.data) {
                // check from many users user.email === user.email
                // const me = res?.data?.find(user => user?.email === auth?.user?.email)
                setMe(res?.data); 
            }
            return [mySelf, loading, refetch];
        },
    });
    console.log(me)

    // Handle vote submission
    const handleVoteSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCandidate) {
            toast('Please select a candidate to vote.');
            return;
        }

        setLoading(true);
        try {
            const response = await axiosSecure.post(`/Candidate/vote/${me._id}`, {
                candidateId: selectedCandidate,
            });

            if (response.data.success) {
                toast('Vote submitted successfully!');
            } else {
                toast('Failed to submit vote. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting vote:', error);
            // alart error message from server
            toast(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-4 md:mx-auto my-6 p-4 md:px-12 py-8 bg-customGulabi text-customBlue shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-10">Vote for Your Candidate</h1>

            {/* {message && (
                <p
                    className={`mt-4 text-center ${
                        message.includes('successfully') ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                    {message}
                </p>
            )} */}

            {loading && <p className="mt-4 text-center text-blue-600">Loading...</p>}

            <form
                onSubmit={handleVoteSubmit}
                className="mt-6"
            >
                {candidates.length > 0 ? (
                    <div className="space-y-4">
                        {candidates.map((candidate) => (
                            <div
                                key={candidate._id}
                                className="flex items-center p-4 border rounded-lg shadow-sm hover:bg-gray-100"
                            >
                                <label className="flex items-center w-full cursor-pointer">
                                    <input
                                        type="radio"
                                        name="candidate"
                                        value={candidate._id}
                                        onChange={() => setSelectedCandidate(candidate._id)}
                                        className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="ml-4 flex flex-col">
                                        <span className="text-lg font-semibold text-customBlue">
                                            {candidate.name} ({candidate.party})
                                        </span>
                                        <div className="text-sm text-black mt-1">
                                            <p><span className='font-medium'>Position:</span> {candidate.position}</p>
                                            <p><span className='font-medium'>Party:</span> {candidate.party}</p>
                                            <p><span className='font-medium'>Education:</span> {candidate.education}</p>
                                            <p><span className='font-medium'>Experience:</span> {candidate.experience} years</p>
                                            <p><span className='font-medium'>Occupation:</span> {candidate.occupation}</p>
                                        </div>
                                    </div>
                                </label>
                                {candidate.partyImage && (
                                    <img
                                        src={candidate.partyImage}
                                        alt={candidate.party}
                                        className="ml-4 h-20 w-20 object-fill rounded-lg border-2 border-customBlue"
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
                    className={`mt-6 w-full py-2 px-4 text-white font-semibold rounded-lg ${
                        loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-customNil hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
                    }`}
                >
                    {loading ? 'Submitting...' : 'Submit Vote'}
                </button>
            </form>
        </div>
    );
};

export default SeeCurrentVote;
