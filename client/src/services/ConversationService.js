import {SERVER_URL} from "./HttpServiceHelper";
import axios from "axios";

const CONVERSATION_SERVICE = SERVER_URL + "/conversation"

export const getAllUserConversation = async (userId) => {
    const response = await axios.get(CONVERSATION_SERVICE + `/${userId}`,{})
    return response.data
}


export const createConversation = async (conversationInfo) => {
    await axios.post(CONVERSATION_SERVICE,conversationInfo)
    return conversationInfo
}

export const getSpecificConversation = async (userEmail1, userEmail2) => {
    let result = null
    await axios.get(CONVERSATION_SERVICE, {params: {userEmail1, userEmail2}}).then(response => result=response.data)
    return result;
}
