import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { Dayjs } from "dayjs";
import axios from "axios";
import { Badge, Button, Calendar, message, Modal, Popover, type BadgeProps, type CalendarProps } from "antd";
import dayjs from "dayjs";
import NavbarDark from "../../components/NavbarDark";
import { MdCancel, MdOutlineCancel } from "react-icons/md";
import { FaClipboardCheck } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";

type AppointmentType = {
    id?: number;
    appointment_date: string;
    appointment_time: string;
    patient_id: string;
    reason: string;
    status: string;
};

const AppointmentDoctor = () => {
    const { user, token } = useAuth();
    const [appointments, setAppointments] = useState<AppointmentType[]>([]);
    const [patientsMap, setPatientsMap] = useState<Record<number, string>>({});
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
            // First fetch doctor record associated with this user
            const doctorRes = await axios.get(`${BASE_URL}/api/doctor/user/${user.id}/`);
            const doctor = doctorRes.data;
            const doctorId = doctor?.id ?? doctor?.patient_id ?? null;

            if (!doctorId) {
                message.error('No doctor record found for this user');
                setAppointments([]);
                return;
            }

            // Then fetch appointments for that doctor id
            const response = await axios.get(`${BASE_URL}/api/appointment/doctor/${doctorId}/`);
            const appts = response.data || [];
            setAppointments(appts);

            // Fetch patients list to resolve names (useful to display patient full_name instead of id)
            try {
                const patientsRes = await axios.get(`${BASE_URL}/api/patient/`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                });
                const pt: any[] = patientsRes.data || [];
                const map: Record<number, string> = {};
                pt.forEach((d) => {
                    map[Number(d.id)] = d.full_name || `${d.first_name || ''} ${d.last_name || ''}`.trim() || `Doctor ${d.id}`;
                });
                setPatientsMap(map);
            } catch (err) {
                // non-fatal: patient name resolution failed
                console.warn('Failed to fetch patients for name resolution', err);
            }
        } catch (error: any) {
            // Distinguish not found vs other errors
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                message.error('Doctor record not found for this user');
                setAppointments([]);
            } else {
                console.error(error);
                message.error('Failed to fetch appointments');
            }
        }
    };

    const getPatientName = (id: string | number) => {
        const num = Number(id);
        return patientsMap[num] || `Patient ${id}`;
    };

    const cancelAppointment = async (appt: AppointmentType) => {
        if (!appt.id) return;
        // only allow cancelling pending or confirmed appointments 
        if (appt.status !== 'pending' && appt.status !== 'confirmed') return;
        Modal.confirm({
            title: 'Cancel appointment',
            content: 'Are you sure you want to cancel this appointment?',
            okText: 'Yes',
            cancelText: 'No',
            okType: 'danger',
            onOk: async () => {
                try {
                    await axios.patch(`${BASE_URL}/api/appointment/${appt.id}/`, { status: 'cancelled' }, {
                        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                    });
                    message.success('Appointment cancelled');
                    fetchAppointments();
                } catch (err) {
                    console.error(err);
                    message.error('Failed to cancel appointment');
                }
            },
        });
    };

    const confirmAppointment = async (appt: AppointmentType) => {
        if (!appt.id) return;
        // only allow confirming pending appointments
        if (appt.status !== 'pending') return;
        Modal.confirm({
            title: 'Confirm appointment',
            content: 'Confirm this appointment?',
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await axios.patch(`${BASE_URL}/api/appointment/${appt.id}/`, { status: 'confirmed' }, {
                        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                    });
                    message.success('Appointment confirmed');
                    fetchAppointments();
                } catch (err) {
                    console.error(err);
                    message.error('Failed to confirm appointment');
                }
            },
        });
    };

    const completeAppointment = async (appt: AppointmentType) => {
        if (!appt.id) return;
        // only allow completing on confirmed appointments
        if (appt.status !== 'confirmed') return;
        Modal.confirm({
            title: 'Complete appointment',
            content: 'Mark this appointment as completed?',
            okText: 'Complete',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await axios.patch(`${BASE_URL}/api/appointment/${appt.id}/`, { status: 'completed' }, {
                        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                    });
                    message.success('Appointment completed');
                    fetchAppointments();
                } catch (err) {
                    console.error(err);
                    message.error('Failed to complete appointment');
                }
            },
        });
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
        <div className=''>
            <div className="container mx-auto">
                <div className='flex items-center justify-between'>
                    <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
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
                                        text={`With patient ${getPatientName(appt.patient_id)} at ${appt.appointment_time}: ${appt.reason} - ${appt.status}`}
                                    />
                                </div>
                                {appt.status === 'pending' ? (
                                    <div>
                                        <Popover content="Cancel Appointment">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); cancelAppointment(appt); }}
                                                className='ml-3 text-xl !text-red-600 !hover:text-red-800 cursor-pointer'
                                            >
                                                <MdCancel />
                                            </button>
                                        </Popover>
                                        <Popover content="Confirm Appointment">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); confirmAppointment(appt); }}
                                                className='ml-3 text-xl !text-blue-600 !hover:text-blue-800 cursor-pointer'
                                            >
                                                <FaClipboardCheck />
                                            </button>
                                        </Popover>
                                    </div>
                                ) : appt.status === 'confirmed' ? (
                                    <div>
                                        <Popover content="Cancel Appointment">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); cancelAppointment(appt); }}
                                                className='ml-3 text-xl !text-red-600 !hover:text-red-800 cursor-pointer'
                                            >
                                                <MdCancel />
                                            </button>
                                        </Popover>
                                        <Popover content="Complete Appointment">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); completeAppointment(appt); }}
                                                className='ml-3 text-xl !text-green-600 !hover:text-green-800 cursor-pointer'
                                            >
                                                <FaCheckCircle />
                                            </button>
                                        </Popover>
                                    </div>
                                ) : null}
                            </li>
                        ))}
                        {getAppointmentsForDate(selectedDate).length === 0 && (
                            <p>No appointments scheduled for this day.</p>
                        )}
                    </ul>
                )}
            </Modal>
        </div>
    );
}

export default AppointmentDoctor;