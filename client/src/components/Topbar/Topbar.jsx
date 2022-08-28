import { Person, RssFeed } from "@mui/icons-material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Button, TextField } from "@mui/material";
import { notification } from "antd";
import 'antd/dist/antd.min.css';
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../../public/adsystem-removebg.png';
import { API_URL } from "../../services/Api";
import useMounted from '../../useMounted';
import { getCurrentUser } from "../../Utils/currentUser";
import SearchList from "./SearchList";
import "./topbar.css";
import { io } from "socket.io-client";
import Popup from "../../components/Popup/Popup";

export default function Topbar(props) {

    //console.log('props', props)
    const isUserNameExists = localStorage.getItem("username");
    const isUserPasswordExists = localStorage.getItem("password");
    const nav = useNavigate();
    const [inputText, setInputText] = useState("");
    const [users, setUsers] = useState([]);
    var [isFirstName, setIsFirstName] = useState(false);
    var [isLastName, setIsLastName] = useState(false);
    var [isEmail, setIsEmail] = useState(true);
    const user = getCurrentUser();

    const isMounted = useMounted();
    var [socket, setSocket] = useState(null);

    useEffect(() => {
        socket = io("http://localhost:5000");
        if (user.email !== null) {
            socket.emit("newUser", user.email);
        }
    }, [socket])
    const inputHandler = useCallback((e) => {
        //convert input text to lower case
        let lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    }, []);

    const onClickLogOut = (isUserNameExists, isUserPasswordExists) => {
        if (isUserNameExists)
            socket.emit("logout", user.email);
        localStorage.clear();
        nav('/login');
        return
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await axios.get(API_URL + `/users/`);
            const { data } = response;
            if (isMounted) setUsers(data);
        };
        isMounted && fetchUsers();
    }, [isMounted]);

    const updatedUsers = useMemo(() => users || [], [users])
    const centerBarData = [
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
            forAdmin: true
        }
    ]
    const openNotification = (content) => {
        notification.open({
            message: content,
        });
    };
    const [userInfoPopup, setBtnState] = useState(false);



    function handleChange(event) {

        var choose = event.target.value;
        if (choose == 1) {
            setIsFirstName(false)
            setIsLastName(false)
            setIsEmail(true)
        } else if (choose == 2) {
            setIsFirstName(true)
            setIsLastName(false)
            setIsEmail(false)

        } else if (choose == 3) {
            setIsFirstName(false)
            setIsLastName(true)
            setIsEmail(false)

        } else if (choose == 4) {
            setIsFirstName(true)
            setIsLastName(true)
            setIsEmail(false)

        } else if (choose == 5) {
            setIsFirstName(true)
            setIsLastName(true)
            setIsEmail(true)

        }

    }

    return (
        <div className="topbarContainer">
            <div className="topbarleft">

                <Link to="/" style={{ textDecoration: "none" }}>
                    <img src={logoImage} alt="logo" />
                </Link>

            </div>
            <div className="topbarCenter">
                <div className="searchbar">
                    <TextField placeholder="Search for new friends..."
                        size="small"
                        label="Search"
                        variant="outlined"
                        id="outlined-basic"
                        className="searchInput"
                        onChange={inputHandler}
                    />

                    {updatedUsers.length > 0 && inputText && inputText.length > 0 && <SearchList input={inputText} userList={updatedUsers} isFirstName={isFirstName}
                        isLastName={isLastName} isEmail={isEmail} />}
                </div>


                <select className="listSearch" onChange={handleChange} >
                    <option value="1">Search By:</option>
                    <option value="1">Email</option>
                    <option value="2">First Name</option>
                    <option value="3">Last Name</option>
                    <option value="4">Full Name</option>
                    <option value="5">All</option>
                </select>
                <div className="topbarCenter">
                    {centerBarData.map((val, key) => {
                        return (
                            <>
                                <div className="dataListItem"
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
                                    <div className="dataIcon">{val.icon}</div>
                                    <div className="dataItemTitle">{val.title}</div>
                                </div>
                            </>
                        )
                    })}
                </div>
            </div>
            <div className="topbarRight">
                <div className="topbarImage">
                    <Button className="topbarImage" variant="outlined" setTrigger={setBtnState} trigger={userInfoPopup} onClick={() => {
                        setBtnState(true)
                    }}  >
                        <Person />
                    </Button>
                    <Popup trigger={userInfoPopup} setTrigger={setBtnState} />
                    <Button variant="outlined" onClick={(e) => {
                        onClickLogOut(isUserNameExists, isUserPasswordExists)
                    }} >
                        Logout
                    </Button>
                </div>
            </div>
        </div >
    )
}
