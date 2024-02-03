import jwt_decode from 'jwt-decode';
import { ElMessage } from 'element-plus'

export function getLoginId() {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const jwt: any = jwt_decode(String(token))
            return String(jwt.loginId)
        } catch {
            ElMessage.error('token非法!')
            ElMessage({ message: 'token非法!', type: 'error' })
            return ''
        }
    } else {
        return ''
    }
}

export function getPermissions() {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const jwt: any = jwt_decode(String(token))
            return jwt.permissions
        } catch {
            ElMessage({ message: 'token非法!', type: 'error', })
        }
    } else {
        ElMessage({ message: 'token不存在!', type: 'error', })
    }
}