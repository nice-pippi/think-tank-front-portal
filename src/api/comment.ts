import request from "../utils/request";

// 分页查询当前帖子评论
export function getCommentByPage(postId: string, currentPage: number) {
    return request({
        url: '/post/comment/page/' + postId + '/' + currentPage,
        method: 'get'
    })
}


// 对帖子发表评论
export function publishComment(data: {}) {
    return request({
        url: '/post/comment/replyPost',
        method: 'post',
        data
    })
}

// 评论区回复
export function replyComment(data: {}) {
    return request({
        url: '/post/comment/replyComment',
        method: 'post',
        data
    })
}

// 评论点赞
export function addLikeComment(data: {}) {
    return request({
        url: '/post/comment/addLikeComment',
        method: 'post',
        data
    })
}

// 取消评论点赞
export function removeLikeComment(data: {}) {
    return request({
        url: '/post/comment/removeLikeComment',
        method: 'post',
        data
    })
}


export function getReceivedCommentsPage(currentPage: number) {
    return request({
        url: '/post/comment/receivedCommentsPage/' + currentPage,
        method: 'get'
    })
}