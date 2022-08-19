import { Button, Checkbox, Form, Input } from 'antd';
import React from 'react';
import 'antd/dist/antd.css';
import Topbar from "../../components/Topbar/Topbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Feed from "../../components/Feed/Feed";
import Rightbar from "../../components/Rightbar/Rightbar";
import UpdateUser from "../../components/UpdateUser/UpdateUser"

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
// todo add profile picture

export default EditUser;