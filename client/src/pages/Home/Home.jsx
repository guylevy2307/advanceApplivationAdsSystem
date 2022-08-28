import React, { useState } from 'react'
import "./home.css"
import Topbar from "../../components/Topbar/Topbar";
import Feed from "../../components/Feed/Feed";
import Rightbar from "../../components/Rightbar/Rightbar";
import { getCurrentUser } from "../../Utils/currentUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../../components/Popup/Popup";


export default function Home() {
  const navigate = useNavigate();

  const [showUserInfo, setShowUserInfo] = useState(false);
  const toggleShowUserInfo = () => {
    setShowUserInfo(!showUserInfo);

  };
  const user = getCurrentUser();
  useEffect(() => {
    if (user.email === null || !user) {
      return (
        navigate("/register")
      )
    }

  }, [user])

  return (
    <>
      <Topbar onUserTap={toggleShowUserInfo} />
      <div className="homeContainer">
        <Feed />

      </div>
    </>
  )
}

