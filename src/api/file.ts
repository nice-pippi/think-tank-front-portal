import request from "../utils/request";

// 上传帖子图片
export function uploadImg(data: {}) {
    return request({
        url: '/file/postImg',
        method: 'post',
        data
    })
}
