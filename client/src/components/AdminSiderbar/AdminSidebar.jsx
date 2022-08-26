import React from 'react'
import './adminSidebar.css'



export default function AdminSidebar({ data }) {
    return (
        <>
            <div className="adminSidebar">
                <ul className="sidebarList">
                    {data.map((val, key) => {
                        return (
                            <li className="row" key={val.title} onClick={val.action}>
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