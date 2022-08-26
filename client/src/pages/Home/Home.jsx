import React, {useState} from 'react'
import "./home.css"
import Topbar from "../../components/Topbar/Topbar";
import Feed from "../../components/Feed/Feed";
import Rightbar from "../../components/Rightbar/Rightbar";
import {getCurrentUser} from "../../Utils/currentUser";

export default function Home() {
  const [showUserInfo, setShowUserInfo] = useState(false);
  const toggleShowUserInfo = () => {
      setShowUserInfo(!showUserInfo);
  };
  return (
      <>
        <Topbar onUserTap={toggleShowUserInfo} />
        <div className="homeContainer">
            <Feed />
            {showUserInfo && <Rightbar profile={getCurrentUser()}/>}
        </div>
      </>
  )
}
