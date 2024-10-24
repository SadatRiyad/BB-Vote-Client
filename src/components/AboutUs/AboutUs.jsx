import { Helmet } from 'react-helmet-async';
import aboutPic from '../../assets/about.jpg';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const AboutUs = () => {
    return (
        <div className="container mx-auto px-4 pt-0 pb-4 bg-customNil text-white border-b-8">
            <Helmet>
                <title>About Us | BB-Vote</title>
            </Helmet>
            <div className='w-full p-4 h-fit'>
                <div data-aos="zoom-in" data-aos-duration="700" data-aos-anchor-placement="top-bottom" data-aos-delay="50" className='w-full h-fit rounded-lg'>
                    <img className='w-full rounded-lg' src={aboutPic} alt="" />
                </div>
            </div>
            <div data-aos="zoom-in" data-aos-duration="700" data-aos-anchor-placement="top-bottom" data-aos-delay="500" className='text-center md:mt-12 mb-10 mx-1'>
                <h1 className="text-2xl md:text-4xl font-bold mb-5 md:mb-7">Welcome to <span className='text-customGulabi'>&apos;BB-Vote&apos;</span></h1>
                <p className="text-sm md:text-base mb-4 md:mx-2">
                    Welcome to BB-Vote, your trusted platform for secure and transparent voting using blockchain technology. Whether you&apos;re participating in an election or organizing one, we&apos;re here to ensure a fair and efficient voting process.
                </p>
                <p className="text-sm md:text-base mb-4 md:mx-2">
                    Our dedicated team of blockchain experts and voting specialists is committed to providing you with a cutting-edge voting experience. From tamper-proof ballot casting to real-time result tracking, we offer a range of features to ensure the integrity and transparency of every vote.
                </p>
                <p className="text-sm md:text-base mb-4 md:mx-2">
                    At BB-Vote, we understand that trust is paramount in any voting system. That&apos;s why we leverage the power of blockchain to create an immutable and verifiable record of every vote. With our platform, you can participate in or organize elections with complete confidence in the results.
                </p>
            </div>
            <div className="md:pt-12 px-1 mb-8">
                <Accordion type="single" collapsible>
                    <AccordionItem className="bg-customGulabi focus:bg-customGulabi px-4 rounded-t-lg" data-aos="fade-up" data-aos-duration="700" data-aos-anchor-placement="top-bottom" data-aos-delay="200" value="item-1">
                        <AccordionTrigger className="text-xl font-medium">
                            Q: What sets BB-Vote apart from traditional voting systems?
                        </AccordionTrigger>
                        <AccordionContent>
                            <p>Ans: BB-Vote utilizes blockchain technology to ensure unparalleled security and transparency in the voting process. Our system provides immutable records, real-time tracking, and eliminates the possibility of double-voting or tampering, setting us apart from conventional voting methods.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem className="bg-customGulabi focus:bg-customGulabi px-4" data-aos="fade-up" data-aos-duration="700" data-aos-anchor-placement="top-bottom" data-aos-delay="300" value="item-2">
                        <AccordionTrigger className="text-xl font-medium">
                            Q: How secure is the BB-Vote platform?
                        </AccordionTrigger>
                        <AccordionContent>
                            <p>Ans: BB-Vote employs state-of-the-art blockchain technology and encryption methods to ensure the highest level of security. Each vote is cryptographically sealed and added to an immutable ledger, making it virtually impossible to alter or manipulate the results.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem className="bg-customGulabi focus:bg-customGulabi px-4 rounded-b-lg" data-aos="fade-up" data-aos-duration="700" data-aos-anchor-placement="top-bottom" data-aos-delay="400" value="item-3">
                        <AccordionTrigger className="text-xl font-medium">
                            Q: Can BB-Vote handle large-scale elections?
                        </AccordionTrigger>
                        <AccordionContent>
                            <p>Ans: Absolutely! Our platform is designed to scale effortlessly, capable of handling elections of any size - from small organizational votes to large elections. The blockchain infrastructure ensures that even with millions of votes, the system remains fast, secure, and transparent.</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
};

export default AboutUs;