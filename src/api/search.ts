import request from "../utils/request";

// 搜索板块
export function searchBlock(data: any) {
    return request({
        url: '/search/searchBlock',
        method: 'post',
        data
    })
}

// 搜索帖子
export function searchPost(data: any) {
    return request({
        url: '/search/searchPost',
        method: 'post',
        data
    })
}
