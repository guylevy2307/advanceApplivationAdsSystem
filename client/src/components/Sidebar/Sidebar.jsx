import "./sidebar.css"
import HomeIcon from '@mui/icons-material/Home';
import {Users} from "../../dummyData"
import {
    RssFeed,
    Chat,
    PlayCircleFilledOutlined,
    Group,
    Bookmark,
    HelpOutline,
    WorkOutline,
    Event
} from "@material-ui/icons";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CloseFriend from "../CloseFriend/CloseFriend";
import Online from "../Online/Online";
import {getCurrentUser} from "../../Utils/currentUser";
import {notification} from "antd";


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
                                    key={key}
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
                {/*<button className="sidebarButton">Show More</button>*/}
                <hr className="sidebarHr" />
                {/*<ul className="sidebarFriendList">*/}
                {/*    <h4 className="sidebarTitle">Online Friends</h4>*/}
                {/*    {Users.map((u) => (*/}
                {/*        <Online key={u.id} user={u} />*/}
                {/*    ))}*/}
                {/*</ul>*/}
            </div>
        </div>
    )
}