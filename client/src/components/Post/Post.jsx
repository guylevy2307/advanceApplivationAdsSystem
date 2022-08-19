import "./post.css";
import { MoreVert } from "@material-ui/icons";
//import { Users } from "../../dummyData";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import { format } from "timeago.js";
import PersonIcon from '@mui/icons-material/Person';

const {SERVER_URL} = require("../../services/HttpServiceHelper");
//const USER_SERVICE = SERVER_URL + `/users/${post.userId}`;


export default function Post({ post }) {

    const navigate = useNavigate()
    const [user, setUser] = useState([]);
    const fetchUser = async () => {
        const response = await axios.get(SERVER_URL + `/users/${post.userEmail}`);
        const { data } = response;
        //console.log(data);
        setUser(data);
    };
    useEffect( () => {
        fetchUser();
    }, [post.userEmail]);
    //console.log(user)
    console.log(post.images)

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
                        <span className="postDate">{format(post.creationDate)}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post.content}</span>
                        <img className="postImg" src={post.image} alt="" />
                    {/*<span className="postContent">{post.content}</span>*/}
                </div>
                <div className="postBottom">
                    {/*<div className="postBottomRight">*/}
                    {/*    <span className="postCommentText">{post.comment} comments</span>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
}