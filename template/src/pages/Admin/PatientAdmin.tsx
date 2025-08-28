import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { Table, Button, Modal, message, Form, Input, Select, DatePicker } from 'antd';
import { MdAdd } from 'react-icons/md';
import { FaEye, FaSearch, FaTrash } from 'react-icons/fa';
import { AiFillEdit } from 'react-icons/ai';

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

const PatientAdmin = () => {
    const [patients, setPatients] = useState([]);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const searchTimeoutRef = useRef<number | null>(null);
    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8080";

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async (query?: string) => {
        try {
            let url = `${BASE_URL}/api/patient/`;
            if (query && query.trim() !== '') {
                // use the search endpoint when query provided
                url = `${BASE_URL}/api/patient/search/?q=${encodeURIComponent(query.trim())}`;
            }
            const response = await axios.get(url);
            // sort by created_at newest first for display
            setPatients(response.data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        } catch (error) {
            message.error('Failed to fetch patients');
        }
    };

    // map DRF validation response to AntD form fields and global messages
    const setFormErrorsFromApi = (formInstance: any, data: any) => {
        if (!data) return;
        const fieldErrors = Object.entries(data)
            .filter(([k]) => k !== 'non_field_errors' && k !== 'detail')
            .map(([name, errs]) => ({ name, errors: Array.isArray(errs) ? errs : [String(errs)] }));

        if (fieldErrors.length) {
            try { formInstance.setFields(fieldErrors); } catch (e) { /* ignore */ }
        }

        const global = data.non_field_errors || data.detail;
        if (global) message.error(Array.isArray(global) ? global.join(' ') : String(global));
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
            await axios.post(`${BASE_URL}/api/patient/`, values);
            message.success('Patient created successfully');
            setIsCreateModalVisible(false);
            form.resetFields();
            fetchPatients();
        } catch (error: any) {
            const apiData = error?.response?.data;
            if (apiData) {
                setFormErrorsFromApi(form, apiData);
            } else {
                message.error('Failed to create patient');
            }
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
                await axios.put(`${BASE_URL}/api/patient/${editingPatient.id}/`, values);
                message.success('Patient updated successfully');
                setIsEditModalVisible(false);
                setEditingPatient(null);
                editForm.resetFields();
                fetchPatients();
            } else {
                message.error('No patient selected for editing');
            }
        } catch (error: any) {
            const apiData = error?.response?.data;
            if (apiData) {
                setFormErrorsFromApi(editForm, apiData);
            } else {
                message.error('Failed to update patient');
            }
        }
    };
    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setEditingPatient(null);
        editForm.resetFields();
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: 'Delete patient',
            content: 'Are you sure you want to delete this patient? This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await axios.delete(`${BASE_URL}/api/patient/${id}/`);
                    message.success('Patient deleted successfully');
                    fetchPatients();
                } catch (error) {
                    message.error('Failed to delete patient');
                }
            }
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setSearchQuery(v);
        if (searchTimeoutRef.current) {
            window.clearTimeout(searchTimeoutRef.current);
        }
        // debounce user typing
        searchTimeoutRef.current = window.setTimeout(() => {
            fetchPatients(v);
        }, 400);
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        if (searchTimeoutRef.current) {
            window.clearTimeout(searchTimeoutRef.current);
        }
        fetchPatients(value);
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'User ID', dataIndex: 'user_id', key: 'user_id', width: 100 },
        { title: 'Full Name', dataIndex: 'full_name', key: 'full_name', width: 300 },
        { title: 'Gender', dataIndex: 'gender', key: 'gender', width: 100 },
        { title: 'Date of Birth', dataIndex: 'date_of_birth', key: 'date_of_birth', width: 120 },
        { title: 'Phone Number', dataIndex: 'phone_number', key: 'phone_number', width: 140 },
        { title: 'Created At', dataIndex: 'created_at', key: 'created_at', render: (value: string) => value ? new Date(value).toLocaleString() : '-', sorter: (a: Patient, b: Patient) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime(), defaultSortOrder: 'descend' as any },
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
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <Button color="cyan" variant="solid" size='large' icon={<MdAdd />} onClick={showCreateModal}>
                        Add Patient
                    </Button>
                </div>
                <div style={{ minWidth: 240, width: '100%', maxWidth: 420 }}>
                    <Input.Search
                        placeholder="Search by name or phone"
                        allowClear
                        enterButton={<Button icon={<FaSearch />} style={{ backgroundColor: '#13c2c2', color: 'white', borderColor: '#13c2c2' }} >Search</Button>}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onSearch={handleSearch}
                        className='text-[var(--color-primary)]'
                    />
                </div>
            </div>
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