<template>
    <!-- 气泡组件 -->
    <div class="bubble" :class="{ me: isMe }">
        <pre>{{ message }}</pre>
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

pre {
    margin: 0;
    padding: 0;
    font-family: 'Microsoft YaHei';
    overflow-x: auto;
    max-width: 950px;
    white-space: pre-wrap;
    /* 超过长度自动换行，同时保留 pre 的格式化特性 */
    word-break: break-word;
    /* 避免长单词破坏布局 */
}
</style>
