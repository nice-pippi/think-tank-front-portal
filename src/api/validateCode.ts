import request from "../utils/request";

// 发送验证码
export function sendValidate(data: {}) {
    return request({
        url: '/validatecode/generate',
        method: 'post',
        data
    })
}