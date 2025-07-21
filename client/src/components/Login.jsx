import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
    const [state, setState] = useState('Login');
    const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const endpoint = state === 'Login' ? 'login' : 'register';
            const payload = state === 'Login' ? { email, password } : { name, email, password };

            const { data } = await axios.post(`${backendUrl}/api/user/${endpoint}`, payload);

            if (data.success) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('token', data.token);
                setShowLogin(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            const msg = error.response?.data?.message || error.message || 'Something went wrong';
            toast.error(msg);
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
            <motion.form
                onSubmit={onSubmitHandler}
                initial={{ opacity: 0.2, y: 50 }}
                transition={{ duration: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative bg-white p-10 rounded-xl text-slate-500 w-[90%] max-w-md"
            >
                <h1 className="text-center text-2xl text-neutral-700 font-medium">
                    {state}
                </h1>
                <p className="text-sm text-center">
                    {state === 'Login' ? 'Welcome back! Please sign in to continue' : 'Create an account to get started'}
                </p>

                {state !== 'Login' && (
                    <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
                        <img width={25} src={assets.profile_icon} alt="profile" />
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            type="text"
                            className="outline-none text-sm w-full"
                            placeholder="Full Name"
                            required
                        />
                    </div>
                )}

                <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
                    <img src={assets.email_icon} alt="email" />
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        className="outline-none text-sm w-full"
                        placeholder="Email ID"
                        required
                    />
                </div>

                <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
                    <img src={assets.lock_icon} alt="password" />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        className="outline-none text-sm w-full"
                        placeholder="Password"
                        required
                    />
                </div>

                {state === 'Login' && (
                    <p className="text-sm text-blue-600 py-4 cursor-pointer">Forgot Password?</p>
                )}

                <button className="bg-blue-600 w-full text-white py-2 rounded-full mt-2">
                    {state === 'Login' ? 'Login' : 'Create Account'}
                </button>

                <p className="mt-5 text-center">
                    {state === 'Login' ? "Don't have an account? " : 'Already have an account? '}
                    <span
                        className="text-blue-600 cursor-pointer"
                        onClick={() => setState(state === 'Login' ? 'Sign Up' : 'Login')}
                    >
                        {state === 'Login' ? 'Sign up' : 'Login'}
                    </span>
                </p>

                <img
                    onClick={() => setShowLogin(false)}
                    src={assets.cross_icon}
                    alt="close"
                    className="absolute top-5 right-5 cursor-pointer"
                />
            </motion.form>
        </div>
    );
};

export default Login;
