import { Helmet } from 'react-helmet-async';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Home.css';
import Hero from './Hero/Hero';
import ProfilesSection from './PremiumBanner/ProfilesSection/ProfilesSection';
import HowItWorks from './HowItWorks/HowItWorks';
import SuccessCounter from './SuccessCounter/SuccessCounter';
import UserReviewList from './UserReviewList/UserReviewList';
import useAuth from '../Hooks/useAuth/useAuth';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className='bg-base-300'>
            <Helmet>
                <title>Home | BB-Vote</title>
            </Helmet>
            <Hero></Hero>
            {user ? <ProfilesSection></ProfilesSection> : <></>}
            <HowItWorks></HowItWorks>
            <SuccessCounter></SuccessCounter>
            <UserReviewList></UserReviewList>
        </div>
    );
};

export default Home;