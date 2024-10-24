/* eslint-disable react/prop-types */
import { useLoaderData, useNavigate } from "react-router-dom"; 
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaHeart, FaEnvelope, FaPhone } from "react-icons/fa";
import useAxiosSecure from "../Hooks/useAxiosSecure/useAxiosSecure";
import { ContactRoundIcon, HeartOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../Hooks/useAuth/useAuth";
import ProfileCard from "../Home/PremiumBanner/ProfileCard/ProfileCard";
import { Helmet } from "react-helmet-async";

const CandidateDetails = () => {
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const Candidate = useLoaderData();
    const { user } = useAuth();
    const CandidateIDs = Candidate._id;
    const [isFavorite, setIsFavorite] = useState([]);
    const [isFavorite1, setIsFavorite1] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    const [similarCandidates, setSimilarCandidates] = useState([]);

    // fetchCandidate with tanstack
    const { refetch: refetch1, data: users = [], isPending: loading, } = useQuery({
        queryKey: ['Candidate', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/email/${user.email}`);
            if (res.data) {
                // check users if their isPremium available
                setIsPremium(res.data?.isPremium);
            }
            return [users, refetch1, loading];
        }
    })

    // fetchFavorites with tanstack
    const { refetch, data: favorites = [], isPending: loadingFavorites, } = useQuery({
        queryKey: ['favorites', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/favorites/${user.email}`);
            const isFavoriteExist = res.data.find((favorite) => favorite.CandidateID === Candidate.CandidateID);
            if (isFavoriteExist) {
                setIsFavorite(isFavoriteExist);
                setIsFavorite1(true);
            } else {
                setIsFavorite1(false);
            }
            return [refetch, favorites, loadingFavorites];
        }
    })

    // fetchSimilarCandidates with tanstack
    const { refetch: refetchSimilar, data: similarCandidatesData = [], isPending: loadingSimilarCandidates, } = useQuery({
        queryKey: ['similarCandidates', Candidate.CandidateType, CandidateIDs],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/Candidates`, { withCredentials: true });
            const fetchedSimilarCandidates = res.data.filter(
                (b) => b.CandidateType === Candidate.CandidateType && b._id !== CandidateIDs
            ).slice(0, 3);
            setSimilarCandidates(fetchedSimilarCandidates);
            return [similarCandidatesData, refetchSimilar, loadingSimilarCandidates];
        }
    })
    if (loading || loadingFavorites || loadingSimilarCandidates) {
        <div className="flex w-full items-center justify-center h-screen">Loading...</div>
    }

    // add favorites
    const handleAddToFavorites = async () => {
        try {
            const favData = {
                ID: CandidateIDs,
                CandidateID: Candidate.CandidateID,
                name: Candidate.name,
                party: Candidate.party,
                position: Candidate.position,
                partyImage: Candidate.partyImage,
            };
            await axiosSecure.put(`/users/favorites/${user.email}`, favData)
                .then((res) => {
                    if (res.data) {
                        toast.success("Candidate added to favorites", { autoClose: 2000 });
                        refetch();
                    }
                })
        } catch (error) {
            console.error("Error adding to favorites:", error);
            toast.error("Error adding to favorites", { autoClose: 2000 });
        }
    };

    // removefavorites
    const handleRemoveFavorites = async () => {
        try {
            await axiosSecure.delete(`/users/favorites/${user.email}/${isFavorite?.id}`)
                .then((res) => {
                    if (res.data) {
                        toast.success("Candidate removed from favorites", { autoClose: 2000 });
                        refetch();
                    }
                })
        } catch (error) {
            console.error("Error removing from favorites:", error);
            toast.error("Error removing from favorites", { autoClose: 2000 });
        }
    };

    const handleRequestContactInfo = () => {
        navigate(`/checkout/${CandidateID}`);
    };

    const {
        name,
        CandidateType,
        dob,
        party,
        partyImage,
        position,
        currentPosition,
        occupation,
        education,
        permanentDivision,
        presentDivision,
        experience,
        platform,
        mobile,
        details,
        email,
        CandidateID
    } = Candidate;

    const age = new Date().getFullYear() - new Date(dob).getFullYear();

    return (
        <div className="container px-0 mx-auto">
            <Helmet>
                <title>{CandidateID} | BB-Vote</title>
            </Helmet>
            {Candidate ? (
                <div className="Candidate-details">
                    <h1 className="text-4xl font-bold text-center bg-customGulabi pt-1 pb-3 text-white border-x-4 border-x-customNil  border-t-4 border-t-customNil"><span className='text-4xl font-extrabold text-customNil'>_______</span> <br />{CandidateID}</h1>
                    <div className="flex flex-col lg:flex-row border-4 border-customNil bg-customGulabi text-white p-6 lg:items-center">
                        <img data-aos="fade-right" data-aos-duration="1000" data-aos-anchor-placement="top-bottom" data-aos-delay="0" src={partyImage} alt={name} className="w-full min-h-60 max-h-screen lg:w-2/4 rounded-lg lg:mr-8 border-4 border-customNil" />
                        <div data-aos="fade-left" data-aos-duration="1000" data-aos-anchor-placement="top-bottom" data-aos-delay="0" className="lg:ml-5 mt-5 lg:mt-5">
                            <h2 className="text-3xl md:text-5xl font-bold mb-2 text-customNil">{name}</h2>
                            <p className="text-lg">Age: <span className="text-customNil ml-1 font-semibold">{age}</span></p>
                            <p className="text-lg">Gender: <span className="text-customNil ml-1 font-semibold">{CandidateType}</span></p>
                            <p className="text-lg">Date of Birth: <span className="text-customNil ml-1 font-semibold">{dob}</span></p>
                            <p className="text-lg">Party: <span className="text-customNil ml-1 font-semibold">{party}</span></p>
                            <p className="text-lg">Position: <span className="text-customNil ml-1 font-semibold">{position}</span></p>
                            <p className="text-lg">Current Position: <span className="text-customNil ml-1 font-semibold">{currentPosition}</span></p>
                            <p className="text-lg">Occupation: <span className="text-customNil ml-1 font-semibold">{occupation}</span></p>
                            <p className="text-lg">Education: <span className="text-customNil ml-1 font-semibold">{education}</span></p>
                            <p className="text-lg">Permanent Division: <span className="text-customNil ml-1 font-semibold">{permanentDivision}</span></p>
                            <p className="text-lg">Present Division: <span className="text-customNil ml-1 font-semibold">{presentDivision}</span></p>
                            <p className="text-lg">Experience: <span className="text-customNil ml-1 font-semibold">{experience} years</span></p>
                            <p className="text-lg">Platform: <span className="text-customNil ml-1 font-semibold">{platform}</span></p>
                            <p className="text-lg">Details: <span className="text-customNil ml-1 font-semibold">{details}</span></p>
                            <div className="gap-4 my-4">
                                <a href={isPremium ? `mailto:${email}` : '#PremiumReq'} className="btn btn-info flex items-center text-base lg:text-lg">
                                    <FaEnvelope className="mr-1" />Email: <span className="text-customNil ml-1 font-semibold">{isPremium ? `${email}` : "(Premium members can see this)"}</span>
                                </a>
                                <a href={isPremium ? `tel:${mobile}` : '#PremiumReq'} className="btn btn-info flex items-center text-base lg:text-lg">
                                    <FaPhone className="mr-1" />Phone: <span className="text-customNil ml-1 font-semibold">{isPremium ? `${mobile}` : "(Premium members can see this)"}</span>
                                </a>
                            </div>

                            <div data-aos="zoom-in" data-aos-duration="1000" data-aos-anchor-placement="top-bottom" data-aos-delay="0" className="md:flex gap-4 mt-6 w-full h-fit mb-4">
                                {isFavorite1 ? (
                                    <button
                                        className="btn btn-primary bg-primary-foreground font-bold border-2 text-customNil justify-center border-customNil mb-3 p-4 flex gap-1 w-full md:w-fit h-fit items-center"
                                        onClick={handleRemoveFavorites}
                                    >
                                        <HeartOff className="text-customNil" /> Remove from Favorites
                                    </button>)
                                    : (
                                        <button
                                            className="btn btn-primary bg-customNil border-2 border-customNil justify-center text-white mb-3 p-4 flex gap-1 w-full md:w-fit h-fit items-center"
                                            onClick={handleAddToFavorites}
                                        >
                                            <FaHeart /> Add to Favorites
                                        </button>
                                    )}
                                {!isPremium && (
                                    <button
                                        id="PremiumReq"
                                        className="btn btn-secondary bg-customNil justify-center text-white p-4 flex gap-1 w-full md:w-fit h-fit items-center"
                                        onClick={handleRequestContactInfo}
                                    >
                                        <ContactRoundIcon />
                                        Request Contact Info
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {similarCandidates.length > 0 && (
                        <div className="container mx-auto py-12 pb-16 bg-slate-200" id='similar'>
                            <div className="flex flex-col md:flex-row justify-between mb-12 items-center">
                                <div data-aos="fade-right" data-aos-duration="1000" data-aos-anchor-placement="top-bottom" data-aos-delay="0" className='mb-6 md:mb-0 text-center md:text-left'>
                                    <h5 className='text-4xl font-extrabold text-customNil mb-1'>_______</h5>
                                    <h2 className="text-4xl font-bold text-customGulabi"><span className='text-customNil'>Similar</span> Candidates</h2>
                                    <p className="">Check out other three similar Candidates profile cards</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                                {similarCandidates.map((profile) => (
                                    <ProfileCard key={profile._id} profile={profile} refetch={refetch} isFavorite={isFavorite} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex w-full items-center justify-center h-screen">
                    Loading...
                </div>
            )}
        </div>
    );
};

export default CandidateDetails;
