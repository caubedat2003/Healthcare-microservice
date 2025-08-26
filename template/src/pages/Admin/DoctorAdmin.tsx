import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, message, Select } from 'antd';
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
            setDoctors(response.data);
        } catch (error) {
            message.error('Failed to fetch doctors');
        }
    };

    const showCreateModal = () => {
        setIsCreateModalVisible(true);
    };

    const handleCreateOk = async () => {
        try {
            const values = await form.validateFields();
            await axios.post(`${BASE_URL}/api/doctor`, values);
            message.success('Doctor created successfully');
            setIsCreateModalVisible(false);
            form.resetFields();
            fetchDoctors();
        } catch (error) {
            message.error('Failed to create doctor');
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
                await axios.put(`${BASE_URL}/api/doctor/${editingDoctor.id}`, values);
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
        try {
            await axios.delete(`${BASE_URL}/api/doctor/${id}`);
            message.success('Doctor deleted successfully');
            fetchDoctors();
        } catch (error) {
            message.error('Failed to delete doctor');
        }
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
        { title: 'Created At', dataIndex: 'created_at', key: 'created_at' },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: Doctor) => (
                <span className='flex gap-2'>
                    <Button type="link" style={{ color: 'cyan' }} shape="round" icon={<AiFillEdit />} onClick={() => showEditModal(record)}>Edit</Button>
                    <Button type="link" style={{ color: 'red' }} shape="round" icon={<FaTrash />} onClick={() => handleDelete(record.id)}>Delete</Button>
                </span>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Doctor Management</h1>
            <Button style={{ backgroundColor: 'cyan', color: 'white' }} size='large' icon={<MdAdd />} onClick={showCreateModal} className="mb-4">
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
                        rules={[{ required: true, message: 'Please input specialization!' }]}
                    >
                        <Input />
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
                        rules={[{ required: true, message: 'Please input specialization!' }]}
                    >
                        <Input />
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