import { Link } from "react-router-dom";
import { useForm } from "react-hook-form"
// import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useAuth from "../Hooks/useAuth/useAuth";

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAxiosPublic from "../Hooks/useAxiosPublic/useAxiosPublix";


const Login = () => {
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const location = useLocation();
    const redirect = location?.state?.from ? location.state.from : '/';
    const [passwordVisible, setPasswordVisible] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const { loginUser, handleSignInWithGoogle } = useAuth();
    // toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
        // reset
    } = useForm();

    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const [countdown, setCountdown] = useState(0);
    const [isOTPVerified, setIsOTPVerified] = useState(false);

    // countdown for resend OTP
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // send OTP
    const sendOTP = async () => {
        // ** we only allow DIU student email addresses **

        // if (!email || email === '' || !email.match(/^[^\s@]+@students\.diu\.ac$/)) {
        //     toast.error("Please enter a valid DIU student email address (example@students.diu.ac)");
        //     return;
        // }
        
        if (!email || email === '') {
            toast.error("Please enter a valid email address");
            return;
        }
        try {
            const response = await axiosPublic.post('/send-otp', { email, otpPurpose: 'login' });
            if (response?.data?.success) {
                // console.log(response.data)
                toast.success(response?.data?.message);
                // setOTP(response.data.otp);
                setCountdown(300);
            } else {
                toast.error("Failed to send OTP");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            toast.error(error?.response?.data?.message || "An error occurred while sending OTP");
        }
    };

    // verify OTP
    const verifyOTP = async () => {
        try {
            const response = await axiosPublic.post('/verify-otp', { email, otp });
            if (response?.data?.success) {
                toast.success(response?.data?.message);
                setIsOTPVerified(true);
            } else {
                setIsOTPVerified(false);
            }
        } catch (error) {
            // console.error("Error verifying OTP:", error);
            toast.error(error?.response?.data?.error);
        }
    };

    useEffect(() => {
        if (otp.length === 6) {
            verifyOTP();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp]);

    // handleSignInWithGoogle 
    // const SignInWithGoogle = () => {
    //     handleSignInWithGoogle()
    //         .then(() => {
    //             toast("Google Login Successfully!", { type: "success", autoClose: 2000 });
    //             setTimeout(() => {
    //                 navigate(redirect);
    //             }, 3000)
    //         })
    //         .catch(() => {
    //             toast("Invalid login credentials.", { type: "error", autoClose: 2000 })
    //             reset();
    //         })
    // };

    const onSubmit = (data) => {
        // console.log(data);
        const { email, password } = data;
        loginUser(email, password)
            .then(() => {
                toast("Login Successfully!", { type: "success", autoClose: 2000 });
                setTimeout(() => {
                    navigate(redirect);
                }, 3000)
            })
            .catch(() => {
                toast.error("Invalid login credentials. Please check your email and password.", { type: "error", autoClose: 2000 })
            })
    };

    return (
        <div className="p-8 md:px-20 min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
            <Helmet>
                <title>Login | BB-Vote</title>
            </Helmet>
            <Card className="mx-auto max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-customGulabi">Login to BB-Vote</CardTitle>
                    <CardDescription>
                        Welcome back! <br /> Please login to your account to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <form onSubmit={handleSubmit(onSubmit)} >
                            {/* <div className="grid gap-2 form-control mb-1">
                                <Label htmlFor="email">Email <span className="text-customRed">*</span></Label>
                                <Input {...register("email", {
                                    required: {
                                        value: true,
                                        message: "Please enter your email"
                                    }, pattern: {
                                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,9}$/,
                                        message: "Invalid email format"
                                    }
                                })}
                                    id="email"
                                    type="email"
                                    placeholder="mail@example.com"
                                    required
                                />
                                {errors?.email && <span className="text-customRed text-sm mt-1 items-center flex"><BsInfoCircle className="mr-1 font-bold" />{errors?.email?.message}</span>}
                            </div> */}

                                 {/* email */}
                            <div className="grid gap-2 form-control mb-2 mt-4">
                                <Label htmlFor="email">Email <span className="text-customRed">*</span>
                                    {isOTPVerified ? (
                                        <span className="text-green-600 ml-2">✓ Verified</span>
                                    ) : (
                                        <span className="text-red-600 ml-2">✗ Unverified</span>
                                    )}
                                </Label>
                                <Input {...register("email", {
                                    required: {
                                        value: true,
                                        message: "Please enter your email"
                                    },
                                    pattern: [
                                        {
                                            value: /^[a-zA-Z0-9._-]+@students\.diu\.ac$/,
                                            message: "Only University email (example@students.diu.ac) addresses are allowed"
                                        },
                                        // {
                                        //     value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,9}$/,
                                        //     message: "Invalid email format"
                                        // }
                                    ]
                                })}
                                    id="email"
                                    type="email"
                                    placeholder="example@students.diu.ac"
                                    onChange={handleEmailChange}
                                    required
                                    disabled={isOTPVerified}
                                />
                                {errors?.email && <span className="text-customRed text-sm mt-1 items-center flex"><BsInfoCircle className="mr-1 font-bold" />{errors?.email?.message}</span>}
                                {/* {isOTPVerified && <span className="text-green-600 text-sm mt-1 items-center flex"><BsInfoCircle className="mr-1 font-bold" />Email verified</span>} */}
                            </div>
                            {/* Verify OTP */}
                            <div className="grid gap-2 form-control mb-2 mt-4">
                                {/* OTP input */}
                                <Label htmlFor="otp">
                                    Email Verification Code <span className="text-customRed">*</span>
                                </Label>
                                <div className="md:flex justify-between">
                                    <InputOTP maxLength={6} value={otp} onChange={(value) => setOTP(value)} required>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                    {/* resend OTP button */}
                                    <Button
                                        type="button"
                                        onClick={sendOTP}
                                        className={`md:ml-2 mt-4 md:mt-0 justify-center w-[90%] flex text-center items-center text-xs p-4 ${isOTPVerified ? 'bg-green-600' : 'bg-red-600'
                                            }`}
                                        disabled={countdown > 0 || isOTPVerified}
                                    >
                                        {isOTPVerified
                                            ? 'Verified'
                                            : countdown > 0
                                                ? `Resend in ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`
                                                : 'Send OTP'}
                                    </Button>
                                </div>
                                {errors?.otp && <span className="text-customRed text-sm mt-1 items-center flex"><BsInfoCircle className="mr-1 font-bold" />{errors?.otp?.message}</span>}
                            </div>

                            {/* password */}
                            <div className="grid gap-2 relative mb-2 mt-4">
                                <div className="flex items-center form-control">
                                    <Label htmlFor="password">Password <span className="text-customRed">*</span></Label>
                                    <Link href="#" className="ml-auto inline-block text-sm underline">
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input {...register("password", {
                                    required: {
                                        value: true,
                                        message: "Password is required"
                                    }, minLength: {
                                        value: 6,
                                        message: "Minimum length of 6 characters"
                                    }, validate: {
                                        uppercase: value => value === value.toLowerCase() ? "Password must contain at least one uppercase letter" : undefined,
                                        lowercase: value => value === value.toUpperCase() ? "Password must contain at least one lowercase letter" : undefined,
                                        specialChar: value => /[!@#$%^&*(),.?":{}|<>]/.test(value) ? undefined : "Password must contain at least one special character",
                                        number: value => /\d/.test(value) ? undefined : "Password must contain at least one number"
                                    }
                                })} id="password" className="pr-9" type={passwordVisible ? 'text' : 'password'} placeholder="your password" required />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 top-7 right-0 items-center px-3"
                                    onClick={togglePasswordVisibility}
                                >
                                    {passwordVisible ?
                                        <AiOutlineEye size={20} />
                                        :
                                        <AiOutlineEyeInvisible size={20} />
                                    }
                                </button>
                            </div>
                            {errors?.password && <span className="text-customRed text-sm mt-1 items-center flex"><BsInfoCircle className="mr-1 font-bold" />{errors?.password?.message}</span>}
                                    
                            <div className="items-center flex mt-1">
                                <input
                                    {...register("checkbox", {
                                        required: {
                                            value: true,
                                            message: "Checkbox must be checked",
                                        },
                                    })}
                                    type="checkbox"
                                    className="checkbox bg-white border-[1.4px] checked:border-none checked:bg-orange border-dotted border-orange checkbox-xs mr-1"
                                />
                                <label htmlFor="terms" className="text-xs text-tertiary">
                                    I agree to the{" "}
                                    <Link to="#" className="text-orange underline">
                                        terms and conditions!
                                    </Link>
                                </label>
                                {errors?.checkbox && (
                                    <span className="text-customRed text-xs mt-1 flex items-center">
                                        <BsInfoCircle className="mr-1 text-orange font-bold text-base" />
                                        {errors?.checkbox?.message}
                                    </span>
                                )}
                            </div>

                            <Button type="submit" className="w-full form-control mt-6 bg-customGulabi hover:bg-customRed">
                                Login
                            </Button>
                        </form>
                        {/* <Button onClick={() => SignInWithGoogle()} variant="outline" className="w-full">
                            <FcGoogle className="text-xl mr-2"></FcGoogle> Continue with Google
                        </Button> */}
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link to='/register' className="underline text-customBlue font-bold">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
            <ToastContainer />
        </div>
    );
};

export default Login;