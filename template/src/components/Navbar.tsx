import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.svg';
import { Button, message } from 'antd';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { useAuth } from '../contexts/AuthContext';
import { FaUserLarge } from 'react-icons/fa6';

const Navbar = () => {
    const [isTop, setIsTop] = useState(true);
    const [loginVisible, setLoginVisible] = useState(false);
    const [registerVisible, setRegisterVisible] = useState(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsTop(window.scrollY === 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <header
                className={`fixed top-0 w-full z-20 transition-colors duration-300 ${isTop ? 'bg-transparent shadow-none' : 'bg-white shadow'
                    }`}
            >
                <div className="container mx-auto flex justify-between items-center p-4">
                    <a className="w-50 cursor-pointer " href="/">
                        <img src={logo} alt="Logo"
                            className={`${isTop ? 'filter brightness-0 invert' : ''}`}
                        />
                    </a>

                    <nav
                        className={`flex gap-4 items-center transition-colors duration-300 
                            ${isTop ? 'text-white' : 'text-black'
                            }`}
                    >
                        <a href="/appointment" className='text-base font-semibold'>APPOINTMENT</a>
                        <a href="/doctors" className='text-base font-semibold'>DOCTORS</a>
                        <a href="/about" className='text-base font-semibold'>ABOUT</a>
                        <a href="/contact" className='text-base font-semibold'>CONTACT</a>
                        <div className='flex items-center gap-3'>
                            {user ? (
                                <>
                                    <Button color="cyan" variant="outlined" ghost className='!text-base !uppercase !font-medium mr-3'><FaUserLarge /> {user.full_name || user.email}</Button>
                                    <Button
                                        onClick={() => {
                                            logout();
                                            message.success('Logged out');
                                        }}
                                        variant="solid" color="cyan"
                                        className='!text-base !font-bold'
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => setLoginVisible(true)} variant="solid" color="cyan" className='!text-base !font-bold'>
                                        Login
                                    </Button>
                                    <Button onClick={() => setRegisterVisible(true)} color="cyan" variant="outlined" ghost className='!text-base !font-bold'>
                                        Register
                                    </Button>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            <LoginModal visible={loginVisible} onClose={() => setLoginVisible(false)} />
            <RegisterModal visible={registerVisible} onClose={() => setRegisterVisible(false)} />
        </>
    );
}

export default Navbar;