<template>
    <div class="head_div">
        <!-- 循环展示板主头像 -->
        <span v-for="i in userList" :key="i.id">
            <el-tooltip class="box-item" effect="dark" :content="i.username" placement="top">
                <el-avatar shape="square" :size="50" :src="i.avatar" style="margin-right: 20px;" />
            </el-tooltip>
        </span>
        <el-empty description="暂无" v-if="userList.length == 0" :image-size="50" style="margin: 0 auto;" />
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
const props = defineProps<{
    userList: any
}>();
</script>

<style scoped>
.head_div {
    width: 100%;
    margin: 20px 0 20px 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
</style>