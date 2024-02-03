import request from "../utils/request";

// 发布帖子
export function publishPost(data: {}) {
    return request({
        url: '/post/postAction',
        method: 'post',
        data
    })
}

// 首页获取最新帖子
export function getIndexPosts() {
    return request({
        url: '/post/postAction/getIndexPosts',
        method: 'get'
    })
}


// 分页查询当前板块帖子
export function getPostsByCurrentBlockId(data: any) {
    return request({
        url: '/post/postAction/page',
        method: 'post',
        data
    })
}

// 根据帖子id获取帖子名称以及tag标签
export function getTitleAndTagById(postId: string) {
    return request({
        url: '/post/postAction/getTitleAndTag/' + postId,
        method: 'get'
    })
}

// 根据用户id获取已发布的帖子
export function getPageByPublishedPosts(userId: string, currentPage: number) {
    return request({
        url: '/post/postAction/getPageByPublishedPosts/' + userId + "/" + currentPage,
        method: 'get'
    })
}

// 根据帖子id删除帖子
export function deleteById(postId: string) {
    return request({
        url: '/post/postAction/' + postId,
        method: 'delete'
    })
}

// 收藏帖子
export function addFavorite(postId: string) {
    return request({
        url: '/post/postAction/addFavorite/' + postId,
        method: 'post'
    })
}

// 取消收藏帖子
export function removeFavorite(postId: string) {
    return request({
        url: '/post/postAction/removeFavorite/' + postId,
        method: 'post'
    })
}

// 验证当前登录用户是否收藏了当前帖子
export function isFavorite(postId: string) {
    return request({
        url: '/post/postAction/isFavorite/' + postId,
        method: 'get'
    })
}

// 分页查询当前用户收藏的帖子
export function getFavoritePage(userId: string, currentPage: number) {
    return request({
        url: '/post/postAction/getFavoritePage/' + userId + '/' + currentPage,
        method: 'get'
    })
}

// 获取热门帖子top5
export function getHotPostByTop5() {
    return request({
        url: '/post/postAction/getHotPostByTop5',
        method: 'get'
    })
}

// 获取热门帖子top5
export function getHotPostByTop30() {
    return request({
        url: '/post/postAction/getHotPostByTop30',
        method: 'get'
    })
}

// 新增点击帖子记录
export function addPostClickRecord(data: {}) {
    return request({
        url: '/post/postAction/addPostClickRecord',
        method: 'post',
        data
    })
}

// 验证当前登录用户是否拥有删除帖子权限
export function hasDeletePermission(postId: string) {
    return request({
        url: '/post/postAction/hasDeletePermission/' + postId,
        method: 'get'
    })
}




