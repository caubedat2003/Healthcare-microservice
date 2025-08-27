import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, message, Select, type FormInstance } from 'antd';
import { AiFillEdit } from 'react-icons/ai';
import { FaTrash } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';

const DoctorAdmin = () => {
    const [doctors, setDoctors] = useState([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8080";

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/doctor/`);
            // sort by created_at newest first for display
            setDoctors(response.data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        } catch (error) {
            message.error('Failed to fetch doctors');
        }
    };

    const showCreateModal = () => {
        setIsCreateModalVisible(true);
    };

    const setFormErrorsFromApi = (form: FormInstance, data: any) => {
        // backend returns { field_name: ["error1", "error2"], non_field_errors: ["..."] } or similar
        const fieldErrors = Object.entries(data)
            .filter(([k]) => k !== 'non_field_errors' && k !== 'detail')
            .map(([name, errs]) => ({
                name,
                errors: Array.isArray(errs) ? errs : [String(errs)],
            }));

        if (fieldErrors.length) {
            form.setFields(fieldErrors as any);
        }

        // show global error(s)
        const global = data.non_field_errors || data.detail;
        if (global) {
            message.error(Array.isArray(global) ? global.join(' ') : String(global));
        }
    };

    const handleCreateOk = async () => {
        try {
            const values = await form.validateFields();
            await axios.post(`${BASE_URL}/api/doctor/`, values);
            message.success('Doctor created successfully');
            setIsCreateModalVisible(false);
            form.resetFields();
            fetchDoctors();
        } catch (err: any) {
            // axios validation error from DRF typically lives in err.response.data
            const apiData = err?.response?.data;
            if (apiData) {
                setFormErrorsFromApi(form, apiData);
            } else {
                message.error('Failed to create doctor');
            }
        }
    };

    const handleCreateCancel = () => {
        setIsCreateModalVisible(false);
        form.resetFields();
    };

    const showEditModal = (record: Doctor) => {
        setEditingDoctor(record);
        editForm.setFieldsValue({
            ...record,
            specialization: record.specialization || "",
        });
        setIsEditModalVisible(true);
    };

    const handleEditOk = async () => {
        try {
            const values = await editForm.validateFields();
            if (editingDoctor) {
                await axios.put(`${BASE_URL}/api/doctor/${editingDoctor.id}/`, values);
                message.success('Doctor updated successfully');
                setIsEditModalVisible(false);
                editForm.resetFields();
                fetchDoctors();
            } else {
                message.error('No doctor selected for editing.');
            }
        } catch (error) {
            message.error('Failed to update doctor');
        }
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        editForm.resetFields();
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: 'Delete doctor',
            content: 'Are you sure you want to delete this doctor? This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await axios.delete(`${BASE_URL}/api/doctor/${id}/`);
                    message.success('Doctor deleted successfully');
                    fetchDoctors();
                } catch (error) {
                    message.error('Failed to delete doctor');
                }
            }
        });
    };

    interface Doctor {
        id: number;
        user_id: number;
        full_name: string;
        specialization: string;
        years_of_experience: number;
        license_number: string;
        phone_number: string;
        created_at: string;
    }

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'User ID', dataIndex: 'user_id', key: 'user_id' },
        { title: 'Full Name', dataIndex: 'full_name', key: 'full_name' },
        { title: 'Specialization', dataIndex: 'specialization', key: 'specialization' },
        { title: 'Years of Experience', dataIndex: 'years_of_experience', key: 'years_of_experience' },
        { title: 'License Number', dataIndex: 'license_number', key: 'license_number' },
        { title: 'Phone Number', dataIndex: 'phone_number', key: 'phone_number' },
        { title: 'Created At', dataIndex: 'created_at', key: 'created_at', render: (value: string) => value ? new Date(value).toLocaleString() : '-', sorter: (a: Doctor, b: Doctor) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(), defaultSortOrder: 'descend' as any },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: Doctor) => (
                <span className='flex gap-2'>
                    <Button type="link" color="cyan" variant="solid" shape="round" icon={<AiFillEdit />} onClick={() => showEditModal(record)}>Edit</Button>
                    <Button type="link" color="danger" variant="solid" shape="round" icon={<FaTrash />} onClick={() => handleDelete(record.id)}>Delete</Button>
                </span>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Doctor Management</h1>
            <Button color="cyan" variant="solid" size='large' icon={<MdAdd />} onClick={showCreateModal} className="mb-4">
                Create Doctor
            </Button>
            <Table columns={columns} dataSource={doctors} rowKey="id" />

            <Modal
                title="Create Doctor"
                open={isCreateModalVisible}
                onOk={handleCreateOk}
                onCancel={handleCreateCancel}
            >
                <Form form={form} layout="vertical" name="create_doctor_form">
                    <Form.Item
                        name="user_id"
                        label="User ID"
                        rules={[{ required: true, message: 'Please input user ID!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="full_name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please input full name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="specialization"
                        label="Specialization"
                        rules={[{ required: true, message: 'Please select specialization!' }]}
                    >
                        <Select placeholder="Select specialization">
                            <Select.Option value="Emergency">Emergency</Select.Option>
                            <Select.Option value="Cardiology">Cardiology</Select.Option>
                            <Select.Option value="Pediatric">Pediatric</Select.Option>
                            <Select.Option value="Gynecology">Gynecology</Select.Option>
                            <Select.Option value="Neurology">Neurology</Select.Option>
                            <Select.Option value="Psychiatry">Psychiatry</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="years_of_experience"
                        label="Years of Experience"
                        rules={[{ required: true, message: 'Please input years of experience!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="license_number"
                        label="License Number"
                        rules={[{ required: true, message: 'Please input license number!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone_number"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please input phone number!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Doctor"
                open={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
            >
                <Form form={editForm} layout="vertical" name="edit_doctor_form">
                    <Form.Item
                        name="user_id"
                        label="User ID"
                        rules={[{ required: true, message: 'Please input user ID!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="full_name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please input full name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="specialization"
                        label="Specialization"
                        rules={[{ required: true, message: 'Please select specialization!' }]}
                    >
                        <Select placeholder="Select specialization">
                            <Select.Option value="Emergency">Emergency</Select.Option>
                            <Select.Option value="Cardiology">Cardiology</Select.Option>
                            <Select.Option value="Pediatric">Pediatric</Select.Option>
                            <Select.Option value="Gynecology">Gynecology</Select.Option>
                            <Select.Option value="Neurology">Neurology</Select.Option>
                            <Select.Option value="Psychiatry">Psychiatry</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="years_of_experience"
                        label="Years of Experience"
                        rules={[{ required: true, message: 'Please input years of experience!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="license_number"
                        label="License Number"
                        rules={[{ required: true, message: 'Please input license number!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone_number"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please input phone number!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DoctorAdmin;