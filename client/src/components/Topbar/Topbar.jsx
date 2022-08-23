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

export default function Topbar(callback, deps) {
    const isUserNameExists = localStorage.getItem("username");
    const isUserPasswordExists = localStorage.getItem("password");
    const nav = useNavigate();
    const [inputText, setInputText] = useState("");
    const [users, setUsers] = useState([]);
    const [isFirstName, setIsFirstName] = useState(true);
    const [isLastName, setIsLastName] = useState(true);
    const [isEmail, setIsEmail] = useState(true);

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
            console.log('Yaniv')
            const response = await axios.get(SERVER_URL + `/users/`);
            const { data } = response;
            console.log({ data });
            if (isMounted) setUsers(data);
        };
        isMounted && fetchUsers();
    }, [isMounted]);

    console.log("Users " + users.length)

    const updatedUsers = useMemo(() => users || [], [users])

    return (
        <div className="topbarContainer">
            <div className="topbarleft">

                <Link to="/" style={{ textDecoration: "none" }}>
                    <img src={logoImage} alt="logo" />
                </Link>

            </div>
            <div className="topbarCenter">
                <div className="searchbar">
                    <TextField placeholder="Search for friends!"
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
