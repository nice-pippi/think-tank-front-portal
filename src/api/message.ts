import request from "../utils/request";

// 查询所有聊天室
export function getAllChatRoom() {
    return request({
        url: '/message/chatRoom/getAllChatRoom',
        method: 'get'
    })
}

// 查询所有聊天室
export function addChatRoom(data: any) {
    return request({
        url: '/message/chatRoom',
        method: 'post',
        data
    })
}

// 查询私聊消息
export function getPrivateMessage(chatRoomId: string) {
    return request({
        url: '/message/privateMessage/' + chatRoomId,
        method: 'get'
    })
}

// 发送消息给Ai小助手
export function sendMessageToAi(data: any) {
    return request({
        url: '/message/ai/',
        method: 'post',
        data,
        timeout: 0
    })
}