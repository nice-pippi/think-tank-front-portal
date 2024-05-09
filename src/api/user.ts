import request from "../utils/request";

// 查询用户信息
export function getUserInfo(id: string) {
    return request({
        url: '/user/' + id,
        method: 'get',
    })
}

// 更改用户信息
export function updateUser(data: {}) {
    return request({
        url: '/user/',
        method: 'put',
        data
    })
}

// 更改密码
export function updatePassword(data: {}) {
    return request({
        url: '/user/updatePassword',
        method: 'put',
        data
    })
}