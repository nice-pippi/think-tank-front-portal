import request from "../utils/request";

// 注册
export function register(data: {}) {
    return request({
        url: '/auth/register',
        method: 'post',
        data
    })
}

// 登录
export function passwordLogin(data: {}) {
    return request({
        url: '/auth/login/passwordLogin',
        method: 'post',
        data
    })
}

// 注销
export function logout() {
    return request({
        url: '/auth/login/logout',
        method: 'get'
    })
}