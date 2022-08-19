import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../Online/Online";
import CloseFriend from "../CloseFriend/CloseFriend";
import {getUserFriends} from "../../services/UserService";
import {useContext, useState, useEffect, useMemo} from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {getCurrentUser} from "../../Utils/currentUser"
import axios from "axios";
import {SERVER_URL} from "../../services/HttpServiceHelper";
import {useParams} from "react-router";
import React from "react";
import {Avatar} from "antd";
import useMounted from "../../hooks/useMounted";


const USER_SERVICE = SERVER_URL + "/users"


const Rightbar = (props) => {
    const [friendList, setFriendList] = useState([]);
    const isMounted = useMounted();
    let email = props.profile.email;
    console.log(props.profile.email)
    useEffect(() => {
        const initalizeFriendList = async () => {
            console.log("Props profile: " + props.profile.email)
            const res = await getUserFriends(props.profile.email)
            if(isMounted)
                setFriendList(res)
        }
        props.profile && isMounted && initalizeFriendList()
    }, [props.profile, isMounted]);

    function AntDesignOutlined() {
        return null;
    }
    const profile = useMemo(() => props.profile || {}, [props.profile]);
    const friends = useMemo(() => friendList || [], [friendList]);

    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                <>
                    <h4 className="rightbarTitle">User information</h4>
                    {profile && <div className="rightbarInfo">
                        <div className="rightbarInfoItem">
                            <Avatar
                                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                                icon={<AntDesignOutlined />}
                                src={profile.profilePicture ? profile.profilePicture : "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"}
                            />
                        </div>
                        <div className="rightbarInfoItem">
                            <span className="rightbarInfoKey">Full Name:</span>
                            <span className="rightbarInfoValue">{profile.firstName + " " + profile.lastName}</span>
                        </div>
                        <div className="rightbarInfoItem">
                            <span className="rightbarInfoKey">Address:</span>
                            <span className="rightbarInfoValue">{profile.address}</span>
                        </div>
                        <div className="rightbarInfoItem">
                            <span className="rightbarInfoKey">Email:</span>
                            <span className="rightbarInfoValue">{profile.email}</span>
                        </div>
                    </div>}
                    {/*<h4 className="rightbarTitle">User friends</h4>*/}
                    {/*<div className="rightbarFollowings">*/}
                    {/*    {friendList.map((friend)=> {*/}
                    {/*        console.log(friend.email)*/}
                    {/*        return (*/}
                    {/*            <Link to={"/profile/" + friend.email}*/}
                    {/*                  style={{textDecoration: "none"}}>*/}
                    {/*                <div className="rightbarFollowing">*/}
                    {/*                    <img*/}
                    {/*                        src={friend.profilePicture ? friend.profilePicture : "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"}*/}
                    {/*                        alt=""*/}
                    {/*                        className="rightbarFollowingImg"*/}
                    {/*                    />*/}
                    {/*                    <span className="rightbarFollowingName">{friend.firstName + " " + friend.lastName}</span>*/}
                    {/*                </div>*/}
                    {/*            </Link>*/}
                    {/*        )})}*/}
                    {/*</div>*/}

                    <hr className="rightbarHr" />
                    <h4 className="rightbarTitle">User Friends ({friends.length})</h4>
                    <ul className="rightbarFriendList">
                        {friends.map((u) => (
                            <CloseFriend key={u._id} user={u} />
                        ))}
                    </ul>
                </>
            </div>
        </div>
    );
}

export default React.memo(Rightbar);