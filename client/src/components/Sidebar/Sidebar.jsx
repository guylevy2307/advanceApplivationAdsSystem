import {
    Chat, RssFeed
} from "@mui/icons-material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { notification } from "antd";
import { getCurrentUser } from "../../Utils/currentUser";
import "./sidebar.css";
import Online from "../Online/Online";


const SidebarData = [
    {
        title: "Ads",
        icon: <RssFeed />,
        link: "/",
        forAdmin: false
    },

    {
        title: "Data",
        icon: <AdminPanelSettingsIcon />,
        link: "/admin",
        forAdmin: false
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
                    {SidebarData.map((val, key) => {
                        return (
                            <>
                                <li className="sidebarListItem"
                                    key={val.title + key}
                                    onClick={() => {
                                        if (val.forAdmin && user.isAdmin) {
                                            window.location.pathname = val.link
                                        }
                                        if (val.forAdmin && !user.isAdmin) {
                                            openNotification('You cant go there');
                                        }
                                        if (!val.forAdmin) {
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
        </div >
    )
}