<template>
    <div class="result">
        <el-result icon="success" title="登录成功" sub-title="即将跳转页面..." v-show="status == true"></el-result>
        <el-result icon="error" title="请登录！" v-show="status == false"></el-result>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import router from '@/router';
import { getUserInfo } from "@/api/user";
import { ElMessage } from 'element-plus'
import { getLoginId } from "@/utils/JwtUtil";

// 是否登录成功状态
const status = ref(false)

// 获取用户信息
async function getUser() {
    // 获取全路径
    const route = useRoute()
    const path = route.fullPath

    // 如果不为/Result则代表是微信登录，并且本页面是由后端重定向的，url后面携带token
    if (path != '/Result') {
        localStorage.setItem("token", String(route.query.token));
        localStorage.setItem("permissions", JSON.stringify(route.query.permissions));
        status.value = true
    }

    status.value = true
    // 如果token存在，则查询用户信息
    if (localStorage.getItem("token")) {
        try {
            const id = getLoginId() // 解析token获取loginId
            const response = await getUserInfo(id);
            localStorage.setItem("userInfo", JSON.stringify(response.data));
        } catch {
            ElMessage({ message: 'token非法!', type: 'error', })
        }
    }

    // 在用户登录后，清除现有的板块大小分类缓存，以确保所展示的板块大小分类信息为最新数据。
    localStorage.removeItem("blockClassify")

    // 2s后跳转页面
    setTimeout(() => {
        router.push('/'); // 重定向到根路径  
    }, 1000);
}

onMounted(() => {
    getUser()
})
</script>

<style scoped>
.result {
    height: 100vh;
    display: flex;
    justify-content: center;
}
</style>