import React from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import axios from 'axios';
import LogoPic from '../assets/pic-about-1.png';
import { useAuth } from '../contexts/AuthContext';

interface Props {
    visible: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<Props> = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';
    const { login } = useAuth();

    // small helper to decode JWT payload without external deps
    const parseJwt = (token: string) => {
        try {
            const parts = token.split('.');
            if (parts.length < 2) return null;
            const payload = parts[1];
            // base64url -> base64
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
            const res = await axios.post(`${BASE_URL}/api/auth/login/`, values);
            const access = res.data?.access;
            const refresh = res.data?.refresh;

            if (refresh) localStorage.setItem('refresh', refresh);

            let userObj: any = null;

            if (access) {
                // try to fetch user details using the token
                const payload = parseJwt(access);
                const userId = payload?.user_id ?? payload?.user ?? payload?.userId;

                // prefer endpoint that returns current user
                try {
                    const userRes = await axios.get(`${BASE_URL}/api/auth/users/${userId}/`, {
                        headers: { Authorization: `Bearer ${access}` },
                    });
                    userObj = userRes.data;
                } catch (err) {
                    message.error('Failed to fetch user details');
                }

                // if we still don't have a user object, create a minimal one
                if (!userObj) {
                    userObj = {
                        id: userId || 0,
                        email: values.email || '',
                        full_name: '',
                        role: '',
                    };
                }

                // use AuthContext to store user and token (AuthProvider will persist them)
                login(userObj, access);
            } else {
                // no access token, still notify success message
                message.success(res.data?.message || 'Login successful');
            }

            message.success(res.data?.message || 'Login successful');
            form.resetFields();
            onClose();
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const data = err.response.data;
                if (typeof data === 'string') message.error(data);
                else if (data.detail) message.error(String(data.detail));
                else message.error('Login failed');
            } else {
                message.error('Login failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Login"
            open={visible}
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            onOk={() => form.submit()}
            okText="Login"
            confirmLoading={loading}
            width={600}
            centered
            footer={[
                <Button key="back" color='cyan' variant='outlined' onClick={() => {
                    form.resetFields();
                    onClose();
                }}>
                    Return
                </Button>,
                <Button key="submit" color='cyan' variant='solid' className='!font-bold' loading={loading} onClick={() => form.submit()}>
                    Login
                </Button>
            ]}
        >
            <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col justify-center w-full'>
                    <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ email: '', password: '' }}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Please enter a valid email' }]}
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
                    <img src={LogoPic} alt="Logo" className="w-60 h-60 object-contain" />
                </div>
            </div>
        </Modal>
    );
};

export default LoginModal;
