import React from 'react'
import './adminSidebar.css'


/*
* data list should contain objects with the following template:
* {
    title: string,
    icon: mui-icon component,
    action: onClick event function
* }
* */


export default function AdminSidebar({data}){
    return(
            <>
                <div className="adminSidebar">
                    <ul className="sidebarList">
                        {data.map((val,key) => {
                            return (
                                <li className="row" key={key} onClick={val.action}>
                                    <div id="icon">{val.icon}</div>
                                    <div id="title">{val.title}</div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </>
    )
}