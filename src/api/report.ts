import request from "../utils/request";

// 举报帖子/评论
export function report(data: {}) {
    return request({
        url: '/post/report',
        method: 'post',
        data
    })
}
