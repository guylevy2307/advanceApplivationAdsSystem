import "./feed.css";
import Share from "../../components/Share/Share";
import Post from "../../components/Post/Post";
import { useEffect, useState } from "react";
import axios from "axios";

const { API_URL } = require("../../services/Api");
const POST_SERVICE = API_URL + '/posts';

export default function Feed({ userEmail }) {
    const [posts, setPosts] = useState([]);
    const fetchPosts = async () => {
        const response = userEmail
            ? await axios.get(API_URL + `/users/${userEmail}/posts `)
            : await axios.get(POST_SERVICE);
        const { data } = response;
        setPosts(data);
    };
    useEffect(() => {
        fetchPosts();
    }, [userEmail]);

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