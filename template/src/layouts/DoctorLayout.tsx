

import { Link, Outlet, useNavigate } from "react-router-dom";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Avatar } from "antd";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { GoTasklist } from "react-icons/go";
import { GrDocumentText } from "react-icons/gr";
import { FaUserNurse } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import NavbarDark from "../components/NavbarDark";

const { Header, Sider, Content } = Layout;


const DoctorLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const menuItems = [
        {
            key: "appointments",
            icon: <GoTasklist size={20} />,
            label: "Appointments",
            onClick: () => navigate("/doctor/appointments"),
        },
        {
            key: "patient-list",
            icon: <GrDocumentText size={20} />,
            label: "Patient List",
            onClick: () => navigate("/doctor/patient-list"),
        },
        {
            key: "profile",
            icon: <FaUserNurse size={20} />,
            label: "Profile",
            onClick: () => navigate("/doctor/profile"),
        },
    ];

    return (
        <Layout className="h-screen">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={300}
                className="!flex !flex-col !h-full"
            >
                <div className="flex h-screen flex-col justify-between border-e border-gray-100 bg-slate-800 text-white">
                    <div className="px-4 py-6">
                        <div className="text-white text-xl font-bold text-center pb-4 align-middle justify-center flex items-center">
                            <Link to="/" className="!text-white">{!collapsed ? "Doctor Panel" : "Doctor"}</Link>
                        </div>

                        <div className="!flex-1 !overflow-auto">
                            <Menu className="!bg-slate-800 !text-base flex flex-col items-center justify-center gap-4" theme="dark" mode="inline" items={menuItems} />
                        </div>
                    </div>

                    <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                        <div>
                            <div className="p-4 flex items-center gap-3">
                                <Avatar size={40} className="!bg-[var(--color-primary)] !text-white !uppercase !font-bold">
                                    {user?.full_name?.charAt(0).toUpperCase() || "A"}
                                </Avatar>
                                {!collapsed && (
                                    <div className="flex flex-col text-white text-sm gap-1">
                                        <span className="font-semibold">{user?.full_name}</span>
                                        <span className="text-gray-400 text-xs">{user?.email}</span>
                                    </div>
                                )}
                            </div>

                            {!collapsed && (
                                <div className="flex items-center justify-center pb-4">
                                    <Button
                                        type="link"
                                        icon={<MdLogout />}
                                        className="!bg-white !text-black hover:!bg-black hover:!text-white !border-none"
                                        onClick={() => {
                                            logout();
                                            navigate("/");
                                        }}
                                    >
                                        Đăng xuất
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Sider>
            <Layout>
                <Header
                    className="px-4 flex items-center !bg-slate-800 text-white"
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: "16px",
                            width: 64,
                            height: 64,
                            color: 'white'
                        }}
                    />
                </Header>

                <Content className="p-4 bg-[#f5f5f5] flex-grow overflow-y-auto">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default DoctorLayout;