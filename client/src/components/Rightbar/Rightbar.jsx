import { Avatar } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import useMounted from "../../useMounted";
import { getUserFriends } from "../../services/UserService";
import Friend from "../Friend/Friend";
import "./rightbar.css";

const Rightbar = (props) => {
    const [friendList, setFriendList] = useState([]);
    const isMounted = useMounted();
    useEffect(() => {
        const initalizeFriendList = async () => {

            const res = await getUserFriends(props.profile.email)
            if (isMounted)
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

                    <hr className="rightbarHr" />
                    <h4 className="rightbarTitle">User Connections: ({friends.length})</h4>
                    <ul className="rightbarFriendList">
                        {friends.map((u) => (
                            <Friend key={u._id} user={u} />
                        ))}
                    </ul>
                </>
            </div>
        </div>
    );
}

export default React.memo(Rightbar);