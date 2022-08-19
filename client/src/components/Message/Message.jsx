import React, {useEffect, useState} from 'react'
import "./message.css"
import {getUserByEmail} from "../../services/UserService";

const toTimestamp = (strDate) => {
    const dt = new Date(strDate).getTime();
    return dt;
}
const relativeTime = (timestamp) => {
    const rtf = new Intl.RelativeTimeFormat('en', {
        numeric: 'auto',
    });
    const oneDayInMs = 1000 * 60 * 60 * 24;
    const oneHourInMs = 1000 * 60 * 60
    const oneMinuteInMs = 1000 * 60
    const oneSecondInMs = 1000

    const difference = timestamp - new Date().getTime()

    if(Math.abs(difference)>oneDayInMs){
        const daysDifference = Math.round(
            (difference) / oneDayInMs,
        );
        console.log(`oneDayInMs: ${oneDayInMs}`)
        return rtf.format(daysDifference, 'day');
    }
    if(Math.abs(difference)>oneHourInMs){
        const hoursDifference = Math.round(
            (difference) / oneHourInMs,
        );
        return rtf.format(hoursDifference, 'hour');
    }
    if(Math.abs(difference)>oneMinuteInMs){
        const miniuteDifference = Math.round(
            difference / oneMinuteInMs
        )
        return rtf.format(miniuteDifference, 'minute');
    }
    if(Math.abs(difference)>oneSecondInMs){
        const secondDifference = Math.round(
            difference / oneSecondInMs
        )
        return rtf.format(secondDifference, 'second');
    }
    return "just now"
}


export default  function Message({own, userEmail, messageInfo}){
    const [userInfo,setUserInfo] = useState({})
    const [timeStamp, setTimeStamp] = useState(null)
    //TODO: display text of time ago using https://bobbyhadz.com/blog/javascript-convert-timestamp-to-time-ago

    useEffect(()=>{
        const initializeUserInfo = async (userEmail) => {
            let result = {}
            try{
                result = await getUserByEmail(userEmail)
            }catch(err){
                console.log(err)
            }
            finally {
                setUserInfo(result)
            }
        }
        initializeUserInfo(userEmail)
    },[userEmail])
    useEffect(()=>{
        setInterval(()=>{
            console.log('calculating time ago...')
            setTimeStamp(relativeTime(toTimestamp(messageInfo.createdAt)))
        },20 * 1000)
    },[])
    return (
        <>
            <div className={own ? "message own" : "message"}>
                <div className="messageTop">
                    <img
                        className="messageImg"
                        src={userInfo.profilePicture ? userInfo.profilePicture : "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"}
                        alt=""
                    />
                    <p className="messageText">
                        {messageInfo.text}
                    </p>
                </div>
                <div className="messageBottom">{timeStamp ?? relativeTime(toTimestamp(messageInfo.createdAt))}</div>
            </div>
        </>
    )
}
