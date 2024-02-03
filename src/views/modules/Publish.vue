<template>
    <div class="diy_tag">
        <el-text size="large">标签：</el-text>
        <el-tag v-for="tag in dynamicTags" :key="tag" style="margin: 0 5px;" closable :disable-transitions="false"
            @close="handleClose(tag)">
            {{ tag }}
        </el-tag>
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" style="width: 100px;" size="small"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button v-else size="small" @click="showInput">
            + 新增
        </el-button>
    </div>
    <div class="editor">
        <EditorComponent></EditorComponent>
    </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'
import { ElInput, ElMessage } from 'element-plus'

const inputValue = ref('')
const dynamicTags = ref(['计算机'])
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const handleClose = (tag: string) => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
    writeTagToLocalStorage()
}

const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value!.input!.focus()
    })
}

const handleInputConfirm = () => {
    const maxTagsCount = 10;
    const maxTagLength = 10;

    if (dynamicTags.value.length >= maxTagsCount) {
        ElMessage.warning('最多只能有10个标签！');
    } else if (inputValue.value.length > maxTagLength) {
        ElMessage.warning('标签文字不能超过10个字！');
    } else if (inputValue.value) {
        dynamicTags.value.push(inputValue.value);
        writeTagToLocalStorage()
    }

    inputVisible.value = false;
    inputValue.value = '';
};


function writeTagToLocalStorage() {
    localStorage.setItem('tag', JSON.stringify(dynamicTags.value))
}

onMounted(() => {
    writeTagToLocalStorage()
})
</script>

<style scoped>
.diy_tag {
    margin: 10px 0 0 20%;
    width: 60%;
}

.editor {
    width: 60%;
    margin: 0 auto;
    padding-bottom: 40px;
}
</style>