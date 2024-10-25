import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../useAxiosSecure/useAxiosSecure";

const useCandidates = () => {
    const axiosSecure = useAxiosSecure();
    const { refetch, data: Candidates = [], isPending: loading, } = useQuery({
        queryKey: ['Candidates'],
        queryFn: async () => {
            const res = await axiosSecure.get('/Candidates');
            return res.data;
        }
    })

    return [Candidates, refetch, loading]
};

export default useCandidates;
