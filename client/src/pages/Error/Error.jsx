import React from 'react'
import "./Error.css"
import Topbar from "../../components/Topbar/Topbar";


export default function Error() {
    return (
        <>
            <Topbar />
            <div className="errorContainer">
                <h1 className="errorTitle">You cant access this rout</h1>
            </div>
        </>
    )
}
