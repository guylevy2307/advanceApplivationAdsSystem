import React, {useEffect, useRef, useState} from 'react'
import {io} from "socket.io-client"
import './messenger.css'
import Topbar from "../../components/Topbar/Topbar";
import Conversation from "../../components/Conversations/Conversations";
import Message from "../../components/Message/Message";
import ChatOnline from "../../components/ChatOnline/ChatOnline";

import {Users} from "../../dummyData"
import {getSpecificConversation} from "../../services/ConversationService";
import {getUserFriends} from "../../services/UserService";
import {fetchConversationMessages, sendMessage} from "../../services/MessageService";
import {getCurrentUser} from "../../Utils/currentUser";

// --------------------------------------------------
// TODO: read current user id from local storage
// --------------------------------------------------


let currentMessagesBackup = null
let selectedFriendEmail = null
let friendListBackup = []

export default function Messenger() {
    const currentUserEmail = getCurrentUser().email;
    const [friendList, setFriendList] = useState([])
    const [currentConversationId, setCurrentConversationId] = useState(null)
    const [currentMessages, setCurrentMessages] = useState([])
    //const [arrivalMessage, setArrivalMessage] = useState(null)
    const socket = useRef()
    const scrollRef = useRef()
    const newMessageContent = useRef()

    const [onlineUserList,setOnlineUserList] = useState([])
    useEffect(()=>{
        const initializeFriendUserList = async () =>{
            let friendList = []
            try{
                friendList = await getUserFriends(currentUserEmail)
            }catch(err){
                console.log(err)
            }finally {
                setFriendList(friendList)
                friendListBackup = friendList
            }
        }
        initializeFriendUserList()
    },[currentUserEmail])

    const updateMessagesIfNecessary = (newMessage) => {
        console.log(newMessage)
        if(newMessage && newMessage?.sender === selectedFriendEmail){
            console.log(currentMessages)
            setCurrentMessages([...currentMessagesBackup, newMessage])
            console.log(currentMessages)
        }
    }

    //initialize socket
    useEffect(() => {
        socket.current = io("ws://localhost:8900")
        socket.current.on("getMessage", data => {
            const objData = JSON.parse(data)
            console.log(currentMessages)
            const newMsg = {
                sender: objData.senderEmail,
                text: objData.text,
                createdAt: Date.now(),
                _id: Date.now().toString()
            }
            updateMessagesIfNecessary(newMsg)
            //console.log(arrivalMessage)
        })
        socket.current.on("getUsers", data => {
            const onlineEmail = data.map(row => row.userEmail)
            const onlineFriends = friendListBackup.filter(u => onlineEmail.includes(u.email))
            console.log(onlineFriends)
            setOnlineUserList(onlineFriends)
        })
        socket.current.emit("addUser",currentUserEmail)
        socket.current.emit("getOnline", currentUserEmail)
    },[])
    // useEffect(()=>{
    //     arrivalMessage && arrivalMessage?.senderEmail === selectedFriendEmail &&
    //         setCurrentMessages([...currentMessages, arrivalMessage])
    // }, [arrivalMessage, currentConversationId])

    //fetch message list
    useEffect(()=>{
        const initalizeMessageList = async () => {
            const res = await fetchConversationMessages(currentConversationId)
            setCurrentMessages(res)
            currentMessagesBackup = res
        }
        initalizeMessageList()
    },[currentConversationId])

    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior:'smooth'})
    },[currentMessages])


    return (
        <>
            <Topbar/>
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="Search for friends" className="chatMenuInput"/>
                        { friendList.map(user=>{
                            return (
                                <div key={user._id} onClick={()=> {
                                    selectedFriendEmail = user.email
                                    const initializeConversation = async () => {
                                        const conversation = await getSpecificConversation(currentUserEmail, user.email)
                                        setCurrentConversationId(conversation._id)
                                        console.log(currentConversationId)
                                        console.log(selectedFriendEmail)
                                    }
                                    initializeConversation()
                                }}>
                                    <Conversation user={user}/>
                                </div>
                            )
                        }) }
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {
                            currentConversationId!=null ?
                                <>
                                    <div className="chatBoxTop">
                                        {currentMessages.map(message => {
                                            return (
                                                <div key={message._id} ref={scrollRef}>
                                                    <Message own={message.sender===currentUserEmail} userEmail={message.sender===currentUserEmail ? currentUserEmail : selectedFriendEmail} messageInfo={message}/>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <div className="chatBoxBottom">
                                        <textarea ref={newMessageContent} className="chatMessageInput" placeholder="write something ..."></textarea>
                                        {/*todo: check disable*/}
                                        <button
                                                className="chatSubmitButton"
                                                onClick={(e)=>{
                                                    console.log(currentConversationId)
                                                    console.log(selectedFriendEmail)
                                                        const text = newMessageContent.current.value
                                                        if(text && text!== ""){
                                                            const sendAndGetNewMessage = async ()=>{
                                                                const savedMessage = await sendMessage(currentUserEmail,currentConversationId,text)
                                                                setCurrentMessages([...currentMessages,savedMessage])
                                                            }
                                                            sendAndGetNewMessage()
                                                            console.log(socket.current.id)
                                                            socket.current.emit("sendMessage",JSON.stringify({
                                                                senderEmail: currentUserEmail,
                                                                receiverEmail: selectedFriendEmail,
                                                                text
                                                            }))
                                                        }else
                                                            console.log('message is empty')
                                                    }
                                                }
                                        >
                                            Send
                                        </button>
                                    </div>
                                </>
                                :
                                <span className="noConversationText">Open a conversation to start a chat.</span>
                        }
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        { onlineUserList.map(user=><ChatOnline key={user._id.toString()} user={user}/>) }
                    </div>
                </div>
            </div>
        </>
    )
}