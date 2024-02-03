<template>
    <!-- 用户信息 -->
    <div class="info">
        <el-avatar shape="square" :size="100" :src="info.avatar" />
        <el-text class="name" truncated>{{ info.username }}</el-text>
    </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { processUrl } from "@/utils/ImageUtil";

// 用户信息数据
const info = reactive({
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    username: '暂未登录'
})

// 获取我的信息
async function getMyInfo() {
    if (localStorage.getItem("userInfo") == null) {
        return
    }
    const userInfo = JSON.parse(localStorage.getItem("userInfo") as string)
    info.avatar = processUrl(userInfo.avatar)
    info.username = userInfo.username
}

onMounted(() => {
    getMyInfo()
})
</script>

<style scoped>
.info {
    width: 100%;
    display: flex;

    .name {
        width: 50%;
        color: black;
        margin-left: 10px;
    }
}
</style>