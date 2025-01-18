/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import ProfileCard from '../ProfileCard/ProfileCard';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import useCandidates from '@/components/Hooks/useCandidates/useCandidates';

const ProfilesSection = () => {
    const [profiles, setProfiles] = useState([]);
    const [sortOrder, setSortOrder] = useState('ascending');
    const [Candidates] = useCandidates();
    const profileData = Candidates?.filter(candidate => candidate?.isPremium === true).slice(0, 6);

    useEffect(() => {
        const sortedProfiles = [...profileData].sort((a, b) => {
            const ageA = new Date().getFullYear() - new Date(a.dob).getFullYear();
            const ageB = new Date().getFullYear() - new Date(b.dob).getFullYear();
            return sortOrder === 'ascending' ? ageA - ageB : ageB - ageA;
        });
        setProfiles(sortedProfiles);
    }, [profileData, sortOrder]);

    return (
        <div className="container mx-auto py-12 bg-slate-200" id='premium'>
            <div className="flex flex-col md:flex-row justify-between mb-12 items-center">
                <div data-aos="zoom-in" data-aos-duration="800" data-aos-anchor-placement="top-bottom" data-aos-delay="0" className='mb-6 md:mb-0 text-center md:text-left'>
                    <h5 className='text-4xl font-extrabold text-customNil mb-1'>_______</h5>
                    <h2 className="text-4xl font-bold text-customGulabi"><span className='text-customNil'>Premium</span> Candidates</h2>
                    <p className="">Check out the top six premium candidates</p>
                </div>
                <div data-aos="zoom-in" data-aos-duration="800" data-aos-anchor-placement="top-bottom" data-aos-delay="0" >
                    <Select onValueChange={setSortOrder}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by Age" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Sort by Age</SelectLabel>
                                <SelectItem value="ascending">Youngest to Oldest</SelectItem>
                                <SelectItem value="descending">Oldest to Youngest</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                    <ProfileCard key={profile._id} profile={profile} />
                ))}
            </div>
        </div>
    );
};

export default ProfilesSection;
