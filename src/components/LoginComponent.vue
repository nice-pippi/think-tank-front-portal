<template>
    <div v-if="loginDialog.isQR">
        <wxlogin v-if="state.weChat.appid && state.weChat.redirect_uri" :appid="state.weChat.appid" scope="snsapi_login"
            :redirect_uri="state.weChat.redirect_uri" :state="state.weChat.state" :style="state.weChat.style"></wxlogin>
    </div>
    <div v-if="!loginDialog.isQR">
        <el-input v-model="loginDialog.data.email" placeholder="邮箱" class="input" size="large" />
        <el-input v-model="loginDialog.data.password" placeholder="密码" type="password" class="input" size="large" />
        <el-link href="/ResetPassword" target="_blank" style="margin-right: 15px;">忘记密码?</el-link>
        <el-link href="/Register" target="_blank">注册</el-link>
        <el-button type="primary" class="login_button" size="large" @click="login">登录</el-button>
    </div>
    <el-button type="info" link class="switch" @click="loginDialog.isQR = !loginDialog.isQR">切换</el-button>
</template>

<script lang="ts" setup>
import wxlogin from 'vue-wxlogin'
import { passwordLogin } from '@/api/registerLogin'
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import router from '@/router';


// 微信登录二维码
const state = reactive({
    weChat: {
        appid: 'wxed9954c01bb89b47',
        redirect_uri: 'http://localhost:8160/auth/login/wxLogin',
        state: String(Math.ceil(Math.random() * 1000)),
        style: 'white' // 代表二维码的样式，有black和white可选，
    }
})


//登录dialog框
const loginDialog = reactive({
    isQR: true,
    data: {
        email: '',
        password: ''
    }
})

// 登录
function login() {
    passwordLogin(loginDialog.data).then(response => {
        localStorage.setItem("token", response.data)
        if (response.map.permissions == '') {
            localStorage.setItem("permissions", JSON.stringify('[]'))
        } else {
            localStorage.setItem("permissions", JSON.stringify(response.map.permissions))
        }
        router.replace("/Result")
    }).catch(error => {
        ElMessage({ message: error, type: 'error', })
    })
}
</script>

<style scoped>
.switch {
    margin: 10px auto -5px auto;
    display: block;
}

.input {
    margin-bottom: 15px;
}

.login_button {
    margin-top: 30px;
    width: 100%;
}
</style>