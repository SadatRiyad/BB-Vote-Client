import { useState, useEffect } from 'react';

const ViewVoteResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch('http://localhost:5000/Candidate/results');
                const data = await response.json();

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
    }, []);

    const getWinningCandidate = () => {
        if (!results || results.length === 0) return null;
        return results.reduce((max, candidate) => (candidate.votesCount > max.votesCount ? candidate : max), results[0]);
    };

    const winningCandidate = getWinningCandidate();

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
            <h1 className="text-3xl font-bold text-center text-white mb-8">Live Vote Results</h1>
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
                                key={candidate._id}
                                className={`text-center ${
                                    winningCandidate && candidate._id === winningCandidate._id
                                        ? 'bg-green-100'
                                        : 'bg-red-100'
                                }`}
                            >
                                <td className="border border-gray-300 p-2">{candidate.name}</td>
                                <td className="border border-gray-300 p-2">{candidate.party}</td>
                                <td className="border border-gray-300 p-2">{candidate.votesCount}</td>
                                <td className="border border-gray-300 p-2 font-semibold">
                                    {winningCandidate && candidate._id === winningCandidate._id
                                        ? 'Winning'
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

export default ViewVoteResults;
