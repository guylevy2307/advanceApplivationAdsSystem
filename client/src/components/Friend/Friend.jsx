import "./friend.css";
import { Link } from "react-router-dom";

export default function Friend({ user }) {
    return (
        <li className="sidebarFriend">
            <Link to={"/profile/" + user.email}
                style={{ textDecoration: "none" }}>
                <img className="sidebarFriendImg" src={user.profilePicture ? user.profilePicture : "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"} alt="" />
                <span className="sidebarFriendName">{user.firstName + " " + user.lastName}</span>
            </Link>
        </li>
    );
}