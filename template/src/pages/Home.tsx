import React from 'react';
import BgPicture from '../assets/bg-hero.png'
import contactBg from '../assets/contact-picture.png'
import doctor1 from '../assets/doctor_1.png'
import doctor2 from '../assets/doctor_2.png'
import doctor3 from '../assets/doctor_3.png'
import { FiPhone } from "react-icons/fi";
import { LuAmbulance, LuBaby } from "react-icons/lu";
import { IoLocationOutline } from 'react-icons/io5';
import { Button, Card } from 'antd';
import { FaArrowRight, FaEnvelope, FaFacebook, FaInstagram, FaPhone, FaSyringe, FaTwitter, FaYoutube } from 'react-icons/fa';
import Link from 'antd/es/typography/Link';
import { RiAlarmWarningFill, RiAlarmWarningLine } from 'react-icons/ri';
import { MdChildCare } from 'react-icons/md';
import { LiaDnaSolid } from 'react-icons/lia';
import { GiBrain, GiHeartOrgan } from 'react-icons/gi';
import { FaLocationDot } from 'react-icons/fa6';

const HeroSection = () => {
    return (
        <section id='hero' className="bg-gray-100 h-screen">
            <img src={BgPicture} alt="Background"
                className='absolute inset-0 w-full h-full object-cover z-0'
            />
            <div className="min-h-screen flex items-center justify-center text-white relative z-10">
                <div className="flex flex-col justify-center items-center text-center gap-5">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl italic font-[Times_New_Roman] font-semibold">Welcome To Our Clinic!</h2>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-bold">IT'S NICE TO MEET YOU</h1>
                    <a className="p-6 bg-[#13c2c2] rounded-xl border-none text-white font-bold 
                        sm:text-xl md:text-3xl hover:bg-white hover:text-[#13c2c2] transition duration-300 ease-in-out"
                        href="#department"
                    >
                        Tell Me More
                    </a>
                </div>
            </div>
        </section>
    );
}

const DepartmentSection = () => {
    return (
        <section id='department' className="bg-white py-20">
            <div className='container mx-auto px-4'>
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-4xl font-bold uppercase'>Departments</h1>
                </div>
                <div className='grid grid-cols-6 gap-6 mt-10'>
                    <Card
                        className="shadow-md transition-all duration-300 ease-in-out hover:bg-[#13c2c2] group hover:scale-105 hover:-translate-y-2"
                    >
                        <div className='flex flex-col items-center justify-center'>
                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                <RiAlarmWarningFill className="w-[64px] h-[64px] text-[#13c2c2]  transition-colors duration-300" />
                            </div>
                            <p className='text-lg font-bold uppercase text-[#13c2c2]  transition-colors duration-300'>Emergency</p>
                            <p className='text-lg font-bold uppercase text-[#13c2c2]  transition-colors duration-300'>Department</p>
                        </div>
                    </Card>
                    <Card
                        className="shadow-md transition-all duration-300 ease-in-out hover:bg-[#13c2c2] group hover:scale-105 hover:-translate-y-2"
                    >
                        <div className='flex flex-col items-center justify-center'>
                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                <LuBaby className="w-[64px] h-[64px] text-[#13c2c2]  transition-colors duration-300" />
                            </div>
                            <p className='text-lg font-bold uppercase text-[#13c2c2]  transition-colors duration-300'>Pediatric</p>
                            <p className='text-lg font-bold uppercase text-[#13c2c2]  transition-colors duration-300'>Department</p>
                        </div>
                    </Card>
                    <Card
                        className="shadow-md transition-all duration-300 ease-in-out hover:bg-[#13c2c2] group hover:scale-105 hover:-translate-y-2"
                    >
                        <div className='flex flex-col items-center justify-center'>
                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                <LiaDnaSolid className="w-[64px] h-[64px] text-[#13c2c2]  transition-colors duration-300" />
                            </div>
                            <p className='text-lg font-bold uppercase text-[#13c2c2]  transition-colors duration-300'>Genecology</p>
                            <p className='text-lg font-bold uppercase text-[#13c2c2]  transition-colors duration-300'>Department</p>
                        </div>
                    </Card>
                    <Card
                        className="shadow-md transition-all duration-300 ease-in-out hover:bg-[#13c2c2] group hover:scale-105 hover:-translate-y-2"
                    >
                        <div className='flex flex-col items-center justify-center'>
                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                <GiHeartOrgan className="w-[64px] h-[64px] text-[#13c2c2]  transition-colors duration-300" />
                            </div>
                            <p className='text-lg font-bold uppercase text-[#13c2c2]  transition-colors duration-300'>Cardiology</p>
                            <p className='text-lg font-bold uppercase text-[#13c2c2]  transition-colors duration-300'>Department</p>
                        </div>
                    </Card>
                    <Card
                        className="shadow-md transition-all duration-300 ease-in-out hover:bg-[#13c2c2] group hover:scale-105 hover:-translate-y-2"
                    >
                        <div className='flex flex-col items-center justify-center'>
                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                <FaSyringe className="w-[64px] h-[64px] text-[#13c2c2]  transition-colors duration-300" />
                            </div>
                            <p className='text-lg font-bold uppercase text-[#13c2c2]  transition-colors duration-300'>Neurology</p>
                            <p className='text-lg font-bold uppercase text-[#13c2c2]  transition-colors duration-300'>Department</p>
                        </div>
                    </Card>
                    <Card
                        className="shadow-md transition-all duration-300 ease-in-out hover:bg-[#13c2c2] group hover:scale-105 hover:-translate-y-2"
                    >
                        <div className='flex flex-col items-center justify-center'>
                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                <GiBrain className="w-[64px] h-[64px] text-[#13c2c2]  transition-colors duration-300" />
                            </div>
                            <p className='text-lg font-bold uppercase text-[#13c2c2]  transition-colors duration-300'>Psychiatry</p>
                            <p className='text-lg font-bold uppercase text-[#13c2c2]  transition-colors duration-300'>Department</p>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    )
}

const AboutSection = () => {
    return (
        <section id='about' className='bg-white '>
            <div className='container mx-auto px-4'>
                <div className='flex items-center'>
                    <div className='w-1/2 p-10'>
                        <div className='image object-center text-center flex items-center justify-center'>
                            <img src={contactBg} alt="ContactBg " className='h-[480px]' />
                        </div>
                    </div>
                    <div className="sm:w-1/2 p-5">
                        <div className="text">
                            <span className="text-gray-500 border-b-2 border-[#13c2c2] uppercase">About us</span>
                            <h2 className="my-4 font-bold text-3xl sm:text-4xl ">About <span className="text-[#13c2c2]">Our Team</span>
                            </h2>
                            <p className="text-gray-400 text-xl mb-3 flex items-center">
                                <FaArrowRight className='mr-2' />ProHealth is a team of experienced medical professionals
                            </p>
                            <p className="text-gray-400 text-base">
                                Dedicated to providing top-quality healthcare services. We believe in a holistic approach to healthcare that focuses on treating the whole person, not just the illness or symptoms.
                            </p>
                            <div className='flex items-center gap-2 mt-5'>
                                <Link className='!text-base'>Learn more about us </Link>
                                <FaArrowRight className='text-xs text-blue-500' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const ContactSection = () => {
    return (
        <section id='appointment' className="bg-gray-100 py-20">
            <div className='container mx-auto px-4'>
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-4xl font-bold uppercase'>Get In Touch</h1>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-10'>
                    <div className='flex flex-row items-center justify-center gap-5 p-6'>
                        <div className="bg-[#13c2c2] rounded-full w-[64px] h-[64px] flex items-center justify-center">
                            <FiPhone className="text-white w-[32px] h-[32px]" />
                        </div>
                        <div>
                            <h2 className='text-base font-bold uppercase'>Hotline</h2>
                            <p className='text-gray-400 text-xl'>1900-0091</p>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-center gap-5 p-6'>
                        <div className="bg-[#13c2c2] rounded-full w-[64px] h-[64px] flex items-center justify-center">
                            <LuAmbulance className="text-white w-[32px] h-[32px]" />
                        </div>
                        <div>
                            <h2 className='text-base font-bold uppercase'>Ambulance</h2>
                            <p className='text-gray-400 text-xl'>876-256-876</p>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-center gap-5 p-6'>
                        <div className="bg-[#13c2c2] rounded-full w-[64px] h-[64px] flex items-center justify-center">
                            <IoLocationOutline className="text-white w-[32px] h-[32px]" />
                        </div>
                        <div>
                            <h2 className='text-base font-bold uppercase'>Location</h2>
                            <p className='text-gray-400 text-xl'>Hanoi, Vietnam</p>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-center gap-5 p-6'>
                        <Button
                            type="primary"
                            size="large"
                            icon={<FaArrowRight />}
                            iconPosition="end"
                            className="!bg-gradient-to-r from-[#0f9f9f] to-[#1aeaea] border-none text-white
                                !font-bold uppercase hover:opacity-60"
                        >
                            Contact us
                        </Button>
                    </div>
                </div>
            </div>

        </section>
    )
}

type Doctor = {
    name: string;
    image: string;
    department: string;
    description: string;
};

const doctors: Doctor[] = [
    {
        name: "Dr. Nguyen Van A",
        image: doctor1,
        department: "Cardiology",
        description: "Dr. Nguyen Van A is the top cardiologist in our hospital, specializing in heart diseases and interventions.",
    },
    {
        name: "Dr. Tran Van B",
        image: doctor2,
        department: "Neurology",
        description: "Dr. Tran Thi B is the leading neurologist, renowned for her expertise in treating complex neurological disorders.",
    },
    {
        name: "Dr. Le Thi C",
        image: doctor3,
        department: "Pediatrics",
        description: "Dr. Le Van C is the best pediatrician, dedicated to providing excellent care for children.",
    },
];


const DoctorSection = () => {
    return (
        <section id='doctors' className="bg-gray-100 py-20">
            <div className='container mx-auto px-4'>
                <div className='flex flex-col items-center justify-center pb-10'>
                    <h1 className='text-4xl font-bold uppercase mb-3'>Our Top Professionists</h1>
                    <p className='text-base text-gray-400'>Doctor with top skills and techniques in Northside Vietnam</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
                    {doctors.map((doctor, idx) => (
                        <div
                            key={idx}
                            className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[500px] transition-transform duration-300
                                ${idx === 1 ? 'md:-mt-8' : 'md:mt-8'}`}
                        >
                            <div className="h-2/3 w-full flex items-center justify-center bg-gray-100">
                                {/* Thay src bằng link ảnh thật */}
                                <img
                                    src={doctor.image || "https://via.placeholder.com/200x250?text=Doctor+Photo"}
                                    alt={doctor.name}
                                    className="object-contain h-full w-full bg-blue-100"
                                />
                            </div>
                            <div className="h-1/3 p-4 flex flex-col items-center justify-center">
                                <h3 className="text-xl font-bold mb-1">{doctor.name}</h3>
                                <p className="text-[#13c2c2] font-semibold mb-1">{doctor.department}</p>
                                <p className="text-gray-500 text-sm text-center">{doctor.description}</p>
                                <div>
                                    <div className="flex items-center text-white gap-3 mt-4">
                                        <a aria-label="Facebook" className="p-2 rounded-full bg-[#13c2c2] hover:bg-slate-800 transition-colors">
                                            <FaFacebook />
                                        </a>
                                        <a aria-label="Instagram" className="p-2 rounded-full bg-[#13c2c2] hover:bg-slate-800 hover:text-white transition-colors">
                                            <FaInstagram />
                                        </a>
                                        <a aria-label="Twitter" className="p-2 rounded-full bg-[#13c2c2] hover:bg-slate-800 hover:text-white transition-colors">
                                            <FaTwitter />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
};

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 ">
            <div className="container mx-auto px-4 py-10">
                {/* Trusted by brands */}
                <div className="flex flex-wrap items-center gap-3 justify-center mb-10">
                    <span className="uppercase tracking-wider text-xs text-slate-400">Trusted by</span>
                    {["MediX", "HealthOne", "BioCore", "CarePlus", "NovaLab"].map((b) => (
                        <span key={b} className="px-3 py-1 rounded-full border border-slate-700 text-sm">
                            {b}
                        </span>
                    ))}
                </div>

                {/* Main columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-white text-2xl font-bold">ProHealth</h3>
                        <p className="mt-3 text-sm">
                            Leading healthcare provider with modern facilities and a passionate team.
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            <a aria-label="Facebook" className="p-2 rounded-full bg-slate-800 hover:bg-[#13c2c2] hover:text-white transition-colors">
                                <FaFacebook />
                            </a>
                            <a aria-label="Instagram" className="p-2 rounded-full bg-slate-800 hover:bg-[#13c2c2] hover:text-white transition-colors">
                                <FaInstagram />
                            </a>
                            <a aria-label="Twitter" className="p-2 rounded-full bg-slate-800 hover:bg-[#13c2c2] hover:text-white transition-colors">
                                <FaTwitter />
                            </a>
                            <a aria-label="YouTube" className="p-2 rounded-full bg-slate-800 hover:bg-[#13c2c2] hover:text-white transition-colors">
                                <FaYoutube />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-3 uppercase text-sm">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
                            <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                            <li><a href="#doctor" className="hover:text-white transition-colors">Departments</a></li>
                            <li><a href="#doctors" className="hover:text-white transition-colors">Doctors</a></li>
                            <li><a href="#appointment" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Departments */}
                    <div>
                        <h4 className="text-white font-semibold mb-3 uppercase text-sm">Departments</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Cardiology</li>
                            <li>Neurology</li>
                            <li>Pediatrics</li>
                            <li>Genecology</li>
                            <li>Psychiatry</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-3 uppercase text-sm">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <FaLocationDot className="mt-1 text-[#13c2c2]" />
                                123 Wellness Ave, Hanoi, Vietnam
                            </li>
                            <li className="flex items-center gap-2">
                                <FaPhone className="text-[#13c2c2]" /> 1900-0091
                            </li>
                            <li className="flex items-center gap-2">
                                <FaEnvelope className="text-[#13c2c2]" /> support@prohealth.vn
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-slate-800">
                <div className="container mx-auto px-4 py-4 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-between">
                    <span>© {new Date().getFullYear()} ProHealth. All rights reserved.</span>
                    <span className="text-slate-400">Made with care and love</span>
                </div>
            </div>
        </footer>
    );
};


const Home = () => {
    return (
        <div>
            <HeroSection />
            <DepartmentSection />
            <AboutSection />
            <DoctorSection />
            <ContactSection />
            <Footer />
        </div>
    );
}

export default Home;