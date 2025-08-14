

import { Outlet, useNavigate } from "react-router-dom";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Avatar } from "antd";
import {
    MdDashboard,
    MdPeople,
    MdBook,
    MdShoppingCart,
    MdCategory,
    MdLogout,
} from "react-icons/md";
import { useState } from "react";
import { FaListCheck, FaUserDoctor } from "react-icons/fa6";
import { FaUserInjured } from "react-icons/fa";

const { Header, Sider, Content } = Layout;


const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const menuItems = [
        {
            key: "dashboard",
            icon: <MdDashboard size={20} />,
            label: "Dashboard",
            onClick: () => navigate("/admin/"),
        },
        {
            key: "users",
            icon: <MdPeople size={20} />,
            label: "User",
            onClick: () => navigate("/admin/users"),
        },
        {
            key: "books",
            icon: <FaUserDoctor size={20} />,
            label: "Doctor",
            onClick: () => navigate("/admin/doctors"),
        },
        {
            key: "orders",
            icon: <FaUserInjured size={20} />,
            label: "Patient",
            onClick: () => navigate("/admin/patients"),
        },
        {
            key: "categories",
            icon: <FaListCheck size={20} />,
            label: "Appointment",
            onClick: () => navigate("/admin/appointments"),
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
                            {!collapsed ? "Admin Panel" : "Admin"}
                        </div>

                        <div className="!flex-1 !overflow-auto">
                            <Menu className="!bg-slate-800 !text-base flex flex-col items-center justify-center gap-4" theme="dark" mode="inline" items={menuItems} />
                        </div>
                    </div>

                    <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                        <a href="#" className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
                            <img
                                alt=""
                                src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                                className="size-10 rounded-full object-cover"
                            />

                            <div>
                                <p className="text-xs">
                                    <strong className="block font-medium">Eric Frusciante</strong>

                                    <span> eric@frusciante.com </span>
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            </Sider>
            <Layout>
                <Header
                    className="px-4 flex items-center !bg-slate-800 text-white"

                >
                    <Button
                        type="text"
                        icon={
                            collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        className="!w-[48px] !h-[48px] !text-base !text-white"
                    />
                </Header>

                <Content className="p-4 bg-[#f5f5f5] flex-grow overflow-y-auto">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminLayout;