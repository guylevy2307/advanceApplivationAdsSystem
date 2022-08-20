import 'antd/dist/antd.css';
import React from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import UpdateUser from "../../components/UpdateUser/UpdateUser";

const EditUser = () => {
    return (
        <>
            <Topbar />
            <div className="homeContainer">
                <Sidebar />
                <UpdateUser />
            </div>
        </>
    );
};
export default EditUser;