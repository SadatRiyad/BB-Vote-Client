/* eslint-disable react/prop-types */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import useAuth from '../../../Hooks/useAuth/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure/useAxiosSecure';
import { toast } from 'react-toastify';
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from 'react';

const ProfileCard = ({ profile }) => {
  const { CandidateID, name, partyImage, party, position, _id, CandidateType, presentDivision } = profile;
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavorite1, setIsFavorite1] = useState(false);
  const age = new Date().getFullYear() - new Date(profile.dob).getFullYear();
  // fetchFavorites with tanstack
  const { refetch, data: favorites = [], isPending: loadingFavorites } = useQuery({
    queryKey: ['favorites', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/favorites/${user.email}`);
      const isFavoriteExist = res.data.find((favorite) => favorite.CandidateID === CandidateID);
      if (isFavoriteExist) {
        setIsFavorite(isFavoriteExist);
        setIsFavorite1(true);
      } else {
        setIsFavorite1(false);
      }
      return res.data;
    },
    enabled: !!user?.email
  });

  useEffect(() => {
    console.log(favorites)
    if (favorites.length > 0) {
      const isFavoriteExist = favorites.find((favorite) => favorite.CandidateID === CandidateID);
      setIsFavorite(isFavoriteExist);
      refetch();
    }
  }, [favorites, CandidateID, refetch]);

  const handleAddToFavorites = async () => {
    try {
      const favData = {
        ID: _id,
        CandidateID,
        name,
        party,
        position,
        partyImage,
      };
      await axiosSecure.put(`/users/favorites/${user.email}`, favData);
      toast.success("Candidate added to favorites", { autoClose: 2000 });
      refetch();
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast.error("Error adding to favorites", { autoClose: 2000 });
    }
  };

  const handleRemoveFavorites = async () => {
    try {
      await axiosSecure.delete(`/users/favorites/${user.email}/${isFavorite?.id}`);
      toast.success("Candidate removed from favorites", { autoClose: 2000 });
      refetch();
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast.error("Error removing from favorites", { autoClose: 2000 });
    }
  };

  if (loadingFavorites) {
    return <div>Loading...</div>;
  }

  return (
    <Card data-aos="fade-up" data-aos-duration="1000" data-aos-anchor-placement="top-bottom" data-aos-delay="0" className="shadow-lg hover:drop-shadow-2xl">
      <CardHeader className="bg-customNil mb-4">
        <img data-aos="zoom-in" data-aos-duration="1000" data-aos-anchor-placement="top-bottom" data-aos-delay="0" src={partyImage} alt={`${party}`} className="bg-customGulabi text-white text-center p-1 h-32 w-32 mx-auto rounded-full" />
      </CardHeader>
      <CardContent>
        <div data-aos="fade-right" data-aos-duration="600" data-aos-anchor-placement="top-bottom" data-aos-delay="0">
          <CardTitle className="mb-1">{name}</CardTitle>
          <CardDescription>{CandidateID}</CardDescription>
          <CardDescription>Candidate Type: {CandidateType}</CardDescription>
          <CardDescription>Party: {party}</CardDescription>
          <CardDescription>Age: {age}</CardDescription>
          <CardDescription>Present Division: {presentDivision}</CardDescription>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Link to={`/Candidate/${CandidateID}`}>
            <Button data-aos="fade-up" data-aos-duration="500" data-aos-anchor-placement="top-bottom" data-aos-delay="0" className="bg-customGulabi hover:bg-customGulabi text-white">View Profile</Button>
          </Link>
          {isFavorite1 ? (
            <FaHeart className="text-red-500 cursor-pointer text-2xl" onClick={handleRemoveFavorites} />
          ) : (
            <FaRegHeart className="text-gray-500 cursor-pointer text-2xl" onClick={handleAddToFavorites} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
