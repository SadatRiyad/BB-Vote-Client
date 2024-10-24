import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BsPhone } from 'react-icons/bs';
import { FaRegAddressCard } from 'react-icons/fa6';
import { FiMail } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import contactImg from '../../assets/team2.jpg';
import { Typewriter } from 'react-simple-typewriter';
import useAxiosPublic from '../Hooks/useAxiosPublic/useAxiosPublix';

const ContactUs = () => {
    const axiosPublic = useAxiosPublic();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const ContactUsMsg = {
            name: formData.name,
            email: formData.email,
            message: formData.message
        }
        axiosPublic.post('/contactus', ContactUsMsg)
        if (formData.name && formData.email && formData.message) {
            toast("Message sent successfully!", {
                type: "success",
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        } else {
            toast("Please fill all the fields!", {
                type: "error",
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        // reset the form
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <>
            <Helmet>
                <title>Contact Us | BB-Vote</title>
            </Helmet>
            <div data-aos="zoom-in" data-aos-duration="700" data-aos-anchor-placement="top-bottom" data-aos-delay="50" className="container mx-auto px-4 pb-0">
                <img src={contactImg} alt="Contact" className="w-full h-auto rounded-t-xl mb-0 md:-mt-48" />
            </div>
            <div className="container mx-auto px-4 pt-8 pb-6">

                <div className="py-8 bg-customNil rounded-b-xl mb-1 -mt-10 text-white">
                    <h2 className="text-4xl md:text-5xl lg-text-6xl text-center font-bold">Contact <span className='text-customGulabi'>Us</span></h2>
                </div>
                <div className='text-center mb-10'>
                    <h1 className="text-3xl font-bold mb-4"></h1>
                    <p className="text-base px-2 mb-0 font-medium">
                        Got any questions, suggestions, or feedback? <br />
                        <span style={{ fontWeight: 'medium' }}>
                            {/* Style will be inherited from the parent element */}
                            <Typewriter
                                words={['Feel free to reach out to us using the contact information below: ']}
                                cursor
                                cursorStyle=''
                                typeSpeed={70}
                                deleteSpeed={50}
                                delaySpeed={1000}
                            />
                        </span>
                    </p>
                </div>
                <div id="support" className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center mb-4 px-8 py-16 bg-customNil rounded-xl">
                    <div data-aos="zoom-in" data-aos-duration="700" data-aos-anchor-placement="top-bottom" data-aos-delay="300" className='text-white'>
                        <h2 className="text-3xl font-semibold mb-8">Contact Information</h2>
                        <ul className="space-y-2">
                            <li className="flex items-center space-x-4">
                                <FiMail />
                                {/* when click on email, it will open the email client */}
                                <a onClick={() => window.open('mailto:Notify.BBVote@gmail.com', '_blank')} className='hover:underline cursor-pointer'>Email: Notify.BBVote@gmail.com</a>
                            </li>
                            <li className="flex items-center space-x-4">
                                <BsPhone />
                                <span>Phone: +8801706506364</span>
                            </li>
                            <li className="flex items-center space-x-4">
                                <FaRegAddressCard />
                                <span>Address: Mirpur-13, Dhaka, Bangladesh</span>
                            </li>
                        </ul>
                    </div>
                    <div data-aos="zoom-in" data-aos-duration="800" data-aos-anchor-placement="top-bottom" data-aos-delay="300" >
                        <h2 className="text-3xl font-semibold font-Rajdhani mb-4 mt-8 text-white">Send us a <span className='text-customGulabi'>Message</span></h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-customGulabi"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border--500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="Your Message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-customGulabi"
                                    required
                                />
                            </div>
                            <button onClick={() => handleSubmit()}
                                type="submit"
                                className="w-full px-4 py-2 bg-customGulabi text-white rounded-md hover:bg-white shadow-md border-2 hover:text-customGulabi font-semibold hover:border-customGulabi border-customGulabi focus:outline-none focus:bg-customGulabi"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default ContactUs;