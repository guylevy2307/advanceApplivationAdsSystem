import {
    Chat, RssFeed
} from "@mui/icons-material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { notification } from "antd";
import { getCurrentUser } from "../../Utils/currentUser";
import "./sidebar.css";


const SidebarData = [
    {
        title: "Feed",
        icon: <RssFeed />,
        link: "/",
        forAdmin: false
    },
    {
        title: "Chat",
        icon: <Chat />,
        link: "/messenger",
        forAdmin: false
    },
    {
        title: "Admin",
        icon: <AdminPanelSettingsIcon />,
        link: "/admin",
        forAdmin: true
    }
]



export default function Sidebar() {
    const user = getCurrentUser();
    const openNotification = (content) => {
        notification.open({
            message: content,
        });
    };

    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <ul className="sidebarList">
                    {SidebarData.map((val,key)=>{
                        return (
                            <>
                                <li className="sidebarListItem"
                                    key={val.title}
                                    onClick={() => {
                                        if(val.forAdmin && user.isAdmin) {
                                            window.location.pathname = val.link
                                        }
                                        if(val.forAdmin && !user.isAdmin) {
                                            openNotification('You cant go there');
                                        }
                                        if(!val.forAdmin) {
                                            window.location.pathname = val.link;
                                        }
                                    }}>
                                    <div className="sidebarIcon">{val.icon}</div>
                                    <div className="sidebarListItemTitle">{val.title}</div>
                                </li>
                            </>
                        )
                    })}
                </ul>
                <hr className="sidebarHr" />
            </div>
        </div>
    )
}