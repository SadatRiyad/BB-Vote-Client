import { useQuery } from "@tanstack/react-query";
import useAuth from "../useAuth/useAuth";
import useAxiosSecure from "../useAxiosSecure/useAxiosSecure";

const useMyCandidate = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { refetch, data: Candidate = [], isPending: loading, } = useQuery({
        queryKey: ['Candidate', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/Candidate/email/${user.email}`);
            return res.data;
        }
    })

    return [Candidate, refetch, loading]
};

export default useMyCandidate;