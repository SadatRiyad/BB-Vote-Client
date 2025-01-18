import MainLayout from '@/Layouts/MainLayout/MainLayout';
import Home from '@/components/Home/Home';
import Login from '@/components/Login/Login';
import PrivateRoute from '@/Routes/PrivateRoute/PrivateRoute';
import Register from '@/components/Register/Register';
import ErrorPage from '@/components/Shered/ErrorPage/ErrorPage';
import { createBrowserRouter } from 'react-router-dom'
import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import Candidates from '@/components/Candidates/Candidates';
import AboutUs from '@/components/AboutUs/AboutUs';
import ContactUs from '@/components/ContactUs/ContactUs';
import ViewCandidate from '@/components/Dashboard/UserDashboard/ViewCandidate/ViewCandidate';
import CandidateForm from '@/components/Dashboard/UserDashboard/CandidateForm/CandidateForm';
import MyContactRequests from '@/components/Dashboard/UserDashboard/MyContactRequests/MyContactRequests';
import FavouritesVote from '@/components/Dashboard/UserDashboard/FavouritesCandidate/FavouritesCandidate';
import Dashboard from '@/components/Dashboard/Dashboard/Dashboard';
import AdminDashboard from '@/components/Dashboard/AdminDashboard/AdminDashboard/AdminDashboard';
import ManageUsers from '@/components/Dashboard/AdminDashboard/ManageUsers/ManageUsers';
import ApprovedPremium from '@/components/Dashboard/AdminDashboard/ApprovedPremium/ApprovedPremium';
import ApprovedContactRequest from '@/components/Dashboard/AdminDashboard/ApprovedContactRequest/ApprovedContactRequest';
import CandidateDetails from '@/components/CandidateDetails/CandidateDetails';
import GotReview from '@/components/Dashboard/UserDashboard/GiveReview/GiveReview';
import CheckoutPage from '@/components/CheckoutPage/CheckoutPage';
import WrappedCheckoutUpgrade from '@/components/CheckoutPage/CheckoutUpgrade';
import AdminRoute from './AdminRoute/AdminRoute';
import UserReview from '@/components/Dashboard/AdminDashboard/UserReview/UserReview';
import SeeCurrentVote from '@/components/Vote/SeeCurrentVote/SeeCurrentVote';
import ViewVoteResults from '@/components/Vote/ViewVoteResults/ViewVoteResults';
import ManageCandidates from '@/components/Dashboard/AdminDashboard/ManageCandidates/ManageCandidates';
import ElectionDashboard from '@/components/Dashboard/AdminDashboard/ElectionDashboard/ElectionDashboard';
import GiveVote from '@/components/Vote/GiveVote/GiveVote';
import GetResult from '@/components/Vote/GetResult/GetResult';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/Candidates",
        element: <PrivateRoute><Candidates></Candidates></PrivateRoute>,
      },
      {
        path: "/Candidate/:id",
        element: <PrivateRoute><CandidateDetails></CandidateDetails></PrivateRoute>,
        loader: ({ params }) => fetch(`${import.meta.env.VITE_API_URL}/Candidate/${params.id}`, { credentials: 'include' }),
      },
      {
        path: "/aboutUs",
        element: <AboutUs></AboutUs>,
      },
      {
        path: "/contactUs",
        element: <ContactUs></ContactUs>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
      {
        path: "/checkout/:id",
        element: <PrivateRoute><CheckoutPage></CheckoutPage></PrivateRoute>,
      },
      {
        path: "/checkout/upgrade/:id",
        element: <PrivateRoute><WrappedCheckoutUpgrade></WrappedCheckoutUpgrade></PrivateRoute>,
      },
      // for View vote
      {
        path: "/viewVoteResults",
        element: <PrivateRoute><ViewVoteResults></ViewVoteResults></PrivateRoute>,
      },
      {
        path: "/getResult/:id",
        element: <PrivateRoute><GetResult></GetResult></PrivateRoute>,
      },
      // for all the see current vote running and give vote
      {
        path: "/seeCurrentVote",
        element: <PrivateRoute><SeeCurrentVote></SeeCurrentVote></PrivateRoute>,
      },
      {
        path: "/giveVote/:id",
        element: <PrivateRoute><GiveVote></GiveVote></PrivateRoute>,
      }

    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      // Add dashboard routes here for user
      {
        path: "/dashboard",
        element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
      },
      {
        path: "viewCandidate",
        element: <PrivateRoute><ViewCandidate></ViewCandidate></PrivateRoute>,
      },
      {
        path: "addCandidate",
        element: <PrivateRoute><CandidateForm></CandidateForm></PrivateRoute>,
      },
      {
        path: "editCandidate",
        element: <PrivateRoute><CandidateForm></CandidateForm></PrivateRoute>,
        // loader: ({ params }) => fetch(`${import.meta.env.VITE_API_URL}/Candidate/id/${params.id}`, { credentials: 'include' }),
      },
      {
        path: "myContactRequest",
        element: <PrivateRoute><MyContactRequests></MyContactRequests></PrivateRoute>,
      },
      {
        path: "favouritesCandidate",
        element: <PrivateRoute><FavouritesVote></FavouritesVote></PrivateRoute>,
      },
      {
        path: "giveReview",
        element: <PrivateRoute><GotReview></GotReview></PrivateRoute>,
      },
      // for admin
      {
        path: "adminDashboard",
        element: <AdminRoute><PrivateRoute><AdminDashboard></AdminDashboard></PrivateRoute></AdminRoute>,
      },
      {
        path: "electionDashboard",
        element: <AdminRoute><PrivateRoute><ElectionDashboard></ElectionDashboard></PrivateRoute></AdminRoute>,
      },
      {
        path: "manageUsers",
        element: <AdminRoute><PrivateRoute><ManageUsers></ManageUsers></PrivateRoute></AdminRoute>,
      },
      {
        path: "manageCandidates",
        element: <AdminRoute><PrivateRoute><ManageCandidates></ManageCandidates></PrivateRoute></AdminRoute>,
      },
      {
        path: "approvedPremium",
        element: <AdminRoute><PrivateRoute><ApprovedPremium></ApprovedPremium></PrivateRoute></AdminRoute>,
      },
      {
        path: "approvedContactRequest",
        element: <AdminRoute><PrivateRoute><ApprovedContactRequest></ApprovedContactRequest></PrivateRoute></AdminRoute>,
      },
      {
        path: "userReview",
        element: <AdminRoute><PrivateRoute><UserReview></UserReview></PrivateRoute></AdminRoute>,
      },

    ]
  },
]);
