import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const UserLayout = () => {
    return (
        <div>
            <Navbar />
            <h1>User Layout</h1>
            <p>This is the user layout component.</p>
            <Outlet />
        </div>
    );
}

export default UserLayout;