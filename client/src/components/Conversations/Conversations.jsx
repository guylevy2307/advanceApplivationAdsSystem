import React, {useEffect, useState} from 'react'
import './conversations.css'

export default function Conversation({user}){
    return(
        <>
            <div className="conversation">
                <img className="conversationImg"
                 src={user.profilePicture ? user.profilePicture : "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"}
                 alt=""/>

                <span className="conversationName">{`${user.firstName} ${user.lastName}`}</span>
            </div>
        </>
    )
}