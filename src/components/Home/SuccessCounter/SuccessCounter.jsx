import useAxiosPublic from '@/components/Hooks/useAxiosPublic/useAxiosPublix';
import useCounter from '@/components/Hooks/useCounter/useCounter';
import { useEffect, useState } from 'react';

const SuccessCounter = () => {
  const axiosPublic = useAxiosPublic();
  const [counter, refetch, loading] = useCounter();
  const [counters, setCounters] = useState(counter);

  // using useEffect
  useEffect(() => {
    axiosPublic("/counters")
      .then((response) => {
        setCounters(response.data);
        refetch();
      })
  }, [axiosPublic, refetch]);

  if (loading) {
    <section className="bg-customGulabi text-white py-12 pb-20">
      <div className="container mx-auto text-center">
        <h5 className='text-4xl font-extrabold text-customNil mb-1'>_______</h5>
        <h2 className="text-4xl font-bold mb-16"><span className='text-customNil'>BB-Vote</span> User Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="p-6 border hover:bg-customNil border-customNil rounded-full shadow">
            <h3 className="text-2xl font-bold mb-2">Loading...</h3>
            <p className="text-lg">Total Candidates</p>
          </div>
          <div className="p-6 border hover:bg-customNil border-customNil rounded-full shadow">
            <h3 className="text-2xl font-bold mb-2">Loading...</h3>
            <p className="text-lg">Girls Candidates</p>
          </div>
          <div className="p-6 border hover:bg-customNil border-customNil rounded-full shadow">
            <h3 className="text-2xl font-bold mb-2">Loading...</h3>
            <p className="text-lg">Boys Candidates</p>
          </div>
          <div className="p-6 border hover:bg-customNil border-customNil rounded-full shadow">
            <h3 className="text-2xl font-bold mb-2">Loading...</h3>
            <p className="text-lg">userReviews Completed</p>
          </div>
        </div>
      </div>
    </section>
  }

  return (
    <section className="bg-customGulabi text-white py-12 pb-20">
      <div data-aos="zoom-in" data-aos-duration="1500" data-aos-anchor-placement="top-bottom" data-aos-delay="100" className="container mx-auto text-center">
        <h5 className='text-4xl font-extrabold text-customNil mb-1'>_______</h5>
        <h2 className="text-4xl font-bold mb-16"><span className='text-customNil'>BB-Vote</span> User Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="p-6 border hover:bg-customNil border-customNil rounded-full shadow">
            <h3 className="text-2xl font-bold mb-2">{counters.totalCandidates}</h3>
            <p className="text-lg">Total Candidates</p>
          </div>
          <div className="p-6 border hover:bg-customNil border-customNil rounded-full shadow">
            <h3 className="text-2xl font-bold mb-2">{counters.girlsCandidates}</h3>
            <p className="text-lg">Girls Candidates</p>
          </div>
          <div className="p-6 border hover:bg-customNil border-customNil rounded-full shadow">
            <h3 className="text-2xl font-bold mb-2">{counters.boysCandidates}</h3>
            <p className="text-lg">Boys Candidates</p>
          </div>
          <div className="p-6 border hover:bg-customNil border-customNil rounded-full shadow">
            <h3 className="text-2xl font-bold mb-2">{counters.userReviewsCompleted}</h3>
            <p className="text-lg">User Reviews Completed</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessCounter;


/* 
import useAxiosPublic from '@/components/Hooks/useAxiosPublic/useAxiosPublix';
import useCounter from '@/components/Hooks/useCounter/useCounter';
import { useEffect, useState } from 'react';

const SuccessCounter = () => {
  const axiosPublic = useAxiosPublic();
  const [counter, refetch, loading] = useCounter();
  const [counters, setCounters] = useState(counter);

  useEffect(() => {
    axiosPublic("/counters")
      .then((response) => {
        setCounters(response.data);
        refetch();
      })
  }, [axiosPublic, refetch]);

  if (loading) {
    return (
      <section className="bg-customGulabi text-white py-12 pb-20">
        <div className="container mx-auto text-center">
          <h5 className='text-4xl font-extrabold text-customNil mb-1'>_______</h5>
          <h2 className="text-4xl font-bold mb-16"><span className='text-customNil'>BB-Vote</span> Election Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {['Total Voters', 'Registered Candidates', 'Votes Cast', 'Polling Stations'].map((item) => (
              <div key={item} className="p-6 border hover:bg-customNil border-customNil rounded-full shadow">
                <h3 className="text-2xl font-bold mb-2">Loading...</h3>
                <p className="text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-customGulabi text-white py-12 pb-20">
      <div data-aos="zoom-in" data-aos-duration="1500" data-aos-anchor-placement="top-bottom" data-aos-delay="100" className="container mx-auto text-center">
        <h5 className='text-4xl font-extrabold text-customNil mb-1'>_______</h5>
        <h2 className="text-4xl font-bold mb-16"><span className='text-customNil'>BB-Vote</span> Election Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="p-6 border hover:bg-customNil border-customNil rounded-full shadow">
            <h3 className="text-2xl font-bold mb-2">{counters.totalVoters}</h3>
            <p className="text-lg">Total Voters</p>
          </div>
          <div className="p-6 border hover:bg-customNil border-customNil rounded-full shadow">
            <h3 className="text-2xl font-bold mb-2">{counters.registeredCandidates}</h3>
            <p className="text-lg">Registered Candidates</p>
          </div>
          <div className="p-6 border hover:bg-customNil border-customNil rounded-full shadow">
            <h3 className="text-2xl font-bold mb-2">{counters.votesCast}</h3>
            <p className="text-lg">Votes Cast</p>
          </div>
          <div className="p-6 border hover:bg-customNil border-customNil rounded-full shadow">
            <h3 className="text-2xl font-bold mb-2">{counters.pollingStations}</h3>
            <p className="text-lg">Polling Stations</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessCounter;
*/