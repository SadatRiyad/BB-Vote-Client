import { UserPlus, Search, Vote } from 'lucide-react';

const HowItWorks = () => {
    return (
        <section className="bg-gray-100 py-12 pb-16">
            <div data-aos="fade-up" data-aos-duration="1000" data-aos-anchor-placement="top-bottom" data-aos-delay="250" className="container mx-auto text-center">
                <h5 className='text-4xl font-extrabold text-customNil mb-1'>_______</h5>
                <h2 className="text-4xl font-bold text-customGulabi mb-10"><span className='text-customNil'>How</span> It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 border rounded shadow hover:bg-drop-shadow-xl text-white bg-customGulabi">
                        <UserPlus size={48} className="mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Step 1: Register to Vote</h3>
                        <p>Sign up as a voter by providing your necessary details. The process is quick and straightforward.</p>
                    </div>
                    <div className="p-6 border rounded shadow hover:drop-shadow-xl text-white bg-customNil">
                        <Search size={48} className="mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Step 2: Explore Candidates</h3>
                        <p>Browse through candidate profiles to learn about their backgrounds, positions, and platforms.</p>
                    </div>
                    <div className="p-6 border rounded shadow hover:drop-shadow-xl text-white bg-customGulabi">
                        <Vote size={48} className="mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Step 3: Cast Your Vote</h3>
                        <p>Use our secure voting system to cast your vote for your preferred candidate during the election period.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
