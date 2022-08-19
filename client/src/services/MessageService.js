import {SERVER_URL} from "./HttpServiceHelper";
import axios from "axios";

const MESSAGE_SERVICE = SERVER_URL + '/message'

export const fetchConversationMessages = async (conversationId) => {
    let result = []
    await axios.get(`${MESSAGE_SERVICE}/${conversationId}`).then(response=>result=response.data)
    return result
}


export const sendMessage = async (senderId,conversationId,text) => {
    console.log('sending message')
    const response = await axios.post(MESSAGE_SERVICE,{conversationId, sender: senderId, text})
    return response.data
}