import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import Swal from "sweetalert2"
import { Helmet } from "react-helmet-async"
import useAxiosPublic from "@/components/Hooks/useAxiosPublic/useAxiosPublix"
import useAxiosSecure from "@/components/Hooks/useAxiosSecure/useAxiosSecure"



const UserReview = () => {
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();

    // get the marriges data with tanstack query 
    const { data: reviews = [], refetch } = useQuery({
        queryKey: ['userReviews'],
        queryFn: async () => {
            const res = await axiosPublic.get('/userReviews');
            return res.data;
        }
    })

    const handleViewStory = (id) => {
        // find userReviewText with id
        const story = reviews.find((story) => story._id === id);
        // console.log(story)
        Swal.fire({
            imageUrl: story?.coupleImage,
            title: `User Review for ${story?.selfCandidateID} and ${story?.partnerCandidateID}, MarriageDate: ${story?.marriageDate} and given Review: ${story?.reviewStar}/5 Star.`,
            text: story.userReviewText,
            confirmButtonText: "Close",
            background: "#eee",
        });
    }
    const handleDeleteStory = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/userReviews/${id}`)
                    .then((res) => {
                        if (res.data) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "User Review removed from the list",
                                icon: "success"
                            });
                            refetch();
                        }
                    })
            }
        });
    }

    return (
        <>
            {reviews.length > 0 ? (
                <Card>
                    <Helmet>
                        <title>User Review | BB-Vote</title>
                    </Helmet>
                    <CardHeader>
                        <CardTitle>Total User Review: {reviews.length}</CardTitle>
                        <CardDescription>
                            View and manage all User Reviews.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Male Candidate Id</TableHead>
                                    <TableHead>Female Candidate Id</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reviews.map((request, index) => (
                                    <TableRow key={request._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{request.selfCandidateID}</TableCell>
                                        <TableCell>
                                            {request.partnerCandidateID}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem><a onClick={() => handleViewStory(request._id)}>View Story</a></DropdownMenuItem>
                                                    <DropdownMenuItem><a onClick={() => handleDeleteStory(request._id)}>Delete</a></DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : (
                <div className="flex -mt-8 flex-col w-full items-center justify-center text-center h-screen">
                    <h1 className="text-balance text-3xl mb-2 font-bold text-customNil">No User Review Found!</h1>
                    <p className="text-sm text-balance px-4 text-center text-white">
                        There are no User Review right now. when someone share, <br />it is shown here...
                    </p>
                </div>
            )}
        </>
    );
};

export default UserReview;