// import useAxiosSecure from '@/components/Hooks/useAxiosSecure/useAxiosSecure';
// import { useState, useEffect } from 'react';

// const ViewVoteResults = () => {
//     const [results, setResults] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const axiosSecure = useAxiosSecure();

//     useEffect(() => {
//         const fetchResults = async () => {
//             try {
//                 // const response = await axiosSecure.get('/Candidate/results'); // Use `.get` for GET requests
//                 const response = await axiosSecure.get(`/elections/${electtionId}/results`); // Use `.get` for GET requests
//                 const data = response.data; // Access the data directly
    
//                 if (data.success && Array.isArray(data.results)) {
//                     setResults(data.results);
//                 } else {
//                     throw new Error('Unexpected data format received');
//                 }
//             } catch (error) {
//                 setError(error.message || 'Failed to fetch results');
//             } finally {
//                 setLoading(false);
//             }
//         };
    
//         fetchResults();
//     }, [axiosSecure]);
    
//     const getWinningCandidate = () => {
//         if (!results || results.length === 0) return null;
//         return results.reduce((max, candidate) => (candidate.votesCount > max.votesCount ? candidate : max), results[0]);
//     };

//     const winningCandidate = getWinningCandidate();

//     if (loading) return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-50">
//             <div className="text-xl font-semibold text-gray-700">Loading...</div>
//         </div>
//     );

//     if (error) return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-50">
//             <div className="text-xl font-semibold text-red-500">{`Error: ${error}`}</div>
//         </div>
//     );

//     return (
//         <div className="max-w-3xl mx-4 md:mx-auto my-6 p-4 md:px-12 py-8 bg-customGulabi text-customBlue shadow-lg rounded-lg">
//             <h1 className="text-3xl font-bold text-center text-white mb-8">Live Vote Results</h1>
//             {results.length > 0 ? (
//                 <table className="w-full border-collapse border border-gray-300">
//                     <thead>
//                         <tr className="bg-gray-100">
//                             <th className="border border-gray-300 p-2">Candidate Name</th>
//                             <th className="border border-gray-300 p-2">Party</th>
//                             <th className="border border-gray-300 p-2">Votes</th>
//                             <th className="border border-gray-300 p-2">Status</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {results.map((candidate) => (
//                             <tr
//                                 key={candidate._id}
//                                 className={`text-center ${
//                                     winningCandidate && candidate._id === winningCandidate._id
//                                         ? 'bg-green-100'
//                                         : 'bg-red-100'
//                                 }`}
//                             >
//                                 <td className="border border-gray-300 p-2">{candidate.name}</td>
//                                 <td className="border border-gray-300 p-2">{candidate.party}</td>
//                                 <td className="border border-gray-300 p-2">{candidate.votesCount}</td>
//                                 <td className="border border-gray-300 p-2 font-semibold">
//                                     {winningCandidate && candidate._id === winningCandidate._id
//                                         ? 'Winning'
//                                         : 'Losing'}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             ) : (
//                 <p className="mt-4 text-center text-gray-500">No results available.</p>
//             )}
//         </div>
//     );
// };

// export default ViewVoteResults;


import { FaCalendarAlt, FaVoteYea } from 'react-icons/fa';
import { HiOutlineArrowRight } from 'react-icons/hi';
import useAxiosSecure from '@/components/Hooks/useAxiosSecure/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const ViewVoteResults = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    // Fetch active elections
    const { data: elections = [], isLoading } = useQuery({
        queryKey: ['completedElections'],
        queryFn: async () => {
            const response = await axiosSecure.get('/elections');
            return response.data.elections.filter(election => election.status === 'Completed');
        },
    });

    if (isLoading) return <div>Loading elections...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-extrabold text-center text-customBlue mb-10">
                Completed Elections for see results:
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
                            onClick={() => navigate(`/getResult/${election._id}`)}
                            className="mt-6 w-full py-3 flex justify-center items-center bg-customBlue text-white rounded-lg hover:bg-blue-900 focus:ring-4 focus:ring-blue-300"
                        >
                            Get Result <HiOutlineArrowRight className="ml-2 text-lg" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewVoteResults;