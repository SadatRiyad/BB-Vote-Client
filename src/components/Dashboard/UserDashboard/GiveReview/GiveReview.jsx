import { useState, useEffect } from "react";
import useAxiosSecure from "@/components/Hooks/useAxiosSecure/useAxiosSecure";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/components/Hooks/useAuth/useAuth";
import { ToastContainer, toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GiveReview() {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        reviewImage: "",
        reviewText: "",
        reviewDate: "",
        rating: "",
        submittedUserName: `${user.displayName}`,
        email: `${user.email}`,
    });

    useEffect(() => {
        const checkExistingReview = async () => {
            try {
                const response = await axiosSecure.get(`/userReviews/${user.email}`);
                if (response.data) {
                    setFormData(response.data);
                    setIsSubmitted(true);
                    setIsEditing(false);
                }
            } catch (error) {
                console.error("Error checking existing review:", error);
            }
        };

        checkExistingReview();
    }, [user.email, axiosSecure]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = isEditing ? 'put' : 'post';
            const endpoint = isEditing ? `/userReviews/${user.email}` : "/userReviews";
            const response = await axiosSecure[method](endpoint, formData);
            if (response.data) {
                toast.success(`Your review has been ${isEditing ? 'updated' : 'submitted'} successfully!`, { autoClose: 2000 });
                setIsSubmitted(true);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error(`Failed to ${isEditing ? 'update' : 'submit'} review. Please try again.`, { autoClose: 2000 });
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    if (isSubmitted && !isEditing) {
        return (
            <div className="container mx-auto px-0 py-6">
                <Helmet>
                    <title>Your Review | BB-Vote</title>
                </Helmet>
                <Card>
                    <CardHeader>
                        <CardTitle>Your Submitted Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-lg font-bold text-custom-primary">Hello <span className="text-customGulabi">{formData.name},</span></p>
                        <p className="text-center text-lg font-bold text-custom-primary">Thank you for your feedback.</p>
                        {/* review image */}
                        <div className="mt-4">
                            <img src={formData.reviewImage} alt="Review" className="w-full h-auto" />
                        </div>
                        <div className="mt-4">
                            <h3 className="font-bold">Your Review:</h3>
                            <p>{formData.reviewText}</p>
                            <p className="mt-2"><span className="font-bold">Review Date:</span> {formData.reviewDate}</p>
                            <p className="mt-2"><span className="font-bold">Role:</span> {formData.role}</p>
                            <p className="mt-2"><span className="font-bold">Rating:</span> {formData.rating} stars</p>
                        </div>
                        <Button onClick={handleEdit} className="mt-4">Edit Your Review</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-0 py-4">
            <Helmet>
                <title>{isEditing ? 'Edit Review' : 'Give Review'} | BB-Vote</title>
            </Helmet>
            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Your Review' : 'Share Your Review'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="selfName" className="block text-sm font-medium text-gray-700">
                                Your Name
                            </label>
                            <Input
                                id="selfName"
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="selfRole" className="block text-sm font-medium text-gray-700">
                                Your Role
                            </label>
                            <Select
                                id="selfRole"
                                name="role"
                                value={formData.role}
                                onValueChange={(value) => handleChange({ target: { name: 'role', value } })}
                                required
                            >
                                <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="User">User</SelectItem>
                                    <SelectItem value="Candidate">Candidate</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div>
                            <label htmlFor="reviewImage" className="block text-sm font-medium text-gray-700">
                                Review Image Link
                            </label>
                            <Input
                                id="reviewImage"
                                name="reviewImage"
                                type="url"
                                placeholder="Enter image URL for your review"
                                value={formData.reviewImage}
                                onChange={handleChange}
                                required
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700">
                                Your Review
                            </label>
                            <Textarea
                                id="reviewText"
                                name="reviewText"
                                placeholder="Write your review here..."
                                value={formData.reviewText}
                                onChange={handleChange}
                                required
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="reviewDate" className="block text-sm font-medium text-gray-700">
                                Review Date
                            </label>
                            <Input
                                id="reviewDate"
                                name="reviewDate"
                                type="date"
                                value={formData.reviewDate}
                                onChange={handleChange}
                                required
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                                Rating
                            </label>
                            <select
                                id="rating"
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select a rating</option>
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <option key={star} value={star}>
                                        {star} star{star > 1 ? 's' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Button type="submit" className="w-full">
                                {isEditing ? 'Update Review' : 'Submit Review'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <ToastContainer />
        </div>
    );
}
