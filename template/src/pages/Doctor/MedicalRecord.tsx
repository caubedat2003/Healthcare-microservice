import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, message, Card, Input } from 'antd';
import Loading from '../../components/Loading';
import { FaSearch } from 'react-icons/fa';
import AddRecordModal from '../../components/AddRecordModal';
import { RiStickyNoteAddLine } from 'react-icons/ri';

type MedicalRecord = {
    id: number;
    patient_id: number;
    doctor_id: number;
    appointment_id?: number;
    subject: string;
    content?: string;
    diagnosis?: string;
    symtoms?: string;
    treatment?: string;
    prescription?: any;
    created_at?: string;
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

const MedicalRecord = () => {
    const { patientId } = useParams<{ patientId: string }>();
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [patient, setPatient] = useState<Patient>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const searchTimeoutRef = useRef<number | null>(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

    useEffect(() => {
        if (patientId) {
            fetchPatient(patientId);
            fetchRecords(patientId);
        }
    }, [patientId]);

    const fetchRecords = async (pid: string) => {
        setLoading(true);
        try {
            const url = `${BASE_URL}/api/medical-records/patient/${pid}/`;
            const resp = await axios.get(url);
            const data = Array.isArray(resp.data) ? resp.data : resp.data.results || [];
            // sort newest first
            data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setRecords(data);
        } catch (err) {
            message.error('Failed to load medical records');
        } finally {
            setLoading(false);
        }
    };

    const fetchPatient = async (pid: string) => {
        setLoading(true);
        try {
            const url = `${BASE_URL}/api/patient/${pid}/`;
            const resp = await axios.get(url);
            setPatient(resp.data);
        } catch (err) {
            message.error('Failed to load patient data');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setSearchQuery(v);
        if (searchTimeoutRef.current) {
            window.clearTimeout(searchTimeoutRef.current);
        }
        // debounce user typing
        searchTimeoutRef.current = window.setTimeout(() => {
            fetchPatient(v);
        }, 400);
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        if (searchTimeoutRef.current) {
            window.clearTimeout(searchTimeoutRef.current);
        }
        fetchPatient(value);
    };

    const openCreateModal = () => setIsCreateModalVisible(true);
    const closeCreateModal = () => setIsCreateModalVisible(false);

    if (loading) {
        return Loading();
    }

    const columns = [
        { title: 'Subject', dataIndex: 'subject', key: 'subject' },
        { title: 'Doctor ID', dataIndex: 'doctor_id', key: 'doctor_id', width: 120 },
        { title: 'Diagnosis', dataIndex: 'diagnosis', key: 'diagnosis' },
        { title: 'Created At', dataIndex: 'created_at', key: 'created_at', render: (v: string) => v ? new Date(v).toLocaleString() : '-', sorter: (a: MedicalRecord, b: MedicalRecord) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime() },
        {
            title: 'Actions', key: 'actions', width: 140, render: () => (
                <div className='flex gap-2'>
                    <Button onClick={() => navigate(-1)}>Back</Button>
                </div>
            )
        }
    ];

    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4'>Medical Records for Patient {patient?.full_name}</h1>
            <Card className='p-4'>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <p className="text-gray-600 text-base mb-2">
                            <strong className='text-base mr-2'>Full Name:</strong>
                            {patient?.full_name || 'N/A'}
                        </p>
                        <p className="text-gray-600 text-base mb-2">
                            <strong className='text-base mr-2'>Date of birth:</strong>
                            {patient?.date_of_birth ?
                                new Date(patient?.date_of_birth).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-gray-600 text-base mb-2">
                            <strong className='text-base mr-2'>Address:</strong>
                            {patient?.address || 'N/A'}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-600 text-base mb-2">
                            <strong className='text-base mr-2'>Phone number: </strong>
                            {patient?.phone_number || 'N/A'}
                        </p>
                        <p className="text-gray-600 text-base mb-2">
                            <strong className='text-base mr-2 '>Blood type:</strong>
                            {patient?.blood_type || 'N/A'}
                        </p>
                        <p className="text-gray-600 text-base mb-2">
                            <strong className='text-base mr-2'>Medical history:</strong>
                            {patient?.medical_history || 'N/A'}
                        </p>
                    </div>
                </div>
            </Card>
            <div className="mt-4 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className=''>
                    <Button color="cyan" variant="solid" icon={<RiStickyNoteAddLine />} onClick={openCreateModal}>
                        Create record
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
            <AddRecordModal
                visible={isCreateModalVisible}
                onClose={closeCreateModal}
                patient={patient}
                onCreated={() => {
                    closeCreateModal();
                    if (patient?.id) fetchRecords(String(patient.id));
                }}
            />
            <Table columns={columns} dataSource={records} rowKey='id' loading={loading} />
        </div>
    );
}

export default MedicalRecord;