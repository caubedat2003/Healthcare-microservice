import React, { useState, useEffect } from 'react';
import { Badge, Button, Calendar, Card, Modal, Popover } from 'antd';
import type { BadgeProps, CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import NavbarDark from '../components/NavbarDark';
import { MdAdd, MdOutlineCancel, MdOutlinePlaylistAdd } from 'react-icons/md';
import BookAppointmentModal from '../components/BookAppointmentModal';

type AppointmentType = {
    id?: number;
    appointment_date: string;
    appointment_time: string;
    doctor_id: string;
    reason: string;
    status: string;
};

const AppointmentPatient = () => {
    const { user, token } = useAuth();
    const [appointments, setAppointments] = useState<AppointmentType[]>([]);
    const [doctorsMap, setDoctorsMap] = useState<Record<number, string>>({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isBookModalVisible, setIsBookModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

    useEffect(() => {
        if (user?.id) {
            fetchAppointments();
        } else {
            setAppointments([]);
        }
    }, [user]);

    const fetchAppointments = async () => {
        if (!user?.id) return;
        try {
            // First fetch patient record associated with this user
            const patientRes = await axios.get(`${BASE_URL}/api/patient/user/${user.id}/`);
            const patient = patientRes.data;
            const patientId = patient?.id ?? patient?.patient_id ?? null;

            if (!patientId) {
                message.error('No patient record found for this user');
                setAppointments([]);
                return;
            }

            // Then fetch appointments for that patient id
            const response = await axios.get(`${BASE_URL}/api/appointment/patient/${patientId}/`);
            const appts = response.data || [];
            setAppointments(appts);

            // Fetch doctors list to resolve names (useful to display doctor full_name instead of id)
            try {
                const doctorsRes = await axios.get(`${BASE_URL}/api/doctor/`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                });
                const docs: any[] = doctorsRes.data || [];
                const map: Record<number, string> = {};
                docs.forEach((d) => {
                    map[Number(d.id)] = d.full_name || `${d.first_name || ''} ${d.last_name || ''}`.trim() || `Doctor ${d.id}`;
                });
                setDoctorsMap(map);
            } catch (err) {
                // non-fatal: doctor name resolution failed
                console.warn('Failed to fetch doctors for name resolution', err);
            }
        } catch (error: any) {
            // Distinguish not found vs other errors
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                message.error('Patient record not found for this user');
                setAppointments([]);
            } else {
                console.error(error);
                message.error('Failed to fetch appointments');
            }
        }
    };

    const getDoctorName = (id: string | number) => {
        const num = Number(id);
        return doctorsMap[num] || `Doctor ${id}`;
    };

    const cancelAppointment = async (appt: AppointmentType) => {
        if (!appt.id) return;
        // only allow cancelling pending appointments
        if (appt.status !== 'pending') return;
        const confirm = window.confirm('Cancel this appointment?');
        if (!confirm) return;
        try {
            await axios.patch(`${BASE_URL}/api/appointment/${appt.id}/`, { status: 'cancelled' });
            message.success('Appointment cancelled');
            fetchAppointments();
        } catch (err) {
            console.error(err);
            message.error('Failed to cancel appointment');
        }
    };

    const getAppointmentsForDate = (value: Dayjs) => {
        return appointments.filter((appt) => dayjs(appt.appointment_date).isSame(value, 'day'));
    };

    const statusToBadge = (status: string): BadgeProps['status'] => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'confirmed':
                return 'processing';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const dateCellRender = (value: Dayjs) => {
        const appts = getAppointmentsForDate(value);
        return (
            <ul className="events">
                {appts.map((appt, index) => (
                    <li key={index} style={{ cursor: 'default' }}>
                        <Badge status={statusToBadge(appt.status)} text={`At ${appt.appointment_time} - ${appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}`} />
                    </li>
                ))}
            </ul>
        );
    };

    const onSelect = (value: Dayjs) => {
        setSelectedDate(value);
        setIsModalVisible(true);
    };

    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
        if (info.type === 'date') {
            return (
                <div onClick={() => onSelect(current)} style={{ cursor: 'pointer' }}>
                    {dateCellRender(current)}
                </div>
            );
        }
        return info.originNode;
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedDate(null);
    };

    return (
        <div className='bg-white'>
            <NavbarDark />
            <div className="container mx-auto p-4 mt-17 mb-2">
                <div className='flex items-center justify-between'>
                    <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
                    <Button color="cyan" variant="solid" size='large' icon={< MdOutlinePlaylistAdd />} onClick={() => setIsBookModalVisible(true)}>
                        Book an Appointment
                    </Button>
                </div>
                <Calendar cellRender={cellRender} className='!p-2' />
            </div>

            <Modal
                title={`Appointments on ${selectedDate ? selectedDate.format('YYYY-MM-DD') : ''}`}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                {selectedDate && (
                    <ul className="p-4">
                        {getAppointmentsForDate(selectedDate).map((appt, index) => (
                            <li key={index} className="mb-2 flex items-center justify-between">
                                <div className='flex-1'>
                                    <Badge
                                        className='rounded-md p-2 shadow-sm !w-full !p-4'
                                        status={statusToBadge(appt.status)}
                                        text={`With doctor ${getDoctorName(appt.doctor_id)} at ${appt.appointment_time}: ${appt.reason} - ${appt.status}`}
                                    />
                                </div>
                                {appt.status === 'pending' && (
                                    <Popover content="Cancel Appointment">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); cancelAppointment(appt); }}
                                            className='ml-3 text-xl !text-red-600 !hover:text-red-800 cursor-pointer'
                                        >
                                            <MdOutlineCancel />
                                        </button>
                                    </Popover>
                                )}
                            </li>
                        ))}
                        {getAppointmentsForDate(selectedDate).length === 0 && (
                            <p>No appointments scheduled for this day.</p>
                        )}
                    </ul>
                )}
            </Modal>

            {/* Book appointment modal */}
            <BookAppointmentModal
                visible={isBookModalVisible}
                onClose={() => setIsBookModalVisible(false)}
                onCreated={() => { setIsBookModalVisible(false); fetchAppointments(); }}
            />

        </div>
    );
}
export default AppointmentPatient;