import React, {useEffect, useMemo, useRef, useState} from "react";
import {Button, Form, Input, PageHeader, notification, Avatar, Image, List, Comment} from "antd";
import 'antd/dist/antd.css';
import {getCurrentUser} from "../../Utils/currentUser";
import {PermMedia} from "@material-ui/icons";
import {SERVER_URL} from "../../services/HttpServiceHelper";
import axios from "axios";
import {Link} from "react-router-dom";
import {format} from "timeago.js";
import TextArea from "antd/es/input/TextArea";
import {useParams} from "react-router";
import useMounted from "../../hooks/useMounted";

const blobToBase64 = require('blob-to-base64')

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Add Comment
            </Button>
        </Form.Item>
    </>
);

const openNotification = (content) => {
    notification.open({
        message: content,
    });
};

const PostDetails = (props) => {
    const postID = useParams().postID;
    const [comments, setComments] = useState([]);
    // const [user, setUser] = useState({})
    // const [post, setPost] = useState({})
    const [submitting, setSubmitting] = useState(false);
    const [value, setValue] = useState('');
    const isMounted = useMounted();
    const user = props.profile;
    const post = props.post;
    const handleSubmit = async () => {
        if (!value) return;
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setValue('');
            setComments([
                ...comments,
                {
                    postID: post._id,
                    content: value,
                },
            ]);
        }, 1000);
        const response = await axios.get(SERVER_URL + `/comments/post/${post._id}`);
        if(response.status === 200) {
            openNotification('Added comment successfully!');
            setComments(response.data)
        }
        else openNotification('Failed adding comment to post');
    };

    const handleChange = (e) => {
        setValue(e.target.value);
    };
    useEffect(() => {
        const fetchComments = async () => {
            const response = await axios.get(SERVER_URL + `/comments/post/${postID}`);
            const { data } = response;
            if(isMounted)
                setComments(data);
        };
        isMounted && fetchComments();
    }, [postID, isMounted])
    const newComments = useMemo(() => comments || [], [comments]);
    const updatedPost = useMemo(() => post || {}, [post]);
    const newUser = useMemo(() => user || [], [user]);
    return (
         <div style={{flex: 5.5}}>
                <PageHeader
                    className="site-page-header"
                    onBack={() => null}
                    title="Post details"
                />
                 <div className="postTopLeft">
                     <Link to={`/profile/${updatedPost && updatedPost.userEmail}`}>
                         <img
                             className="postProfileImg"
                             src={(newUser && newUser.profilePicture) || "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"}
                            alt=""
                         />
                     </Link>
                     <span className="postUsername">
                                {newUser && newUser.firstName}
                            </span>
                     <span className="postDate">{format(updatedPost && updatedPost.creationDate)}</span>
                 </div>
                 <Image
                     width={200}
                     src={updatedPost && updatedPost.image}
                 />

                {newComments && newComments.length > 0 && <List
                     itemLayout="horizontal"
                     dataSource={newComments}
                     renderItem={(item) => (
                         <List.Item>
                             <List.Item.Meta
                                 description={item.content}
                             />
                         </List.Item>
                     )}
                 />}

             <Comment
                 avatar={<Avatar src={(newUser && newUser.profilePicture) || "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"}/>}
                 content={
                     <Editor
                         onChange={handleChange}
                         onSubmit={handleSubmit}
                         submitting={submitting}
                         value={value}
                     />
                 }
             />
         </div>
    )
}

export default React.memo(PostDetails)