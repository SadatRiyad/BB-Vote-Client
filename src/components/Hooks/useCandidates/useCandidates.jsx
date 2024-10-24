import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../useAxiosPublic/useAxiosPublix";

const useCandidates = () => {
    const axiosPublic = useAxiosPublic();
    const { refetch, data: Candidates = [], isPending: loading, } = useQuery({
        queryKey: ['Candidates'],
        queryFn: async () => {
            const res = await axiosPublic.get('/Candidates');
            return res.data;
        }
    })

    return [Candidates, refetch, loading]
};

export default useCandidates;
