import 'antd/dist/antd.min.css'
import React from 'react';
import Topbar from "../../components/Topbar/Topbar";
import UpdateUser from "../../components/UpdateUser/UpdateUser";

const EditUser = () => {
    return (
        <>
            <Topbar />
            <div className="homeContainer">
                <UpdateUser />
            </div>
        </>
    );
};
export default EditUser;