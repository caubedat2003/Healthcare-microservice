import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, message, Select } from 'antd';
import type { SortOrder } from 'antd/es/table/interface';
import { AiFillEdit } from 'react-icons/ai';
import { FaTrash } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';

interface User {
    id: number;
    email: string;
    full_name: string;
    role: string;
    created_at: string;
}

const UserAdmin = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8080";

    useEffect(() => {
        fetchUsers();
    }, []);

    const setFormErrorsFromApi = (formInstance: any, data: any) => {
        if (!data) return;
        const fields: any[] = [];
        for (const [key, val] of Object.entries(data)) {
            if (Array.isArray(val)) {
                fields.push({ name: key, errors: val.map((v) => String(v)) });
            } else if (val && typeof val === 'object') {
                const nestedValues = Object.values(val).flat?.() ?? Object.values(val).map(String);
                fields.push({ name: key, errors: nestedValues.map((v: any) => String(v)) });
            } else if (val != null) {
                fields.push({ name: key, errors: [String(val)] });
            }
        }
        if (fields.length) {
            try {
                formInstance.setFields(fields);
            } catch (e) {
                message.error(Object.values(data).flat?.().join(' ') || 'Validation error');
            }
        } else if (data.non_field_errors) {
            const nf = Array.isArray(data.non_field_errors) ? data.non_field_errors.join(' ') : String(data.non_field_errors);
            message.error(nf);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/auth/users/`);
            const sorted = Array.isArray(response.data)
                ? response.data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                : response.data;
            setUsers(sorted);
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
            await axios.post(`${BASE_URL}/api/auth/users/`, values);
            message.success('User created successfully');
            setIsCreateModalVisible(false);
            form.resetFields();
            fetchUsers();
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.data) {
                setFormErrorsFromApi(form, error.response.data);
            } else {
                message.error('Failed to create user');
            }
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
                await axios.put(`${BASE_URL}/api/auth/users/${editingUser.id}/`, values);
                message.success('User updated successfully');
                setIsEditModalVisible(false);
                editForm.resetFields();
                fetchUsers();
            } else {
                message.error('No user selected for editing.');
            }
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.data) {
                setFormErrorsFromApi(editForm, error.response.data);
            } else {
                message.error('Failed to update user');
            }
        }
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        editForm.resetFields();
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Confirm Delete',
            content: 'Are you sure you want to delete this user? This action cannot be undone.',
            okType: 'danger',
            onOk: async () => {
                try {
                    await axios.delete(`${BASE_URL}/api/auth/users/${id}/`);
                    message.success('User deleted successfully');
                    fetchUsers();
                } catch (error) {
                    message.error('Failed to delete user');
                }
            },
        });
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Full Name', dataIndex: 'full_name', key: 'full_name' },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value: string) => (value ? new Date(value).toLocaleString() : '-'),
            sorter: (a: User, b: User) => {
                const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
                const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
                return ta - tb;
            },
            defaultSortOrder: 'descend' as SortOrder,
        },
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