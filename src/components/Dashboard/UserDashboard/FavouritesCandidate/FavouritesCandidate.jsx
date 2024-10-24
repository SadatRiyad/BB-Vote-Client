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
import useAxiosSecure from "@/components/Hooks/useAxiosSecure/useAxiosSecure"
import { useQuery } from "@tanstack/react-query"
import useAuth from "@/components/Hooks/useAuth/useAuth"
import { useState } from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import { toast } from "react-toastify"
import { Helmet } from "react-helmet-async"

export default function FavouritesCandidate() {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [isFavorite, setIsFavorite] = useState([]);

    // removeFavorites
    const handleRemoveFavorites = (id) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, remove it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    axiosSecure.delete(`/users/favorites/${user.email}/${id}`)
                        .then((res) => {
                            if (res.data) {
                                Swal.fire({
                                    title: "Removed!",
                                    text: "Candidate removed from favorites",
                                    icon: "success"
                                });
                                refetch();
                            }
                        })
                }
            });

        } catch (error) {
            console.error("Error removing from favorites:", error);
            toast.error("Error removing from favorites", { autoClose: 2000 });
        }
    };

    // fetchFavorites with tanstack
    const { refetch, data: favorites = [], isPending: loadingFavorites, } = useQuery({
        queryKey: ['favorites', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/favorites/${user.email}`);
            const isFavoriteExist = res.data;
            setIsFavorite(isFavoriteExist);
            return [refetch, favorites, loadingFavorites];
        }
    })
    console.log(isFavorite)
    if (loadingFavorites) {
        return <div className="flex w-full items-center justify-center h-screen">Loading...</div>
    }

    return (
        <>
            {isFavorite.length > 0 ? (
                <Card>
                    <Helmet>
                        <title>Favourites Candidates | BB-Vote</title>
                    </Helmet>
                    <CardHeader>
                        <CardTitle>Favourites Candidates</CardTitle>
                        <CardDescription>
                            View and manage your favourite candidate profiles.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead className="w-[100px]">Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Candidate ID</TableHead>
                                    <TableHead>Party</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isFavorite.map((candidate, index) => (
                                    <TableRow key={candidate.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="sm:table-cell">
                                            <img
                                                alt="Profile"
                                                className="aspect-square rounded-md object-cover w-16 h-16 border border-customGulabi"
                                                src={candidate.partyImage || '/placeholder.svg'}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {candidate.name}
                                        </TableCell>
                                        <TableCell>
                                            {candidate.CandidateID}
                                        </TableCell>
                                        <TableCell>
                                            {candidate.party}
                                        </TableCell>
                                        <TableCell>
                                            {candidate.position}
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
                                                    <DropdownMenuItem><Link to={`/Candidate/${candidate.CandidateID}`}>View Details</Link></DropdownMenuItem>
                                                    <DropdownMenuItem><a onClick={() => handleRemoveFavorites(candidate.id)}>Remove from Favorites</a></DropdownMenuItem>
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
                    <h1 className="text-balance text-3xl mb-2 font-bold text-customNil">You have No Favourite Candidates...</h1>
                    <p className="text-sm text-balance px-4 text-center text-black">You have not added any candidates to your favourites yet. <br /> Add some candidates to your favourites to see them here.</p>
                    <Link to="/Candidates" className="btn btn-primary bg-customNil text-white mb-3 p-4 flex gap-1 w-fit mt-4 justify-center h-fit items-center">View Candidates</Link>
                </div>
            )}
        </>
    )
}
