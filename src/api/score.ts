import request from "../utils/request";

// 帖子评分
export function score(data: {}) {
    return request({
        url: '/post/score',
        method: 'post',
        data
    })
}

// 获取当前用户对帖子的评分
export function getScore(postId: string) {
    return request({
        url: '/post/score/' + postId,
        method: 'get'
    })
}