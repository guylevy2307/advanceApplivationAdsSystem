import {
    Cancel, PermMedia
} from "@mui/icons-material";
import axios from "axios";
import { useRef, useState } from "react";
import { getCurrentUser } from "../../Utils/currentUser";
import "./share.css";

const { SERVER_URL } = require("../../services/HttpServiceHelper");
const POST_SERVICE = SERVER_URL + '/posts';

const blobToBase64 = require('blob-to-base64')


export default function Share() {
    const content = useRef();
    const [file, setFile] = useState(null);
    const user = getCurrentUser();
    const submitHandler = async (e) => {
        e.preventDefault();
        const newPost = {
            userEmail: user.email,
            content: content.current.value,
        };
        if (file) {
            const data = new FormData();
            const fileName = Date.now() + file.name;
            data.append("name", fileName);
            data.append("file", file);
            blobToBase64.default(file, async function (error, base64) {
                if (!error) {
                    try {
                        newPost.image = base64
                        console.log(newPost);
                        let user = getCurrentUser();
                        let posts = user.allPostIDs || [];
                        const post = await axios.post(POST_SERVICE, newPost);
                        posts.push(post._id || post.id);
                        user.allPostIDs = posts;
                        localStorage.setItem("user", JSON.stringify(user));
                        window.location.reload();
                    } catch (err) { }
                }
            })
                }
    };

    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img
                        className="shareProfileImg"
                        src={user.profilePicture ? user.profilePicture : "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"}
                        alt=""
                    />
                    <input
                        placeholder={"What kind of ad whould you like to post " + getCurrentUser().firstName + "?"}
                        className="shareInput"
                        ref={content}
                    />
                </div>
                <hr className="shareHr" />
                {file && (
                    <div className="shareImgContainer">
                        <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
                        <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
                    </div>
                )}
                <form className="shareBottom" onSubmit={submitHandler}>
                    <div className="shareOptions">
                        <label htmlFor="file" className="shareOption">
                            <PermMedia htmlColor="tomato" className="shareIcon" />
                            <span className="shareOptionText">Photo or Video</span>
                            <input
                                style={{ display: "none" }}
                                type="file"
                                id="file"
                                accept=".png,.jpeg,.jpg"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </label>
                    </div>
                    <button className="shareButton" type="submit">
                        Share
                    </button>
                </form>
            </div>
        </div>
    );
}