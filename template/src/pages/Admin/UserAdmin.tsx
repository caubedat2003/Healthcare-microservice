import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, message, Select } from 'antd';
import { AiFillEdit } from 'react-icons/ai';
import { FaTrash } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';

const UserAdmin = () => {
    const [users, setUsers] = useState([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingUser, setEditingUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/auth/users/');
            setUsers(response.data);
        } catch (error) {
            message.error('Failed to fetch users');
        }
    };

    const showCreateModal = () => {
        setIsCreateModalVisible(true);
    };

    const handleCreateOk = async () => {
        try {
            const values = await form.validateFields();
            await axios.post('http://localhost:8080/api/auth/users/', values);
            message.success('User created successfully');
            setIsCreateModalVisible(false);
            form.resetFields();
            fetchUsers();
        } catch (error) {
            message.error('Failed to create user');
        }
    };

    const handleCreateCancel = () => {
        setIsCreateModalVisible(false);
        form.resetFields();
    };

    const showEditModal = (record: User) => {
        setEditingUser(record);
        editForm.setFieldsValue({
            ...record,
            role: record.role || "",
        });
        setIsEditModalVisible(true);
    };

    const handleEditOk = async () => {
        try {
            const values = await editForm.validateFields();
            if (editingUser) {
                await axios.put(`http://localhost:8080/api/auth/users/${editingUser.id}/`, values);
                message.success('User updated successfully');
                setIsEditModalVisible(false);
                editForm.resetFields();
                fetchUsers();
            } else {
                message.error('No user selected for editing.');
            }
        } catch (error) {
            message.error('Failed to update user');
        }
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        editForm.resetFields();
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8080/api/auth/users/${id}/`);
            message.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            message.error('Failed to delete user');
        }
    };

    interface User {
        id: number;
        email: string;
        full_name: string;
        role: string;
        created_at: string;
    }

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Full Name', dataIndex: 'full_name', key: 'full_name' },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        { title: 'Created At', dataIndex: 'created_at', key: 'created_at' },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: User) => (
                <span className='flex gap-2'>
                    <Button type="link" color="cyan" variant="solid" shape="round" icon={<AiFillEdit />} onClick={() => showEditModal(record)}>Edit</Button>
                    <Button type="link" color="danger" variant="solid" shape="round" icon={<FaTrash />} onClick={() => handleDelete(record.id)}>Delete</Button>
                </span>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">User Management</h1>
            <Button color="cyan" variant="solid" size='large' icon={<MdAdd />} onClick={showCreateModal} className="mb-4">
                Create User
            </Button>
            <Table columns={columns} dataSource={users} rowKey="id" />

            <Modal
                title="Create User"
                open={isCreateModalVisible}
                onOk={handleCreateOk}
                onCancel={handleCreateCancel}
            >
                <Form form={form} layout="vertical" name="create_user_form">
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="full_name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please input full name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: 'Please select a role!' }]}
                    >
                        <Select placeholder="Select role">
                            <Select.Option value="">-- Select role --</Select.Option>
                            <Select.Option value="patient">Patient</Select.Option>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="doctor">Doctor</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit User"
                open={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
            >
                <Form form={editForm} layout="vertical" name="edit_user_form">
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="full_name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please input full name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: 'Please select a role!' }]}
                    >
                        <Select placeholder="Select role">
                            <Select.Option value="">-- Select role --</Select.Option>
                            <Select.Option value="patient">Patient</Select.Option>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="doctor">Doctor</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserAdmin;