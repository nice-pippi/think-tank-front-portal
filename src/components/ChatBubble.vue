<template>
    <!-- 气泡组件 -->
    <div class="bubble" :class="{ me: isMe }">
        {{ message }}
    </div>
</template>
  
<script lang="ts" setup>
// 通过 defineProps 定义组件的属性
defineProps<{
    message?: string     // 消息内容
    isMe?: boolean       // 是否属于当前用户
}>()
</script>
  
<style scoped>
.bubble {
    display: inline-block;
    margin: 10px;
    padding: 10px;
    border-radius: 5px;
    background-color: #f4f4f5;
}

.me {
    /* 当isMe为true时的背景颜色 */
    background-color: #d9ecff;
}
</style>
