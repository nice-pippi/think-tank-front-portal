<template>
    <!-- 顶部菜单栏 -->
    <el-menu default-active="1" class="el-menu-demo" mode="horizontal" :ellipsis="false" @select="handleSelect" router>
        <!-- 根据条件显示返回按钮 -->
        <el-menu-item v-if="backShow">
            <el-page-header @click="$router.back()" />
        </el-menu-item>

        <!-- 使用 flex-grow 占据剩余空间 -->
        <div class="flex-grow" />

        <!-- 菜单项 -->

        <el-menu-item index="/Index">首页</el-menu-item>
        <el-menu-item @click="login" v-if="!loginResult">登录</el-menu-item>
        <el-menu-item index="/Message" v-if="loginResult">消息</el-menu-item>

        <!-- 下拉子菜单项 -->
        <el-sub-menu index="4" v-if="loginResult">
            <template #title>
                <el-avatar :size="30" :src="avatar" />
            </template>
            <el-menu-item @click="toPersonCenter">个人中心</el-menu-item>
            <el-menu-item @click="quit">退出</el-menu-item>
        </el-sub-menu>
    </el-menu>

    <!-- 登录注册dialog -->
    <el-dialog v-model="dialogStatus" title="登录" width="25%" :before-close="handleClose" style=" text-align: center;">
        <LoginComponent></LoginComponent>
    </el-dialog>
</template>
  
<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import router from '@/router';
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { logout } from "@/api/registerLogin";
import { processUrl } from "@/utils/ImageUtil";
import { getLoginId } from "@/utils/JwtUtil";

const route = useRoute()

// 使用计算属性来判断是否显示返回按钮
const backShow = computed(() => {
    return route.path.startsWith('/Publish') || router.currentRoute.value.path === '/MyInfoDetail';
});

// 跳转到个人中心
function toPersonCenter() {
    const userId = String(route.params.id)
    const loginId = String(getLoginId())

    if (route.path === '/Index') {
        router.replace('/PersonCenter/' + getLoginId())
    } else if (userId != loginId) {
        window.open('/PersonCenter/' + getLoginId(), "_blank")
    }
}

// 用户头像
const avatar = ref('')

// 微信登录二维码
const state = reactive({
    weChat: {
        appid: 'wxed9954c01bb89b47',
        redirect_uri: 'http://localhost:8160/auth/wxLogin',
        state: String(Math.ceil(Math.random() * 1000)),
        style: 'white' // 代表二维码的样式，有black和white可选，
    }
})

// 计算当前是否已登录
const loginResult = computed(() => {
    return localStorage.getItem("userInfo")
})


// 登录dialog状态
const dialogStatus = ref(false)
// 关闭dialog框
function handleClose() {
    dialogStatus.value = false
}

// 登录
function login() {
    dialogStatus.value = true
}

const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}

// 注销登录
async function quit() {
    await logout().then(response => {
        ElMessage({ message: response.data, type: 'success' })
    }).catch(error => {
        ElMessage({ message: error, type: 'error' })
    })

    localStorage.clear()
    // 0.5s后刷新页面
    setTimeout(() => {
        if (route.path != '/Index') {
            location.replace('/Index')
        } else {
            location.reload()
        }
    }, 500);
}

// 获取我的头像
async function getMyAvatar() {
    if (localStorage.getItem("userInfo") == null) {
        localStorage.removeItem("token")
        return
    }
    const userInfo = JSON.parse(localStorage.getItem("userInfo") as string)
    avatar.value = processUrl(userInfo.avatar)
}

onMounted(() => {
    getMyAvatar()
})

</script>
  
  
<style scoped>
.flex-grow {
    flex-grow: 1;
}

:deep .el-page-header__header {
    line-height: 55px;
    width: 70px;
    margin-left: 10px;
}
</style>
  