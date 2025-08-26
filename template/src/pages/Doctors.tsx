import { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Card } from 'antd';
import { FaFacebook, FaInstagram, FaTwitter, FaUser } from 'react-icons/fa';
import { RiAlarmWarningFill } from 'react-icons/ri';
import { LuBaby } from 'react-icons/lu';
import { LiaDnaSolid } from 'react-icons/lia';
import { GiHeartOrgan, GiBrain } from 'react-icons/gi';
import { FaSyringe } from 'react-icons/fa';
import NavbarDark from '../components/NavbarDark';

const SPECIALIZATIONS: { key: string; label: string; Icon: any }[] = [
    { key: 'Emergency', label: 'Emergency', Icon: RiAlarmWarningFill },
    { key: 'Pediatric', label: 'Pediatric', Icon: LuBaby },
    { key: 'Gynecology', label: 'Gynecology', Icon: LiaDnaSolid },
    { key: 'Cardiology', label: 'Cardiology', Icon: GiHeartOrgan },
    { key: 'Neurology', label: 'Neurology', Icon: FaSyringe },
    { key: 'Psychiatry', label: 'Psychiatry', Icon: GiBrain },
];

const Doctors = () => {
    const [doctorsBySpec, setDoctorsBySpec] = useState<Record<string, any[]>>({});
    const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const promises = SPECIALIZATIONS.map(spec =>
                    axios.get(`${BASE_URL}/api/doctor/specialization/${encodeURIComponent(spec.key)}`)
                        .then(r => ({ key: spec.key, data: Array.isArray(r.data) ? r.data : [r.data] }))
                        .catch(() => ({ key: spec.key, data: [] }))
                );
                const results = await Promise.all(promises);
                const map: Record<string, any[]> = {};
                results.forEach(r => { map[r.key] = r.data || []; });
                setDoctorsBySpec(map);
            }
            catch (error) {
                message.error('Error fetching doctors: ' + String(error));
            }
        };
        fetchAll();
    }, []);

    return (
        <div>
            <NavbarDark />

            <div className='container mx-auto mt-20 p-4'>
                <h1 className="text-3xl font-bold mb-4">Doctors</h1>
                <p className="text-gray-500 mb-8">Our specialists by department</p>

                {SPECIALIZATIONS.map(spec => {
                    const doctors = doctorsBySpec[spec.key] || [];
                    return (
                        <section key={spec.key} id={spec.label} className="mb-8">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-2xl font-semibold">{spec.label}</h2>
                            </div>

                            <div className="flex gap-4 overflow-x-auto py-2">
                                {/* First card: specialization card */}
                                <div className="w-[320px] flex-shrink-0">
                                    <Card className="shadow-md transition-all duration-300 ease-in-out hover:bg-[var(--color-primary)] group hover:scale-105 hover:-translate-y-2">
                                        <div className='h-[450px] flex flex-col items-center justify-center'>
                                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                                <spec.Icon className="w-[64px] h-[64px] text-[#13c2c2]  transition-colors duration-300" />
                                            </div>
                                            <p className='text-lg font-bold uppercase text-[#13c2c2]  transition-colors duration-300'>{spec.label}</p>
                                            <p className='text-lg font-bold uppercase text-[#13c2c2]  transition-colors duration-300'>Department</p>
                                        </div>
                                    </Card>
                                </div>

                                {/* Doctor cards for this specialization */}
                                {doctors.length === 0 && (
                                    <div className="flex items-center text-gray-500">No doctors found in this specialization.</div>
                                )}

                                {doctors.map((doc: any) => (
                                    <div key={doc.id} className="w-[300px] flex-shrink-0">
                                        <div className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[500px] transition-transform duration-300`}>
                                            <div className="h-2/3 w-full flex items-center justify-center bg-cyan-100">
                                                <div className='bg-white p-10 rounded-full'>
                                                    <FaUser size={200} className='text-[var(--color-primary)] ' />
                                                </div>
                                            </div>
                                            <div className="h-1/3 p-4 flex flex-col items-center justify-center">
                                                <h3 className="text-xl font-bold mb-1">{doc.full_name}</h3>
                                                <p className="text-[#13c2c2] font-semibold mb-1">{doc.specialization}</p>
                                                <p className="text-gray-500 text-sm text-center">{doc.phone_number}</p>
                                                <div>
                                                    <div className="flex items-center text-white gap-3 mt-4">
                                                        <a aria-label="Facebook" className="p-2 rounded-full bg-[var(--color-primary)] hover:bg-slate-800 transition-colors cursor-pointer">
                                                            <FaFacebook />
                                                        </a>
                                                        <a aria-label="Instagram" className="p-2 rounded-full bg-[var(--color-primary)] hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">
                                                            <FaInstagram />
                                                        </a>
                                                        <a aria-label="Twitter" className="p-2 rounded-full bg-[var(--color-primary)] hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">
                                                            <FaTwitter />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </section>
                    );
                })}

            </div>

        </div>
    );
}

export default Doctors;