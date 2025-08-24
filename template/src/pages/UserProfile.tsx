import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Button, Card, Col, Row, Spin } from 'antd';
import { useAuth } from '../contexts/AuthContext'
import userIcon from '../assets/user.png';
import NavbarDark from '../components/NavbarDark';
import Footer from '../components/Footer';
import { FaUserEdit } from 'react-icons/fa';
import { FaKey } from 'react-icons/fa6';

const UserProfile: React.FC = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const [patientData, setPatientData] = useState<any>(null);
    const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`${BASE_URL}/api/auth/users/${user?.id}/`);
                const patientResponse = await axios.get(`${BASE_URL}/api/patient/user/${user?.id}/`);
                setUserData(userResponse.data);
                setPatientData(patientResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (user?.id) fetchUserData();
    }, [user]);

    if (!userData || !patientData) return <div className="flex justify-center mt-10">
        <Spin size="large" />
    </div>;

    return (
        // page container: full height, column layout so footer stays at bottom
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Navbar is fixed; add top padding to main so content doesn't sit under it */}
            <NavbarDark />

            <main className="flex-grow pt-20">
                <div className="container mx-auto p-4 flex">
                    <Card className="shadow-lg rounded-lg flex-grow">
                        <div className='grid grid-cols-4 mb-4'>
                            <div className='col-span-1 border-r pr-4 border-gray-300'>
                                <div className="text-center">
                                    <Avatar size={128} className="mx-auto mb-6 !bg-white">
                                        <img src={userIcon} alt="icon" />
                                    </Avatar>
                                    <h2 className="text-xl font-bold text-gray-800 mt-2 mb-6">{userData.full_name}</h2>
                                    <div className="text-gray-600 text-base">
                                        Member since{' '}
                                        {new Date(userData.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </div>
                                    <div className='flex flex-col gap-2 mt-6'>
                                        <Button color='cyan' variant='filled'
                                            icon={<FaUserEdit />}
                                        >Edit profile</Button>
                                        <Button color='cyan' variant='solid'
                                            icon={<FaKey />}
                                        >Change password</Button>
                                    </div>
                                </div>
                            </div>

                            <div className='col-span-3'>
                                <div className="p-4 pl-6">
                                    <h3 className="text-xl font-bold text-gray-700 mb-4">Personal information</h3>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <p className="text-gray-600 text-base mb-2">
                                                <strong className='text-base mr-2'>First Name:</strong>
                                                {userData.full_name || 'N/A'}
                                            </p>
                                            <p className="text-gray-600 text-base mb-2">
                                                <strong className='text-base mr-2'>Email:</strong>
                                                {userData.email || 'N/A'}
                                            </p>
                                            <p className="text-gray-600 text-base mb-2">
                                                <strong className='text-base mr-2'>Date of birth:</strong>
                                                {patientData.date_of_birth ?
                                                    new Date(patientData.date_of_birth).toLocaleDateString() : 'N/A'}
                                            </p>
                                            <p className="text-gray-600 text-base mb-2">
                                                <strong className='text-base mr-2'>Address:</strong>
                                                {patientData.address || 'N/A'}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-600 text-base mb-2">
                                                <strong className='text-base mr-2'>Phone number: </strong>
                                                {patientData.phone_number || 'N/A'}
                                            </p>
                                            <p className="text-gray-600 text-base mb-2">
                                                <strong className='text-base mr-2'>Join since:</strong>
                                                {patientData.created_at ?
                                                    new Date(patientData.created_at).toLocaleDateString() : 'N/A'}
                                            </p>
                                            <p className="text-gray-600 text-base mb-2">
                                                <strong className='text-base mr-2 '>Blood type:</strong>
                                                {patientData.blood_type || 'N/A'}
                                            </p>
                                            <p className="text-gray-600 text-base mb-2">
                                                <strong className='text-base mr-2'>Medical history:</strong>
                                                {patientData.medical_history || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default UserProfile;