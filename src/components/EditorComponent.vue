<template>
    <!-- 发布帖子 -->
    <div>
        <!-- 标题输入框，仅在发布页面显示 -->
        <el-input v-model="data.title" placeholder="请输入标题" class="title_css"
            v-if="$route.path.startsWith('/Publish/')"></el-input>

        <!-- 富文本编辑器 -->
        <QuillEditor ref="myQuillEditor" v-model:content="data.content" contentType="html" :toolbar="toolbar"
            style="min-height: 360px;" @paste="onPaste($event)" />

        <!-- 随机提问设置卡片，仅在发布页面显示 -->
        <el-card class="box-card" v-if="$route.path.startsWith('/Publish/')">
            <!-- 随机提问开关 -->
            <div class="switch_div">
                <el-tooltip class="box-item" effect="dark" content="不限板块，随机抽取用户提问。" placement="top-start">
                    <h3>随机提问</h3>
                </el-tooltip>

                <el-switch v-model="switchStatus" class="switch_css" />
            </div>

            <!-- 提问人数滑块，仅在随机提问开启时显示 -->
            <div class="slider-demo-block" v-if="switchStatus">
                <span style="width: 100px;">提问人数</span>
                <el-slider v-model="data.count" show-input />
            </div>
        </el-card>

        <!-- 发布按钮 -->
        <el-button type="primary" @click="publish" class="publish_button">发布</el-button>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ElMessage } from 'element-plus'
import { uploadImg } from "@/api/file";
import { useRoute } from 'vue-router'
import { processUrl } from "@/utils/ImageUtil";
import { publishPost } from "@/api/post";
import { publishComment } from "@/api/comment";
import router from '@/router';

const route = useRoute()

// 富文本编辑器工具栏配置
const toolbar = reactive([
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    ['bold', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'align': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '+1' }, { 'indent': '-1' }],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
])

// 随机提问开关
const switchStatus = ref(false)

// 表单数据
const data = reactive({
    blockId: '',
    postId: '',
    title: null,
    content: null,
    count: 0,
    tag: ''
})

const myQuillEditor = ref(null as any)

// 粘贴事件
function onPaste(event: any) {
    // 获取解析 粘贴的内容
    //先判断粘贴的内容是否是图片
    if (event.clipboardData && event.clipboardData.files && event.clipboardData.files.length) {
        event.preventDefault();
        [].forEach.call(event.clipboardData.files, (file: any) => {
            if (!file.type.match(/^image\/(gif|jpe?g|a?png|bmp)/i)) {
                return;
            }
            const formData = new FormData();
            formData.append("file", file);

            uploadImg(formData).then(response => {
                // 获取Quill实例
                const quill = myQuillEditor.value.getQuill()

                // 获取光标位置
                let length = quill.selection.savedRange.index;

                // 插入图片，res为服务器返回的图片链接地址
                quill.insertEmbed(length, "image", processUrl(response.data));

                // 调整光标到最后
                quill.setSelection(length + 1);
            }).catch(error => {
                ElMessage.error(error)
            })
        });
    }

}

function publish() {
    // 判断当前是发布帖子还是发布评论
    if (route.path.startsWith("/Publish")) {
        // 如果提问开关为关闭状态，则将提问人数清空
        if (!switchStatus) {
            data.count = 0
        }
        data.postId = ''
        data.blockId = String(route.params.id)
        if (localStorage.getItem('tag')) {
            let tag = localStorage.getItem('tag') as string
            if (tag != '[]') {
                data.tag = tag
            }
        }
        publishPost(data).then(response => {
            ElMessage.success(response.data)
            setTimeout(() => {
                router.back()
            }, 800);
        }).catch(error => {
            ElMessage.error(error)
        })
    } else if (route.path.startsWith("/PostIndex")) {
        data.blockId = String(route.params.blockId)
        data.postId = String(route.params.postId)
        data.count = 0
        publishComment(data).then(response => {
            ElMessage.success(response.data)
            setTimeout(() => {
                location.reload()
            }, 800);
        }).catch(() => {
            ElMessage.error('请登录！')
        })
    }

}

</script> 

<style scoped>
.title_css {
    margin: 10px 0 10px 0;
}

.box-card {
    margin: 10px 0 10px 0;

    .switch_div {
        display: flex;
        align-items: center;

        .switch_css {
            --el-switch-on-color: #13ce66;
            --el-switch-off-color: #ff4949;
            margin-left: 15px;
        }
    }

    .slider-demo-block {
        display: flex;
        align-items: center;
        margin: 15px 0 15px 0;
    }

    .slider-demo-block .el-slider {
        margin-top: 0;
        margin-left: 12px;
    }
}

.publish_button {
    width: 150px;
    margin: 10px auto;
    display: block;
}
</style>