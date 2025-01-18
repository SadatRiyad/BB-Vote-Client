import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '@/components/Hooks/useAxiosSecure/useAxiosSecure';
import Swal from "sweetalert2"
import { useNavigate } from 'react-router-dom';

const ElectionDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentElection, setCurrentElection] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Fetch elections using TanStack Query (v5)
    const { data: elections = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ['elections'],
        queryFn: async () => {
            const response = await axiosSecure.get('/elections');
            if (!response.data.success) {
                throw new Error('Failed to fetch elections');
            }
            return response.data.elections;
        },
    });

    // Mutations for creating, updating, and deleting elections
    const createElectionMutation = useMutation({
        mutationFn: async (newElection) => {
            const response = await axiosSecure.post('/elections', newElection);
            return response.data.election;
        },
        onSuccess: (newElection) => {
            queryClient.invalidateQueries({ queryKey: ['elections'] });
            console.log('New Election:', newElection);
            setIsModalOpen(false);
            setCurrentElection(null);
            Swal.fire({
                icon: 'success',
                title: 'Election created successfully!',
            });
        },
        onError: () => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to create election.',
            });
        },
    });

    const updateElectionMutation = useMutation({
        mutationFn: async ({ id, updatedElection }) => {
            await axiosSecure.put(`/elections/${id}`, updatedElection);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['elections'] });
            setIsModalOpen(false);
            setCurrentElection(null);
            Swal.fire({
                icon: 'success',
                title: 'Election updated successfully!',
            });
        },
        onError: () => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to update election.',
            });
        },
    });

    const deleteElectionMutation = (id) => {
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
                axiosSecure.delete(`/elections/${id}`)
                    .then((res) => {
                        if (res.data) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Election deleted successfully!",
                                icon: "success"
                            });
                            refetch();
                        }
                    })
            }
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const electionData = {
            name: formData.get('name'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            status: formData.get('status'),
        };

        if (!electionData.name || !electionData.startDate || !electionData.endDate || !electionData.status) {
            alert('All fields are required.');
            return;
        }

        setIsSubmitting(true);

        try {
            if (currentElection) {
                // Update existing election
                updateElectionMutation.mutate({
                    id: currentElection._id,
                    updatedElection: electionData,
                });
            } else {
                // Create new election
                createElectionMutation.mutate(electionData);
            }
        } catch (err) {
            console.error('Failed to submit election:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Open modal for create or edit
    const openModal = (election = null) => {
        setCurrentElection(election);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentElection(null);
    };

    if (isLoading) return <div>Loading elections...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Election Dashboard:</h1>
            <button
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => openModal()}
            >
                Create Election
            </button>
            {elections.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">Election Name</th>
                            <th className="border border-gray-300 p-2">Start Date</th>
                            <th className="border border-gray-300 p-2">End Date</th>
                            <th className="border border-gray-300 p-2">Status</th>
                            <th className="border border-gray-300 p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {elections.map((election) => (
                            <tr key={election._id}>
                                <td className="border border-gray-300 p-2">{election.name}</td>
                                <td className="border border-gray-300 p-2">{new Date(election.startDate).toLocaleDateString()}</td>
                                <td className="border border-gray-300 p-2">{new Date(election.endDate).toLocaleDateString()}</td>
                                <td className="border border-gray-300 p-2">{election.status}</td>
                                <td className="border border-gray-300 p-2">
                                    <button
                                        className="mr-2 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700"
                                        onClick={() => openModal(election)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                                        onClick={() => deleteElectionMutation(election._id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => navigate(`/getResult/${election._id}`)}
                                        className="mt-1 w-full h-fit py-1 px-2 flex justify-center items-center bg-customBlue text-white rounded-lg hover:bg-blue-900 focus:ring-4 focus:ring-blue-300"
                                    >
                                        Get Result 
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>No elections available.</div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">
                            {currentElection ? 'Edit Election' : 'Create Election'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={currentElection?.name || ''}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    defaultValue={currentElection?.startDate?.split('T')[0] || ''}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    defaultValue={currentElection?.endDate?.split('T')[0] || ''}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    name="status"
                                    defaultValue={currentElection?.status || 'Upcoming'}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    required
                                >
                                    <option value="Upcoming">Upcoming</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : currentElection ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ElectionDashboard;
