<template>
    <div class="body_div">
        <div class="head">
            <a href="/"><img src="../../assets/logo.png" class="logo"></a>
            <el-divider direction="vertical" />
            <span style="font-size: x-large;">重置密码</span>
        </div>

        <el-form :model="form" label-position="left" label-width="60px" class="form_css">
            <el-form-item label="邮箱">
                <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="验证码">
                <el-input v-model="form.validateCode" placeholder="请输入验证码" style="width: 120px;" />
                <el-button type="primary" style="margin-left: 18px;" @click="sendCode">发送验证码</el-button>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input v-model="form.password" placeholder="请输入新密码" />
            </el-form-item>
            <el-button type="success" class="update_button" @click="onSubmit">修改密码</el-button>
        </el-form>

    </div>
</template>

<script lang="ts" setup>
import { updatePassword } from '@/api/user';
import { sendValidate } from '@/api/validateCode';
import { ElMessage } from 'element-plus';
import { reactive } from 'vue'

// 修改密码表单
const form = reactive({
    email: '',
    validateCode: '',
    password: ''
})

// 发送验证码
function sendCode() {
    sendValidate({ email: form.email }).then(response => {
        ElMessage.success(response.data)
    }).catch(error => {
        ElMessage.error(error)
    })
}

// 提交修改密码
function onSubmit() {
    updatePassword(form).then(response => {
        ElMessage.success(response.data)
    }).catch(error => {
        ElMessage.error(error)
    })
}
</script>


<style scoped>
.body_div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;

    .head {
        display: flex;
        align-items: center;
        margin-bottom: 30px;

        .logo {
            width: 110px;
            display: block;
        }
    }

    .form_css {
        width: 300px;

        .update_button {
            width: 100%;
            margin-top: 30px;
        }
    }
}
</style>