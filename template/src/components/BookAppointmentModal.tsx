import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, DatePicker, TimePicker, Input, Button, message, Spin } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';

const { TextArea } = Input;

interface Props {
    visible: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

const BookAppointmentModal: React.FC<Props> = ({ visible, onClose, onCreated }) => {
    const [form] = Form.useForm();
    const { user, token } = useAuth();
    const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!visible) return;
        // fetch all doctors initially (no specialization selected)
        fetchDoctors();
        form.resetFields();
    }, [visible]);

    // fetch doctors, optionally filtered by specialization
    const fetchDoctors = async (specialization?: string | null) => {
        setLoadingDoctors(true);
        try {
            const url = specialization
                ? `${BASE_URL}/api/doctor/specialization/${encodeURIComponent(specialization)}`
                : `${BASE_URL}/api/doctor/`;
            const res = await axios.get(url, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            setDoctors(res.data || []);
        } catch (err) {
            console.error(err);
            message.error('Failed to load doctors');
            setDoctors([]);
        } finally {
            setLoadingDoctors(false);
        }
    };

    const setFormErrorsFromApi = (errors: any) => {
        if (!errors) return;
        const fields = Object.keys(errors).map((key) => {
            const messages = Array.isArray(errors[key]) ? errors[key] : [String(errors[key])];
            return { name: key, errors: messages };
        });
        // handle non_field_errors or detail
        if (errors.non_field_errors) {
            message.error((errors.non_field_errors as any).join(', '));
        } else if (errors.detail && typeof errors.detail === 'string') {
            message.error(errors.detail);
        }
        form.setFields(fields as any);
    };

    const handleFinish = async (values: any) => {
        setSubmitting(true);
        try {
            // resolve patient for current user
            if (!user?.id) {
                message.error('You must be logged in to book an appointment');
                return;
            }

            const patientRes = await axios.get(`${BASE_URL}/api/patient/user/${user.id}/`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            const patient = patientRes.data;
            const patientId = patient?.id ?? patient?.patient_id;

            if (!patientId) {
                message.error('No patient record found for this user');
                return;
            }

            const payload = {
                patient_id: patientId,
                doctor_id: values.doctor_id,
                appointment_date: (values.appointment_date as any).format('YYYY-MM-DD'),
                appointment_time: (values.appointment_time as any).format('HH:mm:ss'),
                status: values.status || 'pending',
                reason: values.reason || '',
            };

            await axios.post(`${BASE_URL}/api/appointment/`, payload, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });

            message.success('Appointment booked');
            form.resetFields();
            onCreated?.();
            onClose();
        } catch (err: any) {
            console.error(err);
            if (axios.isAxiosError(err) && err.response?.data) {
                setFormErrorsFromApi(err.response.data);
            } else {
                message.error('Failed to book appointment');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            onOk={() => form.submit()}
            okText="Book"
            confirmLoading={submitting}
            centered
            width={600}
            footer={null}
        >
            <Spin spinning={loadingDoctors}>
                <h1 className='flex flex-col items-center text-xl font-bold mb-4'>Book an Appointment</h1>
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <div className='grid grid-cols-3 gap-4'>
                        <div className='col-span-1'>
                            <Form.Item
                                name="specialization"
                                label="Specialization"

                            >
                                <Select placeholder="Select specialization (optional)" allowClear onChange={(val) => { form.setFieldsValue({ doctor_id: undefined }); fetchDoctors(val || null); }}>
                                    <Select.Option value="Emergency">Emergency</Select.Option>
                                    <Select.Option value="Cardiology">Cardiology</Select.Option>
                                    <Select.Option value="Pediatric">Pediatric</Select.Option>
                                    <Select.Option value="Gynecology">Gynecology</Select.Option>
                                    <Select.Option value="Neurology">Neurology</Select.Option>
                                    <Select.Option value="Psychiatry">Psychiatry</Select.Option>
                                </Select>
                            </Form.Item>
                        </div>
                        <div className='col-span-2'>
                            <Form.Item
                                name="doctor_id"
                                label="Doctor"
                                rules={[{ required: true, message: 'Please select a doctor' }]}
                            >
                                <Select placeholder="Select a doctor" options={doctors.map((d: any) => ({ label: d.full_name || `${d.first_name} ${d.last_name}` || `Doctor ${d.id}`, value: d.id }))} />
                            </Form.Item>
                        </div>
                    </div>


                    <div className="grid grid-cols-2 gap-2">
                        <Form.Item
                            name="appointment_date"
                            label="Date"
                            rules={[{ required: true, message: 'Please select a date' }]}
                            className="w-full"
                        >
                            <DatePicker format="YYYY-MM-DD" className='w-full' />
                        </Form.Item>

                        <Form.Item
                            name="appointment_time"
                            label="Time"
                            rules={[{ required: true, message: 'Please select a time' }]}
                            className="w-full"
                        >
                            <TimePicker format="HH:mm:ss" className='w-full' defaultOpenValue={dayjs('09:00:00', 'HH:mm:ss')} />
                        </Form.Item>
                    </div>

                    <Form.Item name="reason" label="Reason">
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item name="status" label="Status" hidden initialValue="pending">
                        <Select>
                            <Select.Option value="pending">Pending</Select.Option>
                            <Select.Option value="confirmed">Confirmed</Select.Option>
                            <Select.Option value="completed">Completed</Select.Option>
                            <Select.Option value="cancelled">Cancelled</Select.Option>
                        </Select>
                    </Form.Item>

                    <div className="flex justify-end">
                        <Button color='cyan' variant='outlined' onClick={() => { form.resetFields(); onClose(); }} className="mr-2">Cancel</Button>
                        <Button color='cyan' variant='solid' onClick={() => form.submit()} loading={submitting}>Book</Button>
                    </div>
                </Form>
            </Spin>
        </Modal>
    );
};

export default BookAppointmentModal;
