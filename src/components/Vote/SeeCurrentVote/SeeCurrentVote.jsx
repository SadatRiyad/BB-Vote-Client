import { FaCalendarAlt, FaVoteYea } from 'react-icons/fa';
import { HiOutlineArrowRight } from 'react-icons/hi';
import useAxiosSecure from '@/components/Hooks/useAxiosSecure/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const SeeCurrentVote = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    // Fetch active elections
    const { data: elections = [], isLoading } = useQuery({
        queryKey: ['activeElections'],
        queryFn: async () => {
            const response = await axiosSecure.get('/elections');
            return response.data.elections.filter(election => election.status === 'Ongoing');
        },
    });

    if (isLoading) return <div>Loading elections...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-extrabold text-center text-customBlue mb-10">
                🗳️ Ongoing Elections:
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {elections.map(election => (
                    <div
                        key={election._id}
                        className="p-6 bg-gradient-to-br from-customGulabi via-customGulabi to-slate-200 rounded-lg shadow-lg border border-slate-300 hover:shadow-2xl transition duration-300"
                    >
                        <h2 className="text-2xl font-bold text-customBlue flex items-center">
                            {election.name} <FaVoteYea className="ml-2 text-white" />
                        </h2>
                        <div className="mt-4">
                            <p className="flex items-center text-white">
                                <FaCalendarAlt className="mr-2 text-customBlue" />
                                Start Date: {new Date(election.startDate).toLocaleDateString()}
                            </p>
                            <p className="flex items-center text-white">
                                <FaCalendarAlt className="mr-2 text-customBlue" />
                                End Date: {new Date(election.endDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm font-medium text-black mt-2">
                                Status: <span className="text-customBlue font-semibold">{election.status}</span>
                            </p>
                        </div>
                        <button
                            onClick={() => navigate(`/giveVote/${election._id}`)}
                            className="mt-6 w-full py-3 flex justify-center items-center bg-customBlue text-white rounded-lg hover:bg-blue-900 focus:ring-4 focus:ring-blue-300"
                        >
                            Give Vote <HiOutlineArrowRight className="ml-2 text-lg" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeeCurrentVote;
