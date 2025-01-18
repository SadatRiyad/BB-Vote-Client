import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet-async";
import useAuth from "@/components/Hooks/useAuth/useAuth";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useAxiosSecure from "@/components/Hooks/useAxiosSecure/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useCandidates from "@/components/Hooks/useCandidates/useCandidates";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";

const CandidateForm = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [Candidates] = useCandidates();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isEditMode, setIsEditMode] = useState(false);
    const [candidate, setCandidate] = useState(null);
    const navigate = useNavigate();
    const redirect = '/dashboard/editCandidate';
    const id = candidate?._id;
    const prevCandidateID = Candidates.length;
    const newCandidateID = prevCandidateID + 1;
    const CandidateID = "CandidateID-" + newCandidateID;
    const isPremium = false;

    const [selectValues, setSelectValues] = useState({
        CandidateType: '',
        occupation: '',
        permanentDivision: '',
        presentDivision: '',
        party: '',
        position: '',
        education: '',
        experience: '',
        currentPosition: '',
    });

    const { data: myCandidate = [], isPending: loading, refetch } = useQuery({
        queryKey: ['myCandidate'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/Candidate/email/${user.email}`)
            if (res.data) {
                setCandidate(res.data);
                setIsEditMode(true);
                for (const [key, value] of Object.entries(res.data)) {
                    setValue(key, value);
                }
                setSelectValues({
                    CandidateType: res.data?.CandidateType || '',
                    occupation: res.data?.occupation || '',
                    permanentDivision: res.data?.permanentDivision || '',
                    presentDivision: res.data?.presentDivision || '',
                    party: res.data?.party || '',
                    position: res.data?.position || '',
                    education: res.data?.education || '',
                    experience: res.data?.experience || '',
                    currentPosition: res.data?.currentPosition || '',
                });
            }
            return [myCandidate, loading, refetch];
        },
    });

    useEffect(() => {
        if (isEditMode && candidate) {
            setSelectValues({
                CandidateType: candidate.CandidateType || '',
                occupation: candidate.occupation || '',
                permanentDivision: candidate.permanentDivision || '',
                presentDivision: candidate.presentDivision || '',
                party: candidate.party || '',
                position: candidate.position || '',
                education: candidate.education || '',
                experience: candidate.experience || '',
                currentPosition: candidate.currentPosition || '',
            });
        }
    }, [isEditMode, candidate]);

    if (loading) {
        return <div className="flex text-center items-center justify-center h-dvh w-dvw">Loading...</div>
    }

    const handleSelectChange = (name, value) => {
        setValue(name, value);
        setSelectValues(prev => ({ ...prev, [name]: value }));
    };


    const onSubmit = async (data) => {
        try {
            axiosSecure.patch(`/users/candidate/${user.email}`);

            if (isEditMode) {
                const response = await axiosSecure.put(`/Candidate/id/${id}`, data);
                if (response.data.acknowledged === true) {
                    toast.success("Candidate Updated successfully!");
                    refetch();
                }
            } else {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/Candidate`,
                    { ...data, email: user.email, CandidateID, isPremium },
                    { withCredentials: true }
                );
                if (response.data.acknowledged === true) {
                    toast.success("Candidate saved successfully!");
                    navigate(redirect);
                    refetch();
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(`Failed to ${isEditMode ? 'update' : 'save'} Candidate. Please try again.`);
        }
    };

    return (
        <div className="p-4 md:p-8 md:px-20 min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-400">
            <Helmet>
                <title>{isEditMode ? "Edit Candidate" : "Add Candidate"} | BB-Vote</title>
            </Helmet>
            <Card className="mx-auto max-w-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-blue-700">{isEditMode ? "Edit Candidate Information" : "Add New Candidate"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                        <div className="grid gap-2 form-control mb-1">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={isEditMode ? `${candidate?.name}` : ''} {...register("name", { required: "Full Name is required" })} placeholder="Candidate's Full Name" />
                            {errors.name && <span className="text-customRed text-sm mt-1">{errors.name.message}</span>}
                        </div>
                        <div className="grid gap-2 form-control mb-1">
                            <Label htmlFor="CandidateType">Candidate Type</Label>
                            <Select id="CandidateType" {...register("CandidateType", !isEditMode && { required: "Candidate Type is required" })} value={selectValues.CandidateType} onValueChange={(value) => handleSelectChange('CandidateType', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={isEditMode ? `${candidate?.CandidateType}` : "Select Candidate Type"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.CandidateType && <span className="text-customRed text-sm mt-1">{errors.CandidateType.message}</span>}
                        </div>

                        <div className="grid gap-2 form-control mb-1">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input defaultValue={isEditMode ? `${candidate?.dob}` : ''} id="dob" type="date" {...register("dob", { required: "Date of Birth is required" })} />
                            {errors.dob && <span className="text-customRed text-sm mt-1">{errors.dob.message}</span>}
                        </div>

                        <div className="grid gap-2 form-control mb-1">
                            <Label htmlFor="party">Political Party Name</Label>
                            <Input
                                id="party"
                                {...register("party", { required: "Political Party Name is required" })}
                                defaultValue={isEditMode ? candidate?.party : ''}
                                placeholder="Enter Political Party Name"
                            />
                            {errors.party && <span className="text-customRed text-sm mt-1">{errors.party.message}</span>}
                        </div>

                        <div className="grid gap-2 form-control mb-1">
                            <Label htmlFor="partyImage">Image Link</Label>
                            <Input
                                id="partyImage"
                                {...register("partyImage", { required: "Image Link is required" })}
                                defaultValue={isEditMode ? candidate?.partyImage : ''}
                                placeholder="http://example.com/image.jpg"
                            />
                            {errors.partyImage && <span className="text-customRed text-sm mt-1">{errors.partyImage.message}</span>}
                        </div>

                        <div className="grid gap-2 form-control mb-1">
                            <Label htmlFor="position">Running for Position</Label>
                            <Select id="position" {...register("position", { required: "Position is required" })} value={selectValues.position} onValueChange={(value) => handleSelectChange('position', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={isEditMode ? `${candidate?.position}` : "Select Position"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="President">President</SelectItem>
                                    <SelectItem value="Senator">Senator</SelectItem>
                                    <SelectItem value="Representative">Representative</SelectItem>
                                    <SelectItem value="Governor">Governor</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.position && <span className="text-customRed text-sm mt-1">{errors.position.message}</span>}
                        </div>

                        <div className="grid gap-2 form-control mb-1">
                            <Label htmlFor="currentPosition">Current Position</Label>
                            <Input id="currentPosition" defaultValue={isEditMode ? `${candidate?.currentPosition}` : ''} {...register("currentPosition", { required: "Current Position is required" })} placeholder="e.g. State Senator, Mayor" />
                            {errors.currentPosition && <span className="text-customRed text-sm mt-1">{errors.currentPosition.message}</span>}
                        </div>

                        <div className="grid gap-2 form-control mb-1">
                            <Label htmlFor="occupation">Occupation</Label>
                            <Select id="occupation" value={selectValues.occupation} onValueChange={(value) => handleSelectChange('occupation', value)} {...register("occupation", !isEditMode && { required: "Occupation is required" })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={isEditMode ? `${candidate?.occupation}` : "Select Occupation"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Student">Student</SelectItem>
                                    <SelectItem value="Job">Job</SelectItem>
                                    <SelectItem value="Politician">Politician</SelectItem>
                                    <SelectItem value="Lawyer">Lawyer</SelectItem>
                                    <SelectItem value="Business Executive">Business Executive</SelectItem>
                                    <SelectItem value="Doctor">Doctor</SelectItem>
                                    <SelectItem value="Teacher">Teacher</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.occupation && <span className="text-customRed text-sm mt-1">{errors.occupation.message}</span>}
                        </div>

                        <div className="grid gap-2 form-control mb-1">
                            <Label htmlFor="education">Highest Education</Label>
                            <Select id="education" {...register("education", { required: "Education is required" })} value={selectValues.education} onValueChange={(value) => handleSelectChange('education', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={isEditMode ? `${candidate?.education}` : "Select Education Level"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="High School">High School</SelectItem>
                                    <SelectItem value="Bachelor's">Bachelor&apos;s Degree</SelectItem>
                                    <SelectItem value="Master's">Master&apos;s Degree</SelectItem>
                                    <SelectItem value="Doctorate">Doctorate</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.education && <span className="text-customRed text-sm mt-1">{errors.education.message}</span>}
                        </div>

                        <div className="grid gap-2 form-control mb-1">
                            <Label htmlFor="permanentDivision">Permanent Division</Label>
                            <Select id="permanentDivision" value={selectValues.permanentDivision} onValueChange={(value) => handleSelectChange('permanentDivision', value)} {...register("permanentDivision", !isEditMode && { required: "Permanent Division is required" })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={isEditMode ? `${candidate?.permanentDivision}` : "Select Permanent Division"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Dhaka">Dhaka</SelectItem>
                                    <SelectItem value="Chattagram">Chattagram</SelectItem>
                                    <SelectItem value="Rangpur">Rangpur</SelectItem>
                                    <SelectItem value="Barisal">Barisal</SelectItem>
                                    <SelectItem value="Khulna">Khulna</SelectItem>
                                    <SelectItem value="Mymensingh">Mymensingh</SelectItem>
                                    <SelectItem value="Sylhet">Sylhet</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.permanentDivision && <span className="text-customRed text-sm mt-1">{errors.permanentDivision.message}</span>}
                        </div>

                        <div className="grid gap-2 form-control mb-1">
                            <Label htmlFor="presentDivision">Present Division</Label>
                            <Select id="presentDivision" value={selectValues.presentDivision} onValueChange={(value) => handleSelectChange('presentDivision', value)} {...register("presentDivision", !isEditMode && { required: "Present Division is required" })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={isEditMode ? `${candidate?.presentDivision}` : "Select Present Division"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Dhaka">Dhaka</SelectItem>
                                    <SelectItem value="Chattagram">Chattagram</SelectItem>
                                    <SelectItem value="Rangpur">Rangpur</SelectItem>
                                    <SelectItem value="Barisal">Barisal</SelectItem>
                                    <SelectItem value="Khulna">Khulna</SelectItem>
                                    <SelectItem value="Mymensingh">Mymensingh</SelectItem>
                                    <SelectItem value="Sylhet">Sylhet</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.presentDivision && <span className="text-customRed text-sm mt-1">{errors.presentDivision.message}</span>}
                        </div>

                        <div className="grid gap-2 form-control mb-1">
                            <Label htmlFor="experience">Years of Political Experience</Label>
                            <Input id="experience" type="number" defaultValue={isEditMode ? `${candidate?.experience}` : ''} {...register("experience", { required: "Experience is required" })} placeholder="Years of Experience" />
                            {errors.experience && <span className="text-customRed text-sm mt-1">{errors.experience.message}</span>}
                        </div>

                        <div className="grid gap-2 form-control mb-1">
                            <Label htmlFor="platform">Campaign Platform</Label>
                            <Input id="platform" defaultValue={isEditMode ? `${candidate?.platform}` : ''} {...register("platform", { required: "Campaign Platform is required" })} placeholder="Main Campaign Issues" />
                            {errors.platform && <span className="text-customRed text-sm mt-1">{errors.platform.message}</span>}
                        </div>

                        <div className="grid gap-2 form-control mb-1">
                            <Label htmlFor="email">Contact Email</Label>
                            <Input defaultValue={isEditMode ? `${candidate?.email}` : ''} id="email" type="email" value={user.email} readOnly />
                        </div>
                        <div className="grid gap-2 form-control mb-1">
                            <Label htmlFor="mobile">Mobile Number</Label>
                            <Input defaultValue={isEditMode ? `${candidate?.mobile}` : ''} id="mobile" {...register("mobile", { required: "Mobile Number is required" })} placeholder="Mobile Number" />
                            {errors.mobile && <span className="text-customRed text-sm mt-1">{errors.mobile.message}</span>}
                        </div>
                        <div className="grid gap-2 form-control mb-1">
                            <Label htmlFor="details">Candidate Details</Label>
                            <Textarea id="details" defaultValue={isEditMode ? `${candidate?.details}` : ''} {...register("details", { required: "Candidate Details are required" })} placeholder="Provide detailed information about the candidate" />
                            {errors.details && <span className="text-customRed text-sm mt-1">{errors.details.message}</span>}
                        </div>

                        <Button type="submit" className="w-full form-control mt-6 bg-blue-600 hover:bg-blue-700">
                            {isEditMode ? "Update Candidate" : "Add Candidate"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <ToastContainer />
        </div>
    );
};

export default CandidateForm;
