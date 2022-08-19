import "./feed.css";
import Share from "../../components/Share/Share";
import Post from "../../components/Post/Post";
import {useEffect, useState} from "react";
import axios from "axios";

const {SERVER_URL} = require("../../services/HttpServiceHelper");
const POST_SERVICE = SERVER_URL + '/posts';

export default function Feed({userEmail}) {
    const [posts, setPosts] = useState([]);
    const fetchPosts = async () => {
        const response = userEmail
        ? await axios.get(SERVER_URL + `/users/${userEmail}/posts `)
        : await axios.get(POST_SERVICE);
        const { data } = response;
        setPosts(data);
    };
    useEffect( () => {
        fetchPosts();
    }, [userEmail]);
    console.log(posts)
    return (
        <div className="feed">
            <div className="feedContainer">
                <Share />
                {posts && posts.map((p) => (
                    <Post key={p._id} post={p} />
                ))}
            </div>
        </div>
    );
}