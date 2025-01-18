import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Swal from "sweetalert2";
import useAxiosSecure from "@/components/Hooks/useAxiosSecure/useAxiosSecure";
import { Badge } from "@/components/ui/badge";

const ManageCandidates = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch all candidates using TanStack Query
    const { data: candidates = [], isLoading, isError, refetch } = useQuery({
        queryKey: ["candidates"],
        queryFn: async () => {
            const response = await axiosSecure.get("/Candidates");
            return response.data;
        },
    });

    // Add Candidate
    const addCandidate = async () => {
        const { value: formValues } = await Swal.fire({
            title: "Add New Candidate",
            html: `
                <input type="text" id="name" class="swal2-input" placeholder="Name">
                <input type="text" id="party" class="swal2-input" placeholder="Party">
                <input type="text" id="position" class="swal2-input" placeholder="Position">
                <select id="status" class="swal2-input">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            `,
            focusConfirm: false,
            preConfirm: () => {
                const name = document.getElementById("name").value;
                const party = document.getElementById("party").value;
                const position = document.getElementById("position").value;
                const status = document.getElementById("status").value;

                if (!name || !party || !position || !status) {
                    Swal.showValidationMessage("All fields are required.");
                }
                return { name, party, position, status };
            },
        });

        if (formValues) {
            try {
                await axiosSecure.post("/Candidate", formValues);
                Swal.fire("Success", "Candidate added successfully!", "success");
                refetch();
            } catch (error) {
                Swal.fire("Error", "Failed to add candidate.", "error");
            }
        }
    };

    // Edit Candidate
    const editCandidate = async (candidate) => {
        const { value: formValues } = await Swal.fire({
            title: "Edit Candidate",
            html: `
            <div style="display: flex; flex-direction: column; gap: 10px; color: black w-full;">
                <input type="text" id="name" class="swal2-input" value="${candidate.name}" placeholder="Name">
                <input type="text" id="party" class="swal2-input" value="${candidate.party}" placeholder="Party">
                <input type="text" id="position" class="swal2-input" value="${candidate.position}" placeholder="Position">
                <select id="status" class="swal2-input border rounded mt-4 p-4 mx-auto">
                <option value="Active" ${candidate.status === "Active" ? "selected" : ""}>Active</option>
                <option value="Inactive" ${candidate.status === "Inactive" ? "selected" : ""}>Inactive</option>
                </select>
            </div>
            `,
            focusConfirm: false,
            preConfirm: () => {
            const name = document.getElementById("name").value;
            const party = document.getElementById("party").value;
            const position = document.getElementById("position").value;
            const status = document.getElementById("status").value;

            if (!name || !party || !position || !status) {
                Swal.showValidationMessage("All fields are required.");
            }
            return { name, party, position, status };
            },
        });

        if (formValues) {
            try {
                await axiosSecure.put(`/Candidate/id/${candidate._id}`, formValues);
                Swal.fire("Success", "Candidate updated successfully!", "success");
                refetch();
            } catch (error) {
                Swal.fire("Error", "Failed to update candidate.", "error");
            }
        }
    };

    // Delete Candidate
    const deleteCandidate = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/Candidate/${id}`);
                    Swal.fire("Deleted!", "Candidate has been removed.", "success");
                    refetch();
                } catch (error) {
                    Swal.fire("Error", "Failed to delete candidate.", "error");
                }
            }
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (isLoading) {
        return <div>Loading candidates...</div>;
    }

    if (isError) {
        return <div className="text-red-500 text-center">Failed to load candidates.</div>;
    }

    return (
        <Card>
            <CardHeader>
                <div className="justify-between flex mb-0 items-center">
                    <CardTitle>Manage Candidates</CardTitle>
                    <Button onClick={addCandidate}>Add Candidate</Button>
                </div>
                <CardDescription>
                    Admin can manage candidates, add, edit, or delete them.
                </CardDescription>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search by candidate name"
                    className="mt-4 p-2 border rounded"
                />
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Party</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {candidates?.filter((candidate) =>
                                candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((candidate, index) => (
                                <TableRow key={candidate._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{candidate.name}</TableCell>
                                    <TableCell>{candidate.party}</TableCell>
                                    <TableCell>{candidate.position}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={
                                                candidate.status === "Active"
                                                    ? "capitalize bg-green-500 px-6 py-1"
                                                    : "capitalize bg-gray-500 px-6 py-1"
                                            }
                                        >
                                            {candidate.status}
                                        </Badge>
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
                                                <DropdownMenuItem>
                                                    <a onClick={() => editCandidate(candidate)}>Edit</a>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <a onClick={() => deleteCandidate(candidate._id)}>Delete</a>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default ManageCandidates;
