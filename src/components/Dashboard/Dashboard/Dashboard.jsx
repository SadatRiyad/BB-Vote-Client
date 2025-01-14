import { Helmet } from 'react-helmet-async';
import { NavLink } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { View, Edit, Contact, Heart, LogOutIcon, LayoutDashboardIcon, Users, Contact2, UserCircle, Table } from 'lucide-react';
import { FaUserCheck } from 'react-icons/fa';
import useMyCandidate from '@/components/Hooks/useCandidates/useMyCandidate';
import useAuth from '@/components/Hooks/useAuth/useAuth';
import useAdmin from '@/components/Hooks/useAdmin/useAdmin';

const Dashboard = () => {
    const [isAdmin] = useAdmin();
    const { user, logoutUser } = useAuth();
    const Candidate = useMyCandidate();
    const forLgClass = "flex items-center gap-3 rounded-lg px-3 py-2 text-customGulabi transition-all hover:text-primary";
    const forMblClass = "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-customGulabi hover:text-white";

    const handleLogout = () => {
        logoutUser();
    };

    return (
        <div className="container mx-auto px-4 pt-5 pb-5">
            <Helmet>
                <title>{isAdmin ? 'Admin Dashboard' : 'User Dashboard'} | BB-Vote</title>
            </Helmet>
            <div className="text-center mb-8">
                <h1 className='text-2xl mb-1 font-bold'>Hello, <span className='text-customNil capitalize font-extrabold'>{user?.displayName}</span></h1>
                <h2 className="text-2xl md:text-4xl font-bold mb-3">{isAdmin ? 'Welcome to Dashboard' : 'Welcome to Dashboard'}</h2>
                <p className="text-sm md:text-base">
                    {isAdmin ? 'Manage the platform, users, and content from here.' : 'Here you can manage your profile, view matches, and track your activities.'}
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isAdmin ? (
                    <>
                        <Card className="hover:bg-customNil hover:text-white">
                            <CardHeader className="font-bold">Admin Dashboard</CardHeader>
                            <CardContent>
                                <NavLink to="/dashboard/adminDashboard" className={`${forMblClass} md:${forLgClass}`}>
                                    <LayoutDashboardIcon className="h-4 w-4" /> Admin Dashboard
                                </NavLink>
                            </CardContent>
                        </Card>
                        <Card className="hover:bg-customNil hover:text-white">
                            <CardHeader className="font-bold">Manage Users</CardHeader>
                            <CardContent>
                                <NavLink to="/dashboard/manageUsers" className={`${forMblClass} md:${forLgClass}`}>
                                    <Users className="h-4 w-4" /> Manage Users
                                </NavLink>
                            </CardContent>
                        </Card>
                        <Card className="hover:bg-customNil hover:text-white">
                            <CardHeader className="font-bold">Approved Premium Candidate</CardHeader>
                            <CardContent>
                                <NavLink to="/dashboard/approvedPremium" className={`${forMblClass} md:${forLgClass}`}>
                                    <FaUserCheck className="h-4 w-4" /> Check Now
                                </NavLink>
                            </CardContent>
                        </Card>
                        <Card className="hover:bg-customNil hover:text-white">
                            <CardHeader className="font-bold">Approved Contact Request</CardHeader>
                            <CardContent>
                                <NavLink to="/dashboard/approvedContactRequest" className={`${forMblClass} md:${forLgClass}`}>
                                    <Contact2 className="h-4 w-4" /> Check Now
                                </NavLink>
                            </CardContent>
                        </Card>
                        <Card className="hover:bg-customNil hover:text-white">
                            <CardHeader className="font-bold">User Review</CardHeader>
                            <CardContent>
                                <NavLink to="/dashboard/userReview" className={`${forMblClass} md:${forLgClass}`}>
                                    <Table className="h-4 w-4" /> User Review
                                </NavLink>
                            </CardContent>
                        </Card>
                        <Card className="hover:bg-customNil hover:text-white">
                            <CardHeader className="font-bold">Logout</CardHeader>
                            <CardContent>
                                <button onClick={handleLogout} className={`${forMblClass} md:${forLgClass}`}>
                                    <LogOutIcon className="h-4 w-4" /> Logout
                                </button>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <>
                        <Card className="hover:bg-customNil hover:text-white">
                            <CardHeader className="font-bold">Edit/Add Candidate</CardHeader>
                            <CardContent>
                                {Candidate[0]?.CandidateID ? (
                                    <NavLink to="/dashboard/editCandidate" className={`${forMblClass} md:${forLgClass}`}>
                                        <Edit className="h-4 w-4" /> Edit Candidate
                                    </NavLink>
                                ) : (
                                    <NavLink to="/dashboard/addCandidate" className={`${forMblClass} md:${forLgClass}`}>
                                        <Edit className="h-4 w-4" /> Add Candidate
                                    </NavLink>
                                )}
                            </CardContent>
                        </Card>
                        <Card className="hover:bg-customNil hover:text-white">
                            <CardHeader className="font-bold">View Candidate</CardHeader>
                            <CardContent>
                                <NavLink to="/dashboard/viewCandidate" className={`${forMblClass} md:${forLgClass}`}>
                                    <View className="h-4 w-4" /> View Candidate
                                </NavLink>
                            </CardContent>
                        </Card>
                        <Card className="hover:bg-customNil hover:text-white">
                            <CardHeader className="font-bold">My Contact Requests</CardHeader>
                            <CardContent>
                                <NavLink to="/dashboard/myContactRequest" className={`${forMblClass} md:${forLgClass}`}>
                                    <Contact className="h-4 w-4" /> My Contact Requests
                                </NavLink>
                            </CardContent>
                        </Card>
                        <Card className="hover:bg-customNil hover:text-white">
                            <CardHeader className="font-bold">Favourites Candidate</CardHeader>
                            <CardContent>
                                <NavLink to="/dashboard/favouritesCandidate" className={`${forMblClass} md:${forLgClass}`}>
                                    <Heart className="h-4 w-4" /> Favourites Candidate
                                </NavLink>
                            </CardContent>
                        </Card>
                        <Card className="hover:bg-customNil hover:text-white">
                            <CardHeader className="font-bold">Give Review</CardHeader>
                            <CardContent>
                                <NavLink to="/dashboard/giveReview" className={`${forMblClass} md:${forLgClass}`}>
                                    <UserCircle className="h-4 w-4" /> Give Review
                                </NavLink>
                            </CardContent>
                        </Card>
                        <Card className="hover:bg-customNil hover:text-white">
                            <CardHeader className="font-bold">Logout</CardHeader>
                            <CardContent>
                                <button onClick={handleLogout} className={`${forMblClass} md:${forLgClass}`}>
                                    <LogOutIcon className="h-4 w-4" /> Logout
                                </button>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
