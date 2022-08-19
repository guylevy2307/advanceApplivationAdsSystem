import React from 'react'
import "./home.css"
import Topbar from "../../components/Topbar/Topbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Feed from "../../components/Feed/Feed";
import Rightbar from "../../components/Rightbar/Rightbar";
import {getCurrentUser} from "../../Utils/currentUser";

export default function Home() {
  return (
      <>
        <Topbar />
        <div className="homeContainer">
            <Sidebar />
            <Feed />
            <Rightbar profile={getCurrentUser()}/>
        </div>
      </>
  )
}
