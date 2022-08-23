import React from 'react'
import "./home.css"
import Topbar from "../../components/Topbar/Topbar";
import Feed from "../../components/Feed/Feed";
import Rightbar from "../../components/Rightbar/Rightbar";
import {getCurrentUser} from "../../Utils/currentUser";

export default function Home() {
  return (
      <>
        <Topbar />
        <div className="homeContainer">

            <Feed />
            <Rightbar profile={getCurrentUser()}/>
        </div>
      </>
  )
}
