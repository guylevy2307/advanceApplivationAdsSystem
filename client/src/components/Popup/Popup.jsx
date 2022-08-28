import "./Popup.css";
import React from "react";
import { getCurrentUser } from "../../Utils/currentUser";
import UserInfo from "../../components/Rightbar/Rightbar";
export default function Popup(props) {

    return (props.trigger) ? (
        < div className="popup" >
            <div className="popup-inner">
                <button className="close-btn" onClick={() => props.setTrigger(false)}>
                    X
                </button>
                <UserInfo profile={getCurrentUser()} />
            </div>

        </div >
    ) : "";
}