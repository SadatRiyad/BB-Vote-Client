import useAxiosSecure from "@/components/Hooks/useAxiosSecure/useAxiosSecure";
import useMyCandidate from "@/components/Hooks/useCandidates/useMyCandidate";
import { Helmet } from "react-helmet-async";
import { IoDiamond } from "react-icons/io5";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const ViewCandidate = () => {
    const img = 'https://cdn.dribbble.com/users/1489103/screenshots/6326497/no-data-found.png';
    const [Vote, refetch] = useMyCandidate();
    const axiosSecure = useAxiosSecure();
    const isPremium = "pending";
    const data = { isPremium };

    const {
        _id,
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
        CandidateID,
        isPremium: Premium
    } = Vote;

    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    const handleMakePremium = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to make your Candidate premium?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, make it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.put(`/Candidate/id/${_id}`, data)
                    .then((res) => {
                        console.log(res.data)
                        if (res.data.acknowledged === true) {
                            refetch();
                            Swal.fire({
                                title: "Request Sent!",
                                text: "Your request to make the Candidate premium has been sent.",
                                icon: "success"
                            });
                        }
                    })
            }
        });
    };
    return (
        <div className="container px-0 mx-auto">
            <Helmet>
                <title>View Candidate | BB-Vote</title>
            </Helmet>
            {Vote ? (
                <div className="Candidate-Details">
                    <h1 className="text-4xl font-bold text-center bg-customGulabi pt-1 pb-3 text-white border-x-4 border-x-customNil  border-t-4 border-t-customNil"><span className='text-4xl font-extrabold text-customNil'>_______</span> <br />{CandidateID}</h1>
                    <div className="flex flex-col lg:flex-row border-4 border-customNil bg-customGulabi text-white p-6 lg:items-center">
                        <img data-aos="fade-right" data-aos-duration="1000" data-aos-anchor-placement="top-bottom" data-aos-delay="0" src={partyImage} alt={party} className="min-h-60 max-h-screen w-full lg:w-2/4 rounded-lg lg:mr-8 border-4 border-customNil" />
                        <div data-aos="fade-left" data-aos-duration="1000" data-aos-anchor-placement="top-bottom" data-aos-delay="0" className="lg:ml-5 mt-5 lg:mt-5">
                            <h2 className="text-3xl md:text-5xl font-bold mb-2 text-customNil">{name}</h2>
                            <p className="text-base md:text-lg">Your Age: <span className="text-customNil ml-1 font-semibold">{age}</span></p>
                            <p className="text-base md:text-lg">Gender: <span className="text-customNil ml-1 font-semibold">{CandidateType}</span></p>
                            <p className="text-base md:text-lg">Date of Birth: <span className="text-customNil ml-1 font-semibold">{dob}</span></p>
                            <p className="text-base md:text-lg">Party: <span className="text-customNil ml-1 font-semibold">{party}</span></p>
                            <p className="text-base md:text-lg">Position: <span className="text-customNil ml-1 font-semibold">{position}</span></p>
                            <p className="text-base md:text-lg">Current Position: <span className="text-customNil ml-1 font-semibold">{currentPosition}</span></p>
                            <p className="text-base md:text-lg">Occupation: <span className="text-customNil ml-1 font-semibold">{occupation}</span></p>
                            <p className="text-base md:text-lg">Education: <span className="text-customNil ml-1 font-semibold">{education}</span></p>
                            <p className="text-base md:text-lg">Permanent Division: <span className="text-customNil ml-1 font-semibold">{permanentDivision}</span></p>
                            <p className="text-base md:text-lg">Present Division: <span className="text-customNil ml-1 font-semibold">{presentDivision}</span></p>
                            <p className="text-base md:text-lg">Experience: <span className="text-customNil ml-1 font-semibold">{experience} years</span></p>
                            <p className="text-base md:text-lg">Platform: <span className="text-customNil ml-1 font-semibold">{platform}</span></p>
                            <p className="text-base md:text-lg">Email: <span className="text-customNil ml-1 font-semibold">{email}</span></p>
                            <p className="text-base md:text-lg">Phone: <span className="text-customNil ml-1 font-semibold">{mobile}</span></p>
                            <p className="text-base md:text-lg">Details: <span className="text-customNil ml-1 font-semibold">{details}</span></p>
                            <div data-aos="zoom-in" data-aos-duration="1000" data-aos-anchor-placement="top-bottom" data-aos-delay="0" className="md:flex gap-4 mt-6 w-full h-fit mb-4">
                                {
                                    Premium === "pending" ? (
                                        <button
                                            className="btn btn-primary bg-gray-500 text-white mb-3 p-4 flex gap-1 w-full justify-center h-fit items-center"
                                            disabled
                                        >
                                            Already Requested for Premium <IoDiamond />
                                        </button>
                                    ) : Premium === true ? (
                                        <button
                                            className="btn btn-primary bg-customNil text-white mb-3 p-4 flex gap-1 w-full justify-center h-fit items-center"
                                            disabled
                                        >
                                            Your Candidate is Already Premium <IoDiamond />
                                        </button>)
                                        : Premium === false ? (
                                            <button
                                                className="btn btn-primary bg-customNil text-white mb-3 p-4 flex gap-1 w-full justify-center h-fit items-center"
                                                onClick={handleMakePremium}
                                            >
                                                Make Candidate to Premium <IoDiamond />
                                            </button>)
                                            : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="candidate-details">
                    <h1 className="text-4xl font-bold text-center bg-customGulabi pt-1 pb-3 text-white border-x-4 border-x-customNil  border-t-4 border-t-customNil"><span className='text-4xl font-extrabold text-customNil'>_______</span> <br />View Candidate</h1>
                    <div className="flex flex-col lg:flex-row border-4 border-customNil bg-customGulabi text-white p-6 lg:items-center">
                        <img data-aos="fade-right" data-aos-duration="1000" data-aos-anchor-placement="top-bottom" data-aos-delay="0" src={img} alt={name} className="min-h-60 w-full lg:w-2/4 rounded-lg lg:mr-8 border-4 border-customNil" />
                        <div data-aos="fade-left" data-aos-duration="1000" data-aos-anchor-placement="top-bottom" data-aos-delay="0" className="lg:ml-5 mt-5 lg:mt-5">
                            <h2 className="text-3xl md:text-5xl font-bold mb-2 text-customNil">No Candidate Found!</h2>
                            <p className="text-base lg:text-lg text-balance">Please create your Candidate to view it here. Click the button below to create your Candidate.</p>
                            <div data-aos="zoom-in" data-aos-duration="1000" data-aos-anchor-placement="top-bottom" data-aos-delay="0" className="md:flex gap-4 mt-6 w-full h-fit mb-4">
                                <Link to="/dashboard/addCandidate" className="btn btn-primary bg-customNil text-white mb-3 p-4 flex gap-1 w-full justify-center h-fit items-center"> Create Candidate </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewCandidate;