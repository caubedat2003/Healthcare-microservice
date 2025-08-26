import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.svg';
import { Button, Dropdown, message, type MenuProps } from 'antd';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { useAuth } from '../contexts/AuthContext';
import { FaListUl, FaUserLarge, FaUserNurse, FaUserTie } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { BsRobot } from 'react-icons/bs';
import { GoTasklist } from 'react-icons/go';
import { GrDocumentText } from 'react-icons/gr';
import { MdDashboard } from 'react-icons/md';

const Navbar = () => {
    const [isTop, setIsTop] = useState(true);
    const [loginVisible, setLoginVisible] = useState(false);
    const [registerVisible, setRegisterVisible] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const patientItems: MenuProps["items"] = [
        {
            key: "appointments",
            label: "My Appointments",
            icon: <FaListUl />,
            onClick: () => navigate('/appointment'),
        },
        {
            key: "chat-ai",
            label: "Chat with AI",
            icon: <BsRobot />,
            onClick: () => navigate('/chat-ai'),
        },
        {
            key: "user-profile",
            label: "My Profile",
            icon: <FaUserLarge />,
            onClick: () => navigate('/user-profile'),
        },
    ];

    const doctorItems: MenuProps["items"] = [
        {
            key: "appointments",
            label: "My Appointments",
            icon: <GoTasklist />,
            onClick: () => navigate('/doctor/appointments'),
        },
        {
            key: "medical-records",
            label: "Medical Records",
            icon: <GrDocumentText />,
            onClick: () => navigate('/doctor/medical-records'),
        },
        {
            key: "profile",
            label: "My Profile",
            icon: <FaUserNurse />,
            onClick: () => navigate('/doctor/profile'),
        },
    ];

    const adminItems: MenuProps["items"] = [
        {
            key: "dashboard",
            label: "Dashboard",
            icon: <MdDashboard />,
            onClick: () => navigate('/admin'),
        },
        {
            key: "profile",
            label: "Profile",
            icon: <FaUserTie />,
            onClick: () => navigate('/admin/profile'),
        },
    ];

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
                        {user?.role === 'patient' ? (
                            <>
                                <a href="/appointment" className='text-base font-semibold'>APPOINTMENT</a>
                                <a href="/doctors" className='text-base font-semibold'>DOCTORS</a>
                                <a href="/about" className='text-base font-semibold'>ABOUT</a>
                                <a href="/contact" className='text-base font-semibold'>CONTACT</a>
                            </>
                        ) : null}
                        <div className='flex items-center gap-3'>
                            {user ? (
                                <>
                                    {user.role === 'patient' ? (
                                        <Dropdown menu={{ items: patientItems }} trigger={["click"]} placement="bottomLeft">
                                            <Button color="cyan" variant="outlined" ghost
                                                className='!text-base !uppercase !font-medium mr-3'
                                            >
                                                <FaUserLarge /> {user.full_name || user.email}
                                            </Button>
                                        </Dropdown>
                                    ) : user.role === 'doctor' ? (
                                        <Dropdown menu={{ items: doctorItems }} trigger={["click"]} placement="bottomLeft">
                                            <Button color="cyan" variant="outlined" ghost
                                                className='!text-base !uppercase !font-medium mr-3'
                                            >
                                                <FaUserLarge /> {user.full_name || user.email}
                                            </Button>
                                        </Dropdown>
                                    ) : user.role === 'admin' ? (
                                        <Dropdown menu={{ items: adminItems }} trigger={["click"]} placement="bottomLeft">
                                            <Button color="cyan" variant="outlined" ghost
                                                className='!text-base !uppercase !font-medium mr-3'
                                            >
                                                <FaUserLarge /> {user.full_name || user.email}
                                            </Button>
                                        </Dropdown>
                                    ) : null}
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
                                    <Button onClick={() => setLoginVisible(true)}
                                        variant="solid" color="cyan"
                                        className='!text-base !font-bold'>
                                        Login
                                    </Button>
                                    <Button onClick={() => setRegisterVisible(true)}
                                        color="cyan" variant="outlined" ghost
                                        className='!text-base !font-bold'>
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