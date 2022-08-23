import { MoreVert } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from 'moment'
import "./post.css";

const { SERVER_URL } = require("../../services/HttpServiceHelper");


export default function Post({ post }) {

    const navigate = useNavigate()
    const [user, setUser] = useState([]);
    const fetchUser = async () => {
        const response = await axios.get(SERVER_URL + `/users/${post.userEmail}`);
        const { data } = response;
        setUser(data);
    };
    useEffect(() => {
        fetchUser();
    }, [post.userEmail]);


    return (
        <div className="post" onClick={(e) => navigate(`/${post._id}/postDetails`)}>
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${post.userEmail}`}>
                            <img
                                className="postProfileImg"
                                src={user.profilePicture ? user.profilePicture : "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"}
                                alt=""
                            />
                        </Link>
                        <span className="postUsername">
                            {user.firstName}
                        </span>
                        <span className="postDate">{moment.unix(post.creationDate).toLocaleString()}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post.content}</span>
                    <img className="postImg" src={post.image} alt="" />
                </div>
            </div>
        </div>
    );
}