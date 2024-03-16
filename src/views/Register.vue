<template>
    <div class="bg">
        <a href="/"><img src="@/assets/logo.png" class="logo"></a>

        <div class="slogan">
            <div class="big animate__animated animate__fadeInLeft">汇聚智慧</div>
            <div class="small animate__animated animate__fadeInRight">创造无限可能</div>
        </div>
        <!-- 注册表单 -->
        <div class="form">
            <h1 style="margin: 0;">注册账号</h1>
            <el-text type="info">已有账号?</el-text>
            <el-button type="primary" link @click="dialogStatus = true">登录</el-button>
            <el-form :model="form" label-width="60px" label-position="left" size="large" style="margin-top: 30px;">
                <el-form-item label="用户名">
                    <el-input v-model="form.username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="邮&nbsp;&nbsp;&nbsp;箱">
                    <el-input v-model="form.email" placeholder="可用于登录和修改密码" />
                </el-form-item>
                <el-form-item label="密&nbsp;&nbsp;&nbsp;码">
                    <el-input v-model="form.password" type="password" show-password placeholder="请设置登录密码" />
                </el-form-item>
                <el-form-item label="验证码">
                    <el-input v-model="form.validateCode" placeholder="请输入验证码" style="width: 190px;" />
                    <el-button type="success" class="send_code" @click="sendCode">发送验证码</el-button>
                </el-form-item>
                <el-button type="primary" style="width: 100%;" size="large" @click="submit"
                    :disabled="formValidation">注册</el-button>
            </el-form>
        </div>
    </div>

    <!-- 登录注册dialog -->
    <el-dialog v-model="dialogStatus" title="登录" width="25%" :before-close="handleClose" style=" text-align: center;">
        <LoginComponent></LoginComponent>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import 'animate.css';
import { register } from "@/api/registerLogin";
import { sendValidate } from "@/api/validateCode";
import { ElMessage } from 'element-plus'

// 注册表单
const form = reactive({
    username: '',
    email: '',
    password: '',
    validateCode: ''
})
// 验证注册表单是否为空，为空则注册按钮不可用
const formValidation = computed(() => {
    if (form.username != '' && form.email != '' && form.password != '' && form.validateCode != '') {
        return false
    } else {
        return true;
    }
})

// 发送验证码
function sendCode() {
    sendValidate({ email: form.email }).then(response => {
        ElMessage.success(response.data)
    }).catch(error => {
        ElMessage.error(error)
    })
}

// 提交注册
function submit() {
    register(form).then(response => {
        ElMessage.success(response.data)
        form.username = ''
        form.email = ''
        form.password = ''
        form.validateCode = ''
    }).catch(error => {
        ElMessage.error(error)
    })
}

// 登录dialog状态
const dialogStatus = ref(false)
// 关闭dialog框
function handleClose() {
    dialogStatus.value = false
}
// 微信登录二维码
const state = reactive({
    weChat: {
        appid: 'wxed9954c01bb89b47',
        redirect_uri: 'http://localhost:8160/auth/wxLogin',
        state: String(Math.ceil(Math.random() * 1000)),
        style: 'white' // 二维码的样式，有black和white可选，
    }
})
</script>

<style scoped>
.bg {
    background: url('@/assets/register_background.png') no-repeat;
    background-size: cover;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;

    .logo {
        width: 130px;
        position: absolute;
        top: 40px;
        left: 40px;
    }

    .slogan {
        margin: 0 28% 0 20%;
        text-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);

        .big {
            font-size: 60px;
            font-weight: bold;
            color: white;
            margin-bottom: 5px;

        }

        .small {
            font-size: 30px;
            color: white;
            letter-spacing: 5px;
        }
    }

    .form {
        width: 25%;
        padding: 30px;
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 15px;

        .send_code {
            width: 100px;
            margin-left: 25px;
        }
    }
}

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