import "./profile.css";
import Topbar from "../../components/Topbar/Topbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Feed from "../../components/Feed/Feed";
import Rightbar from "../../components/Rightbar/Rightbar";
import {createContext, useEffect, useMemo, useState} from "react";
import axios from "axios";
import {SERVER_URL} from "../../services/HttpServiceHelper";
import { useParams } from "react-router";
import {getUserByEmail} from "../../services/UserService";
import {getCurrentUser} from "../../Utils/currentUser";
import useMounted from "../../hooks/useMounted";
import {Button} from "@material-ui/core";
import {notification} from "antd";


const USER_SERVICE = SERVER_URL + "/users"

export default function Profile() {
    const [user, setUser] = useState({});
    const isMounted  = useMounted();
    const userEmail = useParams().userEmail;
    console.log(userEmail);


    useEffect( () => {
        const fetchUser = async () => {
            //const response = await getUserByEmail(userEmail);
            const response = await axios.get( USER_SERVICE + `/${userEmail}`)
            const { data } = response;
            console.log(data)
            if (isMounted) setUser(data);
        };
        isMounted && fetchUser()
    },[userEmail, isMounted]);

    //console.log(post.images)
    const newUser = useMemo(() => user || {}, [user]);
    console.log(newUser.email)

    const openNotification = (content) => {
        notification.open({
            message: content,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post( USER_SERVICE + `/${getCurrentUser().email}/addFriend`,{friendEmail: newUser.email})
        if(response.status === 200) {
            console.log("User after friend: " + response.data)
            if(response.data.email === getCurrentUser().email)
                localStorage.setItem("user", JSON.stringify(response.data));
            openNotification("Added User to your friends list successfully")
        }
    }

    return (
        <>
            <Topbar />
            <div className="profile">
                <Sidebar />
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                            <img
                                className="profileCoverImg"
                                src="https://images.pexels.com/photos/1535907/pexels-photo-1535907.jpeg?cs=srgb&dl=pexels-karyme-fran%C3%A7a-1535907.jpg&fm=jpg"
                                alt=""
                            />
                            <img
                                className="profileUserImg"
                                src={newUser.profilePicture ? newUser.profilePicture : "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"}
                                alt=""
                            />
                        </div>
                        <div className="profileInfo">
                            <h4 className="profileInfoName">{newUser.userEmail}</h4>
                            {getCurrentUser().email !== newUser.email && <Button onClick={handleSubmit}>Add Friend</Button>}
                        </div>
                    </div>
                    <div className="profileRightBottom">
                        {newUser.email === getCurrentUser().email &&
                            <Feed userEmail={userEmail}/>}
                        {newUser && newUser.email && <Rightbar profile={newUser} />}
                    </div>
                </div>
            </div>
        </>
    );
}