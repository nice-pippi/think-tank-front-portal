import axios from 'axios'

declare module "axios" {
  interface AxiosResponse<T = any> {
    errorinfo: null;
    // 这里追加你的参数
    map: any
  }
  export function create(config?: AxiosRequestConfig): AxiosInstance;
}

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000 // 超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加请求头等前置处理
    config.headers['satoken'] = localStorage.getItem('token')
    return config
  },
  error => {
    // 请求错误处理
    console.log('Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 响应后处理
    if (response.status === 200 && response.data.status === 200) {
      return Promise.resolve(response.data)
    } else {
      return Promise.reject(response.data.msg)
    }
  },
  error => {
    console.log('Response Error:', error)
    return Promise.reject(error)
  }
)

export default service
