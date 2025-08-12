import React from 'react';
import BgPicture from '../assets/hero-contact.jpg';
import picForm from '../assets/contact-form.jpg'
import { Button, Form, Input, notification } from 'antd';
import { FaEnvelope } from 'react-icons/fa';
import { FiPhone } from "react-icons/fi";
import { LuAmbulance } from "react-icons/lu";
import { IoLocationOutline } from 'react-icons/io5';
import Footer from '../components/Footer';

const ContactHero = () => {
    return (
        <section id='contact-hero' className="bg-gray-100 h-screen">
            <img src={BgPicture} alt="Background"
                className='absolute inset-0 w-full h-full object-cover z-0'
            />
            <div className="min-h-screen flex items-center justify-center text-white relative z-10">
                <div className="flex flex-col justify-center items-center text-center gap-5">
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold">Contact Us</h1>
                    <p className="text-xl sm:text-2xl ">We're here to help and answer any question you might have</p>
                </div>
            </div>
        </section>
    );
};

const ContactInfo = () => {
    return (
        <section id='contact-info' className="bg-white py-20">
            <div className='container mx-auto px-4'>
                <div className='flex flex-col items-center justify-center mb-10'>
                    <h1 className='text-4xl font-bold uppercase'>Get In Touch</h1>
                    <p className='text-base text-gray-400 mt-3'>Reach out to us for any inquiries or appointments</p>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
                    <div className='flex flex-row items-center justify-start gap-5 p-6 border rounded-lg shadow-sm'>
                        <div className="bg-[#13c2c2] rounded-full w-[64px] h-[64px] flex items-center justify-center">
                            <FiPhone className="text-white w-[32px] h-[32px]" />
                        </div>
                        <div>
                            <h2 className='text-base font-bold uppercase'>Hotline</h2>
                            <p className='text-gray-600 text-xl'>1900-0091</p>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-start gap-5 p-6 border rounded-lg shadow-sm'>
                        <div className="bg-[#13c2c2] rounded-full w-[64px] h-[64px] flex items-center justify-center">
                            <LuAmbulance className="text-white w-[32px] h-[32px]" />
                        </div>
                        <div>
                            <h2 className='text-base font-bold uppercase'>Ambulance</h2>
                            <p className='text-gray-600 text-xl'>876-256-876</p>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-start gap-5 p-6 border rounded-lg shadow-sm'>
                        <div className="bg-[#13c2c2] rounded-full w-[64px] h-[64px] flex items-center justify-center">
                            <IoLocationOutline className="text-white w-[32px] h-[32px]" />
                        </div>
                        <div className='flex flex-col'>
                            <h2 className='text-base font-bold uppercase'>Location</h2>
                            <p className='text-gray-600 text-xl'>123 Nguyen Trai, Hanoi</p>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-start gap-5 p-6 border rounded-lg shadow-sm'>
                        <div className="bg-[#13c2c2] rounded-full w-[64px] h-[64px] flex items-center justify-center">
                            <FaEnvelope className="text-white w-[32px] h-[32px]" />
                        </div>
                        <div>
                            <h2 className='text-base font-bold uppercase'>Email</h2>
                            <p className='text-gray-600 text-xl'>support@prohealth.vn</p>
                        </div>
                    </div>
                </div>
                <div className='mt-10 flex flex-col items-center'>
                    <h2 className='text-2xl font-bold mb-4'>Business Hours</h2>
                    <ul className='text-gray-600 text-center'>
                        <li>Monday - Friday: 8:00 AM - 8:00 PM</li>
                        <li>Saturday: 9:00 AM - 5:00 PM</li>
                        <li>Sunday: Closed</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

const ContactForm = () => {
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    const openNotification = () => {
        api.success({
            message: `Success`,
            description: 'Your message has been sent successfully!',
            placement: 'bottomRight',
            showProgress: true,

        });
    };

    const onFinish = (values: { name: string; email: string; subject: string; message: string }) => {
        console.log('Received values:', values);
        openNotification();
        // Here you would typically send the form data to a backend
        form.resetFields();
    };

    return (
        <section id='contact-form' className="bg-white py-20">
            <div className='container mx-auto px-4'>
                <div className='flex flex-col items-center justify-center mb-10'>
                    <h1 className='text-4xl font-bold uppercase'>Send Us A Message</h1>
                    <p className='text-base text-gray-400 mt-3'>Fill out the form below and we'll get back to you shortly</p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <Form
                            form={form}
                            name="contact"
                            onFinish={onFinish}
                            layout="vertical"
                            className=''
                        >
                            <Form.Item
                                name="name"
                                label="Your Name"
                                rules={[{ required: true, message: 'Please input your name!' }]}
                            >
                                <Input placeholder="Enter your name" />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Your Email"
                                rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
                            >
                                <Input placeholder="Enter your email" />
                            </Form.Item>
                            <Form.Item
                                name="subject"
                                label="Subject"
                                rules={[{ required: true, message: 'Please input the subject!' }]}
                            >
                                <Input placeholder="Enter subject" />
                            </Form.Item>
                            <Form.Item
                                name="message"
                                label="Message"
                                rules={[{ required: true, message: 'Please input your message!' }]}
                            >
                                <Input.TextArea rows={4} placeholder="Enter your message" />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    className="!bg-gradient-to-r from-[#0f9f9f] to-[#1aeaea] border-none text-white !font-bold uppercase hover:opacity-60"
                                >
                                    Send Message
                                </Button>
                            </Form.Item>
                        </Form>
                        {contextHolder}
                    </div>
                    <div className='flex items-center justify-center'>
                        <img src={picForm} alt="Contact Form" className='h-[480px]' />
                    </div>
                </div>
            </div>
        </section>
    );
};

const MapSection = () => {
    return (
        <section id='map' className="bg-white py-20">
            <div className='container mx-auto px-4'>
                <div className='flex flex-col items-center justify-center mb-10'>
                    <h1 className='text-4xl font-bold uppercase'>Find Us On Map</h1>
                    <p className='text-base text-gray-400 mt-3'>Location: 123 Nguyen Trai, Thanh Xuan, Hanoi, Vietnam</p>
                </div>
                <div className='w-full h-[400px]'>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096888041974!2d105.84116531501055!3d21.028811785994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab145bf89bf7%3A0xd7c2f79a5a1c48b4!2sHanoi%2C%20Vietnam!5e0!3m2!1sen!2sus!4v1690000000000!5m2!1sen!2sus"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

const Contact = () => {
    return (
        <div>
            <ContactHero />
            <ContactInfo />
            <ContactForm />
            <MapSection />
            <Footer />
        </div>
    );
};

export default Contact;