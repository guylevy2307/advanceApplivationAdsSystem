import { Person } from "@mui/icons-material";
import { Button, FormControlLabel, TextField } from "@mui/material";
import { Checkbox } from "antd";
import 'antd/dist/antd.min.css'
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import useMounted from '../../useMounted';
import logoImage from '../../public/adsystem.png';
import { SERVER_URL } from "../../services/HttpServiceHelper";
import { getCurrentUser } from "../../Utils/currentUser";
import SearchList from "./SearchList";
import "./topbar.css";
import { notification } from "antd";
import {
    Chat, RssFeed
} from "@mui/icons-material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function Topbar(callback, deps) {
    const isUserNameExists = localStorage.getItem("username");
    const isUserPasswordExists = localStorage.getItem("password");
    const nav = useNavigate();
    const [inputText, setInputText] = useState("");
    const [users, setUsers] = useState([]);
    const [isFirstName, setIsFirstName] = useState(true);
    const [isLastName, setIsLastName] = useState(true);
    const [isEmail, setIsEmail] = useState(true);
    const user = getCurrentUser();

    const isMounted = useMounted();

    const inputHandler = useCallback((e) => {
        //convert input text to lower case
        let lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    }, []);

    const onClickLogOut = (isUserNameExists, isUserPasswordExists) => {
        localStorage.clear();
        nav('/login');

        return
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await axios.get(SERVER_URL + `/users/`);
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

    const [option, setOption] = useState()

    function handleChange(event) {
        setOption(event.target.value)
        var choose = event.target.value;
        if (choose == 1) {
            isFirstName = false;
            isLastName = false;
            isEmail = true;
        } else if (choose == 2) {
            isFirstName = true;
            isLastName = false;
            isEmail = false;
        } else if (choose == 3) {
            isFirstName = false;
            isLastName = false;
            isEmail = true;
        } else if (choose == 4) {
            isFirstName = true;
            isLastName = true;
            isEmail = false;
        } else if (choose == 5) {
            isFirstName = true;
            isLastName = true;
            isEmail = true;
        }
        console.log(isFirstName + " " + isLastName + " " + isEmail)
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
                    <Link to={`/updateUser/${getCurrentUser().email}`} style={{ textDecoration: "none" }}>
                        <Person />
                    </Link>
                </div>
                <div className="topbarImage">
                    <Button variant="outlined" onClick={(e) => {
                        onClickLogOut(isUserNameExists, isUserPasswordExists)
                    }} >
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    )
}
