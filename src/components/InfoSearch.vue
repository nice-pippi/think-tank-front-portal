<template>
    <!-- 搜索栏 -->
    <div class="search_div">
        <a href="/"><img src="../assets/logo.png" class="logo"></a>
        <el-input v-model="content" placeholder="请输入搜索内容" class="search_input" @change="writeContext" />
        <el-button type="primary" class="search_button" @click="search('0')">搜索板块</el-button>
        <el-button type="primary" plain class="search_button" @click="search('1')">搜索帖子</el-button>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import router from '@/router';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus'

const route = useRoute()

// 输入框内容
const content = ref('')

// 搜索
function search(type: string) {
    if (content.value == '' || content.value == null) {
        ElMessage({
            message: '请输入要搜索的内容！',
            type: 'warning',
        })
        return;
    }
    // 0代表搜索板块 1代表搜索帖子
    sessionStorage.setItem('searchType', type);
    sessionStorage.setItem('context', content.value);

    if (route.path != '/SearchIndex') {
        router.push('/SearchIndex')
    } else {
        location.reload()
    }

}

function writeContext() {
    sessionStorage.setItem('context', content.value);
}

onMounted(() => {

    if (route.path != '/SearchIndex') {
        sessionStorage.removeItem('searchType')
        sessionStorage.removeItem('context')
        return;
    }

    if (sessionStorage.getItem('context') == null) {
        content.value = ''
    } else {
        content.value = String(sessionStorage.getItem('context'))
    }
})
</script>

<style scoped>
.search_div {
    width: 65%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .logo {
        width: 110px;
        margin: 0 10px 0 0;
        display: block;
    }

    .search_input {
        width: 650px;
        height: 40px;
    }

    .search_button {
        height: 40px;
        margin-left: 10px;
    }
}
</style>