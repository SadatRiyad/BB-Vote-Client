import { FaCalendarAlt } from 'react-icons/fa';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import useAxiosSecure from '@/components/Hooks/useAxiosSecure/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const UpcomingElections = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [sortOrder, setSortOrder] = useState("ascending");

    // Fetch upcoming elections
    const { data: elections = [], isLoading } = useQuery({
        queryKey: ['upcomingElections'],
        queryFn: async () => {
            const response = await axiosSecure.get('/elections');
            return response.data.elections.filter(election => election.status === 'Upcoming');
        },
    });

    // Sort elections by start date
    const sortedElections = [...elections].sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return sortOrder === "ascending" ? dateA - dateB : dateB - dateA;
    });

    // Countdown Timer Logic
    const calculateCountdown = (startDate) => {
        const currentTime = new Date().getTime();
        const startTime = new Date(startDate).getTime();
        const timeDiff = startTime - currentTime;

        if (timeDiff <= 0) {
            return "Started"; // Indicates the election has started
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const [countdowns, setCountdowns] = useState({});

    useEffect(() => {
        const timer = setInterval(() => {
            const newCountdowns = {};
            sortedElections.forEach((election) => {
                newCountdowns[election._id] = calculateCountdown(election.startDate);
            });
            setCountdowns(newCountdowns);
        }, 1000);

        return () => clearInterval(timer);
    }, [sortedElections]);

    if (isLoading) return <div>Loading upcoming elections...</div>;

    return (
        <div className="container mx-auto py-12 bg-slate-200" id="upcoming-elections">
            <div className="flex flex-col md:flex-row justify-between mb-12 items-center">
                <div className="text-center md:text-left">
                    <h5 className="text-4xl font-extrabold text-customNil mb-1">_______</h5>
                    <h2 className="text-4xl font-bold text-customGulabi">
                        <span className="text-customNil">Upcoming</span> Elections
                    </h2>
                    <p>Explore the next elections scheduled to start soon.</p>
                </div>
                <div>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-[180px] border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="ascending">Earliest First</option>
                        <option value="descending">Latest First</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {sortedElections.map((election) => (
                    <div
                        key={election._id}
                        className="p-6 bg-gradient-to-br from-customGulabi via-customGulabi to-slate-200 rounded-lg shadow-lg border border-slate-300 hover:shadow-2xl transition duration-300"
                    >
                        <h2 className="text-2xl font-bold text-customBlue flex items-center mb-4">
                            {election.name}
                        </h2>
                        <div className="mt-4">
                            <p className="flex items-center text-black">
                                <FaCalendarAlt className="mr-2 text-customBlue" />
                                Start Date: {new Date(election.startDate).toLocaleDateString()}
                            </p>
                            <p className="flex items-center text-black">
                                <FaCalendarAlt className="mr-2 text-customBlue" />
                                End Date: {new Date(election.endDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm font-medium text-black mt-2">
                                Status:{" "}
                                <span className="text-customBlue font-semibold">{election.status}</span>
                            </p>
                        </div>
                        {countdowns[election._id] === "Started" ? (
                            <button
                                onClick={() => navigate(`/giveVote/${election._id}`)}
                                className="mt-6 w-full py-3 flex justify-center items-center bg-customBlue text-white rounded-lg hover:bg-blue-900 focus:ring-4 focus:ring-blue-300"
                            >
                                Learn More <HiOutlineArrowRight className="ml-2 text-lg" />
                            </button>
                        ) : (
                            <button
                                disabled
                                className="mt-6 w-full py-3 flex justify-center items-center bg-gray-400 text-white rounded-lg cursor-not-allowed"
                            >
                                Starting In: {countdowns[election._id]}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingElections;
