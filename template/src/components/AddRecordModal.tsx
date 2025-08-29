import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Table, Button, Popconfirm, Space, message } from 'antd';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

type Patient = {
    id: number;
    full_name?: string;
};

interface Props {
    visible: boolean;
    onClose: () => void;
    patient?: Patient | null;
    onCreated?: () => void;
}

const AddRecordModal: React.FC<Props> = ({ visible, onClose, patient, onCreated }) => {
    const { user } = useAuth();
    const [form] = Form.useForm();
    const [rowForm] = Form.useForm();
    const [doctorId, setDoctorId] = useState<number | null>(null);
    const [prescriptionRows, setPrescriptionRows] = useState<any[]>([]);
    const [editingKey, setEditingKey] = useState<number | ''>('');
    const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            // reset state and fetch doctor id
            form.resetFields();
            setPrescriptionRows([{ key: Date.now(), medication: '', dosage: '', frequency: '', refills: 0 }]);
            setEditingKey('');
            setDoctorId(null);
            (async () => {
                try {
                    if (user?.id) {
                        const res = await axios.get(`${BASE_URL}/api/doctor/user/${user.id}/`);
                        const doc = Array.isArray(res.data) ? res.data[0] : res.data;
                        setDoctorId(doc?.id || null);
                    }
                } catch (err) {
                    // ignore
                    console.warn('Failed to load doctor for user', err);
                }
            })();
        }
    }, [visible]);

    const addPrescriptionRow = () => {
        setPrescriptionRows(prev => [...prev, { key: Date.now(), medication: '', dosage: '', frequency: '', refills: 0 }]);
    };

    const removePrescriptionRow = (key: number) => {
        setPrescriptionRows(prev => prev.filter(r => r.key !== key));
    };

    const editRow = (record: any) => {
        rowForm.setFieldsValue({ medication: record.medication, dosage: record.dosage, frequency: record.frequency, refills: record.refills });
        setEditingKey(record.key);
    };

    const cancelEditRow = () => {
        setEditingKey('');
    };

    const saveRow = async (key: number) => {
        try {
            const values = await rowForm.validateFields();
            const newData = [...prescriptionRows];
            const index = newData.findIndex((item) => item.key === key);
            if (index > -1) {
                newData[index] = { ...newData[index], ...values };
                setPrescriptionRows(newData);
                setEditingKey('');
            }
        } catch (err) {
            console.error('Row validate failed', err);
        }
    };

    const handleCreateRecord = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                patient_id: Number(patient?.id),
                doctor_id: doctorId || values.doctor_id || null,
                appointment_id: values.appointment_id || null,
                subject: values.subject,
                content: values.content,
                diagnosis: values.diagnosis,
                symtoms: values.symtoms,
                treatment: values.treatment,
                prescription: prescriptionRows.map(r => ({ medication: r.medication, dosage: r.dosage, frequency: r.frequency, refills: Number(r.refills) })),
            };
            setLoading(true);
            await axios.post(`${BASE_URL}/api/medical-records/`, payload);
            message.success('Medical record created');
            onClose();
            if (onCreated) onCreated();
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response?.data) {
                message.error(String(err.response.data.detail || JSON.stringify(err.response.data)));
            } else {
                message.error('Failed to create medical record');
            }
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Medication', dataIndex: 'medication', key: 'medication', render: (_: any, record: any) => (
                editingKey === record.key ? (
                    <Form.Item name='medication' style={{ margin: 0 }} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                ) : (
                    <span>{record.medication}</span>
                )
            )
        },
        {
            title: 'Dosage', dataIndex: 'dosage', key: 'dosage', width: 120, render: (_: any, record: any) => (
                editingKey === record.key ? (
                    <Form.Item name='dosage' style={{ margin: 0 }} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                ) : (
                    <span>{record.dosage}</span>
                )
            )
        },
        {
            title: 'Frequency', dataIndex: 'frequency', key: 'frequency', width: 180, render: (_: any, record: any) => (
                editingKey === record.key ? (
                    <Form.Item name='frequency' style={{ margin: 0 }} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                ) : (
                    <span>{record.frequency}</span>
                )
            )
        },
        {
            title: 'Refills', dataIndex: 'refills', key: 'refills', width: 100, render: (_: any, record: any) => (
                editingKey === record.key ? (
                    <Form.Item name='refills' style={{ margin: 0 }}>
                        <InputNumber min={0} />
                    </Form.Item>
                ) : (
                    <span>{record.refills}</span>
                )
            )
        },
        {
            title: 'Actions', dataIndex: 'actions', key: 'actions', width: 160, render: (_: any, record: any) => (
                <div className='flex gap-2'>
                    {editingKey === record.key ? (
                        <>
                            <Button type='link' onClick={() => saveRow(record.key)}>Save</Button>
                            <Button type='link' onClick={cancelEditRow}>Cancel</Button>
                        </>
                    ) : (
                        <>
                            <Button type='link' onClick={() => editRow(record)}>Edit</Button>
                            <Popconfirm title='Remove row?' onConfirm={() => removePrescriptionRow(record.key)}>
                                <Button type='link' danger>Remove</Button>
                            </Popconfirm>
                        </>
                    )}
                </div>
            )
        },
    ];

    return (
        <Modal
            title={`Create Medical Record for ${patient?.full_name || ''}`}
            open={visible}
            onCancel={onClose}
            onOk={handleCreateRecord}
            width={900}
            confirmLoading={loading}
        >
            <Form form={form} layout='vertical'>
                <div className='grid grid-cols-2 gap-4'>
                    <Form.Item name='subject' label='Subject' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='appointment_id' label='Appointment ID'>
                        <Input />
                    </Form.Item>
                </div>
                <Form.Item name='content' label='Content'>
                    <Input.TextArea rows={4} />
                </Form.Item>
                <div className='grid grid-cols-2 gap-4'>
                    <Form.Item name='diagnosis' label='Diagnosis'>
                        <Input />
                    </Form.Item>
                    <Form.Item name='symtoms' label='Symptoms'>
                        <Input />
                    </Form.Item>
                </div>
                <Form.Item name='treatment' label='Treatment'>
                    <Input.TextArea rows={3} />
                </Form.Item>

                <div className='mb-2 flex items-center justify-between'>
                    <h3 className='text-lg font-medium'>Prescription</h3>
                    <Space>
                        <Button onClick={addPrescriptionRow}>Add row</Button>
                    </Space>
                </div>

                <Form form={rowForm} component={false}>
                    <Table
                        dataSource={prescriptionRows}
                        pagination={false}
                        rowKey='key'
                        bordered
                        columns={columns as any}
                        onRow={(record) => ({
                            onDoubleClick: () => editRow(record),
                        })}
                    />
                </Form>
            </Form>
        </Modal>
    );
};

export default AddRecordModal;
