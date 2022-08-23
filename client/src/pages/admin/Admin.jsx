import React, { useState } from 'react'
import './admin.css'
import AdminSidebar from "../../components/AdminSiderbar/AdminSidebar";
import Topbar from "../../components/Topbar/Topbar";
import UserTable from "../../components/UserTable/UserTable";
import PostTable from "../../components/PostTable/PostTable";
import { getCurrentUser } from "../../Utils/currentUser";
import Analytic from "../../components/Analytic/Analytic";
import Error from "../../pages/Error/Error";

//icons
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import QueryStatsIcon from '@mui/icons-material/QueryStats';




export default function Admin() {
    const [selectedView, setSelectedView] = useState(<div />)
    const user = getCurrentUser();

    const menuOption = [
        {
            title: 'Users',
            icon: <PeopleAltIcon />,
            action: e => setSelectedView(<UserTable />)
        },
        {
            title: 'Posts',
            icon: <StickyNote2Icon />,
            action: e => setSelectedView(<PostTable />)
        },
        {
            title: 'Analytics Info',
            icon: <QueryStatsIcon />,
            action: e => setSelectedView(<Analytic />)
        }
    ]
    if (user.isAdmin) {
        return (


            < div className="admin" >

                <Topbar />
                <div className="adminContainer">
                    <div className="menu">
                        <AdminSidebar data={menuOption} />
                    </div>
                    <div className="content">
                        {selectedView}
                    </div>
                </div>
            </div >
        )

    } else {
        return (
            <Error />
        )
    }

}