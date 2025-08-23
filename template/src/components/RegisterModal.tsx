import React from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import axios from 'axios';
import LogoPic from '../assets/pic-about-1.png';
import { useAuth } from '../contexts/AuthContext';

interface Props {
    visible: boolean;
    onClose: () => void;
}

const RegisterModal: React.FC<Props> = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';
    const { login } = useAuth();

    const parseJwt = (token: string) => {
        try {
            const parts = token.split('.');
            if (parts.length < 2) return null;
            const payload = parts[1];
            const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const json = decodeURIComponent(
                atob(b64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(json);
        } catch (e) {
            return null;
        }
    };

    const handleFinish = async (values: any) => {
        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/api/auth/register/`, values);
            const access = res.data?.access;
            const refresh = res.data?.refresh;

            if (refresh) localStorage.setItem('refresh', refresh);

            let userObj: any = null;
            if (access) {
                const payload = parseJwt(access);
                const userId = payload?.user_id ?? payload?.user ?? payload?.userId;

                // Try to fetch current user via auth endpoint
                try {
                    const userRes = await axios.get(`${BASE_URL}/api/auth//users/${userId}/`, {
                        headers: { Authorization: `Bearer ${access}` },
                    });
                    userObj = userRes.data;
                } catch (err) {
                    message.error('Failed to fetch user details after registration');
                }

                if (!userObj) {
                    userObj = {
                        id: userId || 0,
                        email: values.email || '',
                        full_name: values.full_name || '',
                        role: '',
                    };
                }

                // call context login
                login(userObj, access);
            }

            message.success(res.data?.message || 'Registered successfully');
            form.resetFields();
            onClose();
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const data = err.response.data;
                if (typeof data === 'string') message.error(data);
                else if (data.detail) message.error(String(data.detail));
                else {
                    // map field errors into a single message
                    if (typeof data === 'object') {
                        const msgs = Object.entries(data)
                            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : String(v)}`)
                            .join(' | ');
                        message.error(msgs || 'Registration failed');
                    } else message.error('Registration failed');
                }
            } else {
                message.error('Registration failed');
            }
        } finally {
            setLoading(false);
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
            okText="Register"
            confirmLoading={loading}
            width={700}
            centered
            className='pt-7'
            footer={[
                <Button key="back" color='cyan' variant='outlined' onClick={() => {
                    form.resetFields();
                    onClose();
                }}>
                    Return
                </Button>,
                <Button key="submit" color='cyan' variant='solid' className='!font-bold' loading={loading} onClick={() => form.submit()}>
                    Register
                </Button>
            ]}
        >
            <div className='grid grid-cols-2 gap-4 p-4'>
                <div className='flex flex-col justify-center w-full'>
                    <h1 className='flex items-center justify-center text-lg font-bold uppercase text-[var(--color-primary)] mb-2'>Register</h1>
                    <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ email: '', full_name: '', password: '' }}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Please enter a valid email' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="full_name"
                            label="Full name"
                            rules={[{ required: true, message: 'Please enter your full name' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, message: 'Please enter your password' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Form>
                </div>
                <div className='flex flex-col justify-center align-middle items-center'>
                    <img src={LogoPic} alt="Illustration" className="w-60 h-60 object-contain" />
                </div>
            </div>
        </Modal>
    );
};

export default RegisterModal;
