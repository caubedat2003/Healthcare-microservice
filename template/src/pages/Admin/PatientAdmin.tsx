import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { Table, Button, Modal, message, Form, Input, Select, DatePicker } from 'antd';
import { MdAdd } from 'react-icons/md';
import { FaEye, FaTrash } from 'react-icons/fa';
import { AiFillEdit } from 'react-icons/ai';

const PatientAdmin = () => {
    const [patients, setPatients] = useState([]);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/patient/');
            setPatients(response.data);
        } catch (error) {
            message.error('Failed to fetch patients');
        }
    };

    const showViewModal = (record: Patient) => {
        setSelectedPatient(record);
        setIsViewModalVisible(true);
    };

    const handleViewCancel = () => {
        setIsViewModalVisible(false);
        setSelectedPatient(null);
    };

    const showCreateModal = () => {
        setIsCreateModalVisible(true);
    };

    const handleCreateOk = async () => {
        try {
            const values = await form.validateFields();
            if (values.date_of_birth) {
                values.date_of_birth = values.date_of_birth.format("YYYY-MM-DD");
            }
            await axios.post('http://localhost:8080/api/patient/', values);
            message.success('Patient created successfully');
            setIsCreateModalVisible(false);
            form.resetFields();
            fetchPatients();
        } catch (error) {
            message.error('Failed to create patient');
        }
    };

    const handleCreateCancel = () => {
        setIsCreateModalVisible(false);
        form.resetFields();
    };

    const showEditModal = (record: Patient) => {
        setEditingPatient(record);
        editForm.setFieldsValue({
            ...record,
            date_of_birth: record.date_of_birth ? dayjs(record.date_of_birth, "YYYY-MM-DD") : null,
        });
        setIsEditModalVisible(true);
    };

    const handleEditOk = async () => {
        try {
            const values = await editForm.validateFields();
            if (editingPatient) {
                if (values.date_of_birth) {
                    values.date_of_birth = values.date_of_birth.format("YYYY-MM-DD");
                }
                await axios.put(`http://localhost:8080/api/patient/${editingPatient.id}/`, values);
                message.success('Patient updated successfully');
                setIsEditModalVisible(false);
                setEditingPatient(null);
                editForm.resetFields();
                fetchPatients();
            } else {
                message.error('No patient selected for editing');
            }
        } catch (error) {
            message.error('Failed to update patient');
        }
    };
    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setEditingPatient(null);
        editForm.resetFields();
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8080/api/patient/${id}/`);
            message.success('Patient deleted successfully');
            fetchPatients();
        } catch (error) {
            message.error('Failed to delete patient');
        }
    };

    type Patient = {
        id: number;
        user_id?: number;
        full_name: string;
        gender?: string;
        date_of_birth?: string;
        phone_number?: string;
        address?: string;
        blood_type?: string;
        medical_history?: string;
        created_at?: string;
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'User ID', dataIndex: 'user_id', key: 'user_id', width: 100 },
        { title: 'Full Name', dataIndex: 'full_name', key: 'full_name', width: 300 },
        { title: 'Gender', dataIndex: 'gender', key: 'gender', width: 100 },
        { title: 'Date of Birth', dataIndex: 'date_of_birth', key: 'date_of_birth', width: 120 },
        { title: 'Phone Number', dataIndex: 'phone_number', key: 'phone_number', width: 140 },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (record: Patient) => (
                <span className='flex gap-2'>
                    <Button type="link" color="cyan" variant="solid" shape="round" icon={<FaEye />} onClick={() => showViewModal(record)}>View</Button>
                    <Button type="link" color="cyan" variant="solid" shape="round" icon={<AiFillEdit />} onClick={() => showEditModal(record)}>Edit</Button>
                    <Button type="link" color="danger" variant="solid" shape="round" icon={<FaTrash />} onClick={() => handleDelete(record.id)}>Delete</Button>
                </span>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Patient Management</h1>
            <Button color="cyan" variant="solid" size='large' icon={<MdAdd />} onClick={showCreateModal} className="mb-4">
                Add Patient
            </Button>
            <Table columns={columns} dataSource={patients} rowKey="id" />

            <Modal
                title="Patient Details"
                open={isViewModalVisible}
                onCancel={handleViewCancel}
                footer={null}
            >
                {selectedPatient && (
                    <div className="p-4">
                        <p><strong>ID:</strong> {selectedPatient.id}</p>
                        <p><strong>User ID:</strong> {selectedPatient.user_id}</p>
                        <p><strong>Full Name:</strong> {selectedPatient.full_name}</p>
                        <p><strong>Gender:</strong> {selectedPatient.gender || 'N/A'}</p>
                        <p><strong>Date of Birth:</strong> {selectedPatient.date_of_birth || 'N/A'}</p>
                        <p><strong>Phone Number:</strong> {selectedPatient.phone_number || 'N/A'}</p>
                        <p><strong>Address:</strong> {selectedPatient.address || 'N/A'}</p>
                        <p><strong>Blood Type:</strong> {selectedPatient.blood_type || 'N/A'}</p>
                        <p><strong>Medical History:</strong> {selectedPatient.medical_history || 'N/A'}</p>
                        <p><strong>Created At:</strong> {selectedPatient.created_at}</p>
                    </div>
                )}
            </Modal>

            <Modal
                title="Add Patient"
                open={isCreateModalVisible}
                onOk={handleCreateOk}
                onCancel={handleCreateCancel}
            >
                <Form form={form} layout="vertical" name="create_patient_form">
                    <Form.Item
                        name="full_name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please input full name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <div className='grid grid-cols-2 gap-4'>
                        <Form.Item
                            name="date_of_birth"
                            label="Date of Birth"
                        >
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                        </Form.Item>
                        <Form.Item
                            name="user_id"
                            label="User ID"
                            rules={[{ message: 'Please input user ID!' }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <Form.Item
                        name="gender"
                        label="Gender"
                    >
                        <Select placeholder="Select gender">
                            <Select.Option value="">-- Select gender --</Select.Option>
                            <Select.Option value="male">Male</Select.Option>
                            <Select.Option value="female">Female</Select.Option>
                            <Select.Option value="other">Other</Select.Option>
                        </Select>
                    </Form.Item>
                    <div className='grid grid-cols-2 gap-4'>
                        <Form.Item
                            name="phone_number"
                            label="Phone Number"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="blood_type"
                            label="Blood Type"
                        >
                            <Select placeholder="Select blood type">
                                <Select.Option value="">-- Select blood type --</Select.Option>
                                <Select.Option value="A+">A+</Select.Option>
                                <Select.Option value="A-">A-</Select.Option>
                                <Select.Option value="B+">B+</Select.Option>
                                <Select.Option value="B-">B-</Select.Option>
                                <Select.Option value="AB+">AB+</Select.Option>
                                <Select.Option value="AB-">AB-</Select.Option>
                                <Select.Option value="O+">O+</Select.Option>
                                <Select.Option value="O-">O-</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="address"
                        label="Address"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="medical_history"
                        label="Medical History"
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Patient"
                open={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
            >
                <Form form={editForm} layout="vertical" name="edit_patient_form">
                    <Form.Item
                        name="full_name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please input full name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <div className='grid grid-cols-2 gap-4'>
                        <Form.Item
                            name="date_of_birth"
                            label="Date of Birth"
                        >
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                        </Form.Item>
                        <Form.Item
                            name="user_id"
                            label="User ID"
                            rules={[{ required: true, message: 'Please input user ID!' }]}>
                            <Input disabled />
                        </Form.Item>
                    </div>
                    <Form.Item
                        name="gender"
                        label="Gender"
                    >
                        <Select placeholder="Select gender">
                            <Select.Option value="">-- Select gender --</Select.Option>
                            <Select.Option value="male">Male</Select.Option>
                            <Select.Option value="female">Female</Select.Option>
                            <Select.Option value="other">Other</Select.Option>
                        </Select>
                    </Form.Item>
                    <div className='grid grid-cols-2 gap-4'>
                        <Form.Item
                            name="phone_number"
                            label="Phone Number"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="blood_type"
                            label="Blood Type"
                        >
                            <Select placeholder="Select blood type">
                                <Select.Option value="">-- Select blood type --</Select.Option>
                                <Select.Option value="A+">A+</Select.Option>
                                <Select.Option value="A-">A-</Select.Option>
                                <Select.Option value="B+">B+</Select.Option>
                                <Select.Option value="B-">B-</Select.Option>
                                <Select.Option value="AB+">AB+</Select.Option>
                                <Select.Option value="AB-">AB-</Select.Option>
                                <Select.Option value="O+">O+</Select.Option>
                                <Select.Option value="O-">O-</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="address"
                        label="Address"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="medical_history"
                        label="Medical History"
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PatientAdmin;