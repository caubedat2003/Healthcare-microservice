import React, { useEffect, useState } from "react";
import { Card, Flex, Typography } from "antd";
import CountUp from "react-countup";
import axios from "axios";
import { message } from "antd";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from "chart.js";
import moment from "moment";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const { Text } = Typography;

type AppointmentCardProps = {
    title: string;
    value: number | string;
    height?: number;
};

const AppointmentCard = ({ title, value, height, ...props }: AppointmentCardProps) => {
    return (
        <Card {...props} variant="outlined" style={{ height: height || 150 }}>
            <Flex vertical gap="large" style={{ height: height ? height - 60 : "auto" }}>
                <Text>{title}</Text>
                <Typography.Title level={2} style={{ margin: 0 }}>
                    {typeof value === "number" ? (
                        <CountUp
                            end={value}
                            separator=","
                            decimals={0}
                        />
                    ) : (
                        <span>{value}</span>
                    )}
                </Typography.Title>
            </Flex>
        </Card>
    );
};

interface Appointment {
    id: number;
    patient_id: number;
    doctor_id: number;
    appointment_date: string;
    appointment_time: string;
    status: "pending" | "confirmed" | "completed" | "canceled";
    reason: string;
    created_at: string;
}

const DashboardAdmin = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/appointment/`);
                const normalized = (response.data || []).map((appt: any) => ({
                    ...appt,
                    patient_id: Number(appt.patient_id),
                    doctor_id: Number(appt.doctor_id),
                }));
                setAppointments(normalized);
            } catch (error) {
                message.error("Failed to fetch appointments. Please try again later.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    // Calculate total appointments
    const totalAppointments = appointments.length;

    // Calculate total unique patients
    const uniquePatients = new Set(appointments.map(appt => appt.patient_id)).size;

    // Last 7 days in UTC, oldest -> newest
    const todayUtc = moment.utc().startOf("day");
    const last7Days = Array.from({ length: 7 }, (_, i) =>
        todayUtc.clone().subtract(i, "days").format("YYYY-MM-DD")
    ).reverse();

    // Count appointments per day
    const dailyCounts = last7Days.map((date) =>
        appointments.filter(
            (appt) => moment.utc(appt.appointment_date).format("YYYY-MM-DD") === date
        ).length
    );

    const barChartData = {
        labels: last7Days.map((date) => moment.utc(date).format("DD/MM")),
        datasets: [
            {
                label: "Number of Appointments on each day",
                data: dailyCounts,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    };

    const barChartOptions: any = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const },
            title: { display: true, text: "Total appointments in the nearest 7 days" },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: "Số cuộc hẹn" },
                ticks: {
                    stepSize: 1, // Ensure integer steps for appointment counts
                },
            },
        },
    };

    // Appointment status counts
    const statusLabels = ["Pending", "Confirmed", "Completed", "Cancelled"];
    const statusValues = ["pending", "confirmed", "completed", "cancelled"];
    const statusCounts = statusValues.map(
        (status) => appointments.filter((appt) => appt.status === status).length
    );

    const pieChartData = {
        labels: statusLabels,
        datasets: [
            {
                data: statusCounts,
                backgroundColor: [
                    "rgba(255, 206, 86, 0.6)",  // Yellow for Pending
                    "rgba(54, 162, 235, 0.6)",  // Blue for Confirmed
                    "rgba(75, 192, 192, 0.6)",  // Teal for Completed
                    "rgba(255, 99, 132, 0.6)",  // Red for Canceled
                ],
                borderColor: [
                    "rgba(255, 206, 86, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 99, 132, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        plugins: {
            legend: { position: "bottom" as const },
            title: { display: true, text: "Appointment status" },
        },
    };

    return (
        <div className="p-6">
            <h1 className="font-bold text-2xl mb-4">Appointment Statistics</h1>
            <div className="grid grid-cols-2 gap-8 mb-8">
                <AppointmentCard title="Total appointments" value={totalAppointments} />
                <AppointmentCard title="Total number of patients who made appointments" value={uniquePatients} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                <Card title="Total appointments on each days" variant="outlined" className="h-full">
                    <Bar data={barChartData} options={barChartOptions} />
                </Card>
                <Card title="Appointment status" variant="outlined" className="h-full">
                    <div className="h-[300px]">
                        <Pie data={pieChartData} options={pieChartOptions} />
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default DashboardAdmin;