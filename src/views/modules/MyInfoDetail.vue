<template>
    <div class="body_css">
        <div class="img_and_name">
            <el-upload :action="uploadAvatarUrl" :show-file-list="false" :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload" auto-upload :headers="headers">
                <el-avatar shape="square" v-if="avatar" :size="145" :src="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                    <Plus />
                </el-icon>
            </el-upload>
            <!-- <el-avatar shape="square" :size="100" :src="info.avatar" /> -->
            <span class="name_css">{{ info.username }}</span>
        </div>
        <el-tabs tab-position="left" class="tab_css">
            <!-- 个人信息选项卡 -->
            <el-tab-pane label="个人信息">
                <el-form label-position="left" label-width="60px" :model="info">
                    <el-form-item label="名称">
                        <el-input v-model="info.username" class="input_css" />
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input disabled v-model="info.email" class="input_css" placeholder="空" />
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" rows="3" v-model="info.description" class="input_css" />
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-radio-group v-model="info.sex">
                            <el-radio label="1">男</el-radio>
                            <el-radio label="0">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <!-- 修改邮箱选项卡 -->
            <el-tab-pane label="更换邮箱">
                <el-form label-position="left" label-width="60px" :model="info">
                    <el-form-item label="邮箱">
                        <el-input v-model="info.email" class="input_css" />
                    </el-form-item>
                    <el-form-item label="验证码">
                        <el-input v-model="info.validateCode" style="width: 90px;margin-right: 10px;" />
                        <el-button type="success" @click="sendCode">发送验证码</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <!-- 修改密码选项卡 -->
            <el-tab-pane label="修改密码">
                <el-form label-position="left" label-width="60px" :model="info">
                    <el-form-item label="邮箱">
                        <el-input disabled v-model="info.email" class="input_css" />
                    </el-form-item>
                    <el-form-item label="验证码">
                        <el-input v-model="info.validateCode" style="width: 90px;margin-right: 10px;" />
                        <el-button type="success" @click="sendCode">发送验证码</el-button>
                    </el-form-item>
                    <el-form-item label="新密码">
                        <el-input v-model="info.password" class="input_css" />
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
    <el-button type="primary" class="submit" @click="onSubmit">保存</el-button>
</template>
  
<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { processUrl } from "@/utils/ImageUtil";
import { updateUser, getUserInfo } from "@/api/user";
import { getLoginId } from "@/utils/JwtUtil";
import { sendValidate } from "@/api/validateCode";

// 头像上传地址
const uploadAvatarUrl = process.env.VUE_APP_BASE_API + "/file/userAvatar"

// 上传成功执行的操作
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    avatar.value = URL.createObjectURL(uploadFile.raw!) // 显示上传的头像

    // 将后台返回的头像地址替换localStorage里的用户头像
    const userInfo = JSON.parse(String(localStorage.getItem('userInfo')));
    userInfo.avatar = response.data
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    ElMessageBox.alert('头像更改成功!', '提示', {
        confirmButtonText: 'OK', callback: () => {
            location.reload()
        },
    })
}

// 上传头像之前执行的操作
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('头像必须是jpg格式!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('头像大小不能超过2MB!')
        return false
    }
    return true
}

// 上传图片请求头
const headers = computed(() => {
    return { satoken: localStorage.getItem("token") }
})

// 用户头像
const avatar = ref('')

// 个人信息
const info = reactive({
    id: '',
    username: '',
    email: '',
    description: '',
    sex: '',
    validateCode: null,
    password: null
})

// 提交用户信息表单
function onSubmit() {
    updateUser(info).then(async response => {
        getUserInfo(info.id).then(response => {
            localStorage.setItem("userInfo", JSON.stringify(response.data))
            ElMessage({ message: '更改成功！', type: 'success' })
            // 1s后刷新页面
            setTimeout(() => {
                location.reload()
            }, 1000);

        }).catch(error => {
            ElMessage({ message: '更改失败！', type: 'error' })
        })
    }).catch(error => {
        ElMessage({ message: error, type: 'error' })
    })
}

// 发送验证码
// 发送验证码
function sendCode() {
    sendValidate({ email: info.email }).then(response => {
        ElMessage.success(response.data)
    }).catch(error => {
        ElMessage.error(error)
    })
}
// 获取我的信息
async function getMyInfo() {
    if (localStorage.getItem("userInfo") == null) {
        ElMessage({ message: '请重新登录！', type: 'warning', })
        return
    }
    const userInfo = JSON.parse(localStorage.getItem("userInfo") as string)
    avatar.value = processUrl(userInfo.avatar)
    info.id = getLoginId()
    info.username = userInfo.username
    info.email = userInfo.email
    info.description = userInfo.description
    info.sex = String(userInfo.sex)
}

onMounted(() => {
    getMyInfo()
})
</script>
  
<style scoped>
.body_css {
    display: flex;
    justify-content: center;
    padding-top: 150px;

    .img_and_name {
        display: flex;
        flex-direction: column;
        align-items: center;

        .avatar {
            width: 150px;
            height: 150px;
            object-fit: cover;
        }

        .name_css {
            margin-top: 15px;
            font-size: smaller;
        }
    }

    .tab_css {
        .input_css {
            width: 200px;
        }
    }
}

.submit {
    width: 100px;
    margin: 50px auto;
    display: block;
}
</style>