import { Bar, Pie } from 'react-chartjs-2';
import { CategoryScale, Chart as ChartJS, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import "./AdminDashboard.css"
import useAxiosSecure from '@/components/Hooks/useAxiosSecure/useAxiosSecure';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
    const axiosSecure = useAxiosSecure();
    const [data, setData] = useState({
        totalCandidates: 0,
        maleCandidates: 0,
        femaleCandidates: 0,
        premiumCandidates: 0,
        totalRevenue: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosSecure.get('/admin/counters');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, [axiosSecure]);

    const barData = {
        labels: ['Total', 'Male', 'Female', 'Premium', 'Completed'],
        datasets: [
            {
                label: 'Vote Count',
                data: [data.totalCandidates, data.maleCandidates, data.femaleCandidates, data.premiumCandidates, data.userReviewsCompleted],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#448811'],
            },
        ],
    };

    const pieData = {
        labels: ['Total Candidate count', 'Male Candidate count', 'Female Candidate count', 'Premium Candidate count', 'Total Reviews Completed count', 'Total Revenue'],
        datasets: [
            {
                data: [data.totalCandidates, data.maleCandidates, data.femaleCandidates, data.premiumCandidates, data.userReviewsCompleted, data.totalRevenue],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#448811'],
            },
        ],
    };

    const TotalContactNo = data?.totalRevenue / 5;

    return (
        <div className="py-2">
            <Helmet>
                <title>Admin Dashboard | BB-Vote</title>
            </Helmet>
            <div className='mb-4 items-center'>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl md:text-[32px] font-bold mb-4">Admin Dashboard</h1>
                    <Link to="/dashboard/userReview" className="text-sm rounded-lg bg-customGulabi text-white px-4 py-3 border-2 hover:border-customNil hover:bg-transparent hover:text-customNil font-bold mb-4">User Review</Link>
                </div>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Revenue</CardTitle>
                        <CardDescription>Revenue from <span className='text-customNil'>$5 * {TotalContactNo}</span> contact information purchases:</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg">${data?.totalRevenue}</p>

                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="mt-8">
                    <CardHeader className="mb-4">
                        <CardTitle>Candidate Count</CardTitle>
                        <CardDescription>Overview of all Candidate counts</CardDescription>
                        <CardDescription>● Total Candidate count: {data?.totalCandidates}</CardDescription>
                        <CardDescription>● Total Male Candidate count: {data?.maleCandidates}</CardDescription>
                        <CardDescription>● Total Female Candidate count: {data?.femaleCandidates}</CardDescription>
                        <CardDescription>● Total Premium Candidate count: {data?.premiumCandidates}</CardDescription>
                        <CardDescription>● Total User Reviews Completed count: {data?.userReviewsCompleted}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Bar data={barData} />
                    </CardContent>
                </Card>
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Candidate Distribution</CardTitle>
                        <CardDescription>Pie chart representation</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Pie data={pieData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
