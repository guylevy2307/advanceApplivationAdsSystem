import "./share.css";
import {
    PermMedia,
    Label,
    Room,
    EmojiEmotions,
    Cancel,
} from "@material-ui/icons";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import getUserByEmail from "../../services/UserService";
import {getCurrentUser} from "../../Utils/currentUser";

const {SERVER_URL} = require("../../services/HttpServiceHelper");
const POST_SERVICE = SERVER_URL + '/posts';

const blobToBase64 = require('blob-to-base64')


export default function Share() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
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
            //newPost.img = fileName;
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
                    } catch (err) {}
                }
            })

            // try {
            //     await axios.post("/:", data);
            // } catch (err) {}
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
                        placeholder={"What's in your mind " + getCurrentUser().firstName + "?"}
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
                        {/*<div className="shareOption">*/}
                        {/*    <Label htmlColor="blue" className="shareIcon" />*/}
                        {/*    <span className="shareOptionText">Tag</span>*/}
                        {/*</div>*/}
                        {/*<div className="shareOption">*/}
                        {/*    <Room htmlColor="green" className="shareIcon" />*/}
                        {/*    <span className="shareOptionText">Location</span>*/}
                        {/*</div>*/}
                        {/*<div className="shareOption">*/}
                        {/*    <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />*/}
                        {/*    <span className="shareOptionText">Feelings</span>*/}
                        {/*</div>*/}
                    </div>
                    <button className="shareButton" type="submit">
                        Share
                    </button>
                </form>
            </div>
        </div>
    );
}