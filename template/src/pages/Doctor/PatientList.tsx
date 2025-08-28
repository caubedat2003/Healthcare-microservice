import { Button, Input, message, Table } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";

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

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const searchTimeoutRef = useRef<number | null>(null);
    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8080";
    const navigate = useNavigate();

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
                    <Button type="link" color="cyan"
                        variant="solid" shape="round"
                        icon={<FaEye />}
                        onClick={() => navigate(`/doctor/medical-records/${record.id}`)}>
                        View Medical Records
                    </Button>
                </span>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Patient List</h1>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
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
        </div>
    )
}

export default PatientList;