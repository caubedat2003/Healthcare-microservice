import { Avatar, Button, Card, Spin } from "antd";
import userIcon from '../../assets/user.png';
import { FaUserEdit } from "react-icons/fa";
import { FaKey } from "react-icons/fa6";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const DoctorProfile = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const [doctorData, setDoctorData] = useState<any>(null);
    const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`${BASE_URL}/api/auth/users/${user?.id}/`);
                const doctorResponse = await axios.get(`${BASE_URL}/api/doctor/user/${user?.id}/`);
                setUserData(userResponse.data);
                setDoctorData(doctorResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (user?.id) fetchUserData();
    }, [user]);

    if (!userData || !doctorData) return <div className="flex justify-center mt-10">
        <Spin size="large" />
    </div>;

    return (
        <main className="flex-grow pt-4">
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
                                            <strong className='text-base mr-2'>Years of experience:</strong>
                                            {doctorData.years_of_experience || 'N/A'}
                                        </p>
                                        <p className="text-gray-600 text-base mb-2">
                                            <strong className='text-base mr-2'>Specialization:</strong>
                                            {doctorData.specialization || 'N/A'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-600 text-base mb-2">
                                            <strong className='text-base mr-2'>Phone number: </strong>
                                            {doctorData.phone_number || 'N/A'}
                                        </p>
                                        <p className="text-gray-600 text-base mb-2">
                                            <strong className='text-base mr-2'>Join since:</strong>
                                            {doctorData.created_at ?
                                                new Date(doctorData.created_at).toLocaleDateString() : 'N/A'}
                                        </p>
                                        <p className="text-gray-600 text-base mb-2">
                                            <strong className='text-base mr-2 '>License number:</strong>
                                            {doctorData.license_number || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </main>
    )
}

export default DoctorProfile;