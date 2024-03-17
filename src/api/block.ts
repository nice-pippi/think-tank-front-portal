import request from "../utils/request";

// 获取所有板块分类
export function getBlockClassify() {
    return request({
        url: '/block/getBlockClassify',
        method: 'get'
    })
}

// 申请创建板块
export function applicationBlock(data: {}) {
    return request({
        url: '/block/applicationBlock',
        method: 'post',
        data
    })
}

// 获取板块信息
export function getBlockInfo(id: string) {
    return request({
        url: '/block/' + id,
        method: 'get'
    })
}

// 更改板块信息
export function updateInfo(data: {}) {
    return request({
        url: '/block/',
        method: 'post',
        data
    })
}

// 申请板主
export function applicationMaster(data: {}) {
    return request({
        url: '/block/master/applicationMaster',
        method: 'post',
        data
    })
}

// 获取当前板块所有板主
export function getAllBlockMasterById(id: string) {
    return request({
        url: '/block/master/' + id,
        method: 'get'
    })
}

// 获取当前账号所有已关注板块
export function getAllFollow(id: string) {
    return request({
        url: '/block/follow/getAllFollow/' + id,
        method: 'get'
    })
}

// 关注板块
export function follow(id: string) {
    return request({
        url: '/block/follow/' + id,
        method: 'post'
    })
}

// 取关板块
export function unFollow(id: string) {
    return request({
        url: '/block/follow/' + id,
        method: 'delete'
    })
}

// 根据板块小分类ID查询所有板块
export function getAllBlockBySmallTypeId(id: string) {
    return request({
        url: '/block/getAllBlockBySmallTypeId/' + id,
        method: 'get'
    })
}

// 获取10个热门板块
export function getHotBlock() {
    return request({
        url: '/block/getHotBlock',
        method: 'get'
    })
}

// 验证当前登录是否指定板块的板主
export function isMaster(id: string) {
    return request({
        url: '/block/master/isMaster/' + id,
        method: 'get'
    })
}