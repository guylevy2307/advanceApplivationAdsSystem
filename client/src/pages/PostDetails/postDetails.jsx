import { Image, List } from 'antd';
import React, {useEffect, useMemo, useState} from 'react';
import 'antd/dist/antd.css';
import Topbar from "../../components/Topbar/Topbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Rightbar from "../../components/Rightbar/Rightbar";
import PostDetails from "../../components/PostDetails/PostDetails"
import {useParams} from "react-router";
import {SERVER_URL} from "../../services/HttpServiceHelper";
import axios from "axios";
import useMounted from "../../hooks/useMounted";

const PostItem = () => {
    let postID = useParams().postID;
    const [post, setPost] = useState({})
    const [user, setUser] = useState({});
    const isMounted = useMounted();

    try {
        useEffect(() => {
            const fetchPost = async () => {
                const response = await axios.get(SERVER_URL + `/posts/${postID}`)
                const {data} = response;
                if (isMounted)
                    setPost(data);
            };
            isMounted && fetchPost();
        }, [postID, isMounted]);
    }
    catch(e){
        if(!post)
            console.log("Error " + e + " in useEffect")
    }
    try {
        useEffect(() => {
            const fetchUser = async () => {
                const response = await axios.get(SERVER_URL + `/users/${post.userEmail}`)
                const {data} = response;
                if (isMounted)
                    setUser(data);
            };
            isMounted && post.userEmail && fetchUser();
        }, [post, isMounted]);
    }
    catch(e)
    {
        if(!user)
            console.log("Error " + e + " in useEffect")
    }
    const updatedPost = useMemo(() => post || {}, [post]);
    const newUser = useMemo(() => user || {}, [user]);
    return (
        <>
            <Topbar />
            <div className="homeContainer">
                <Sidebar />
                {<PostDetails profile={newUser} post={updatedPost}/>}
                {newUser && newUser.email && <Rightbar profile={newUser}/>}
            </div>
        </>
    );


};
// todo add profile picture

export default React.memo(PostItem);