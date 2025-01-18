import useAxiosSecure from '@/components/Hooks/useAxiosSecure/useAxiosSecure';
import { useState, useEffect } from 'react';

const GetResult = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosSecure = useAxiosSecure();
    const electionId = window.location.pathname.split('/').pop();
    
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axiosSecure.get(`/elections/${electionId}/results`);
                const data = response.data;
    
                if (data.success && Array.isArray(data.results)) {
                    setResults(data.results);
                } else {
                    throw new Error('Unexpected data format received');
                }
            } catch (error) {
                setError(error.message || 'Failed to fetch results');
            } finally {
                setLoading(false);
            }
        };
    
        fetchResults();
    }, [axiosSecure, electionId]);
    
    const getWinningCandidates = () => {
        if (!results || results.length === 0) return [];
        
        const maxVotes = Math.max(...results.map(candidate => candidate.votes));
        return results.filter(candidate => candidate.votes === maxVotes);
    };

    const winningCandidates = getWinningCandidates();

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="text-xl font-semibold text-gray-700">Loading...</div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="text-xl font-semibold text-red-500">{`Error: ${error}`}</div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-4 md:mx-auto my-6 p-4 md:px-12 py-8 bg-customGulabi text-customBlue shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold text-center text-white mb-8">Election Results</h1>
            {results.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">Candidate Name</th>
                            <th className="border border-gray-300 p-2">Party</th>
                            <th className="border border-gray-300 p-2">Votes</th>
                            <th className="border border-gray-300 p-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((candidate) => (
                            <tr
                                key={candidate.candidateId}
                                className={`text-center ${
                                    winningCandidates.some(w => w.candidateId === candidate.candidateId)
                                        ? winningCandidates.length > 1
                                            ? 'bg-yellow-100' // Indicate a draw
                                            : 'bg-green-100' // Indicate a single winner
                                        : 'bg-red-100' // Indicate losing candidates
                                }`}
                            >
                                <td className="border border-gray-300 p-2">{candidate.name}</td>
                                <td className="border border-gray-300 p-2">{candidate.party}</td>
                                <td className="border border-gray-300 p-2">{candidate.votes}</td>
                                <td className="border border-gray-300 p-2 font-semibold">
                                    {winningCandidates.some(w => w.candidateId === candidate.candidateId)
                                        ? winningCandidates.length > 1
                                            ? 'Draw'
                                            : 'Winning'
                                        : 'Losing'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="mt-4 text-center text-gray-500">No results available.</p>
            )}
        </div>
    );
};

export default GetResult;
