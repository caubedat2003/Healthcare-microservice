import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, message, Select } from 'antd';
import { AiFillEdit } from 'react-icons/ai';

const AppointmentAdmin = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editForm] = Form.useForm();
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

    useEffect(() => {
        fetchAll();
    }, []);

    // Fetch appointments, patients and doctors in parallel. If patient/doctor endpoints are not available,
    // fall back to empty arrays and show IDs in the table.
    const fetchAll = async () => {
        try {
            const [appRes, patRes, docRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/appointment/`),
                axios.get(`${BASE_URL}/api/patient/`).catch(() => ({ data: [] })),
                axios.get(`${BASE_URL}/api/doctor/`).catch(() => ({ data: [] })),
            ]);

            const sortedAppointments = Array.isArray(appRes.data)
                ? appRes.data.sort((a: Appointment, b: Appointment) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                : appRes.data;

            setAppointments(sortedAppointments);
            setPatients(Array.isArray(patRes.data) ? patRes.data : []);
            setDoctors(Array.isArray(docRes.data) ? docRes.data : []);
        } catch (error) {
            message.error('Failed to fetch appointments');
        }
    };

    // Backwards-compatible wrapper used elsewhere in the file
    const fetchAppointments = async () => {
        await fetchAll();
    };

    const showEditModal = (record: Appointment) => {
        setEditingAppointment(record);
        editForm.setFieldsValue({
            ...record,
            status: record.status || "pending",
        });
        setIsEditModalVisible(true);
    };

    const handleEditOk = async () => {
        try {
            const values = await editForm.validateFields();
            if (editingAppointment) {
                await axios.patch(`${BASE_URL}/api/appointment/${editingAppointment.id}/`, values);
                message.success('Appointment status updated successfully');
                setIsEditModalVisible(false);
                editForm.resetFields();
                fetchAppointments();
            } else {
                message.error('No appointment selected for editing.');
            }
        } catch (error) {
            message.error('Failed to update appointment status');
        }
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        editForm.resetFields();
    };

    interface Appointment {
        id: number;
        patient_id: number;
        doctor_id: number;
        appointment_date: string;
        appointment_time: string;
        status: string;
        reason: string;
        created_at: string;
    }

    // Helpers to resolve names from fetched patient/doctor lists. Fall back to ID if not found.
    const getPatientName = (patientId: number | undefined) => {
        if (patientId == null) return '-';
        const p = patients.find((x: any) => x.id === patientId);
        if (!p) return String(patientId);
        return p.full_name || p.name || `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() || String(patientId);
    };

    const getDoctorName = (doctorId: number | undefined) => {
        if (doctorId == null) return '-';
        const d = doctors.find((x: any) => x.id === doctorId);
        if (!d) return String(doctorId);
        return d.full_name || d.name || `${d.first_name ?? ''} ${d.last_name ?? ''}`.trim() || String(doctorId);
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        {
            title: 'Patient',
            dataIndex: 'patient_id',
            key: 'patient',
            render: (_: any, record: Appointment) => getPatientName(record.patient_id),
        },
        {
            title: 'Doctor',
            dataIndex: 'doctor_id',
            key: 'doctor',
            render: (_: any, record: Appointment) => getDoctorName(record.doctor_id),
        },
        {
            title: 'Date',
            dataIndex: 'appointment_date',
            key: 'appointment_date',
            render: (value: string) => (value ? new Date(value).toLocaleDateString() : '-'),
        },
        { title: 'Time', dataIndex: 'appointment_time', key: 'appointment_time' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        { title: 'Reason', dataIndex: 'reason', key: 'reason', width: 400 },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value: string) => (value ? new Date(value).toLocaleString() : '-'),
            sorter: (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: Appointment) => (
                <span className='flex gap-2'>
                    <Button type="link" color="cyan" variant="solid" shape="round" icon={<AiFillEdit />} onClick={() => showEditModal(record)}>Edit Status</Button>
                </span>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Appointment Management</h1>
            <Table columns={columns} dataSource={appointments} rowKey="id" />

            <Modal
                title="Edit Appointment Status"
                open={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
            >
                <Form form={editForm} layout="vertical" name="edit_appointment_form">
                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: 'Please select a status!' }]}
                    >
                        <Select placeholder="Select status">
                            <Select.Option value="pending">Pending</Select.Option>
                            <Select.Option value="confirmed">Confirmed</Select.Option>
                            <Select.Option value="completed">Completed</Select.Option>
                            <Select.Option value="cancelled">Cancelled</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AppointmentAdmin;