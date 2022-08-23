import { RssFeed } from "@mui/icons-material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { notification } from "antd";
import { getCurrentUser } from "../../Utils/currentUser";
import "./sidebar.css";

const SidebarData = [
    {
        title: "Ads",
        icon: <RssFeed />,
        link: "/",
        forAdmin: false
    },

    {
        title: "Admin Page",
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
                <ul className="sidebarList" >
                    {SidebarData.map((val, key) => {
                        return (
                            <>
                                <li className="sidebarListItem"
                                    key={val.title + " " + "1"}
                                    onClick={() => {
                                        if (val.forAdmin && user.isAdmin) {
                                            window.location.pathname = val.link
                                        }
                                        if (val.forAdmin && !user.isAdmin) {
                                            openNotification('This is only for admin');
                                        }
                                        if (!val.forAdmin) {
                                            window.location.pathname = val.link;
                                        }
                                    }}>
                                    <div className="sidebarIcon" key={val.title + " " + "2"}>{val.icon}</div>
                                    <div className="sidebarListItemTitle" key={val.title + " " + "3"}>{val.title}</div>
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