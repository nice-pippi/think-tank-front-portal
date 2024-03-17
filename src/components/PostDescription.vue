<template>
    <div style="margin-left: 10px;">
        <!-- 帖子列表 -->
        <div class="post_item" v-for="item in postData" :key="item.id">
            <!-- 板块链接 -->
            <el-link type="info" :href="`/BlockIndex/${item.blockId}`" target="_blank" class="post_block"
                v-show="!$route.path.startsWith('/BlockIndex')">{{ item.blockName }}</el-link>
            <br>
            <!-- 帖子标题 -->
            <div class="post_head">
                <el-link @click="toPostIndex(item.blockId, item.id)">
                    <span v-html="item.title" style="font-size: 18px;"></span>
                </el-link>
                <el-button type="danger" size="small" v-if="showDeleteButton"
                    @click="deletePost(item.id)">删除</el-button>
            </div>
            <br>
            <!-- 帖子描述 -->
            <el-text truncated>{{ item.content }}</el-text>
            <!-- 帖子图片 -->
            <div class="img_div" v-show="item.images[0]">
                <div class="demo-image__preview">
                    <el-image style=" width: 150px; height: 150px" :src="item.images[0]" :zoom-rate="1.2"
                        :preview-src-list="item.images" :initial-index="0" fit="cover" />
                </div>
            </div>
            <!-- 帖子信息 -->
            <div class="description">
                <User class="small_logo" />
                <el-link class="description_item" type="info" :href="`/PersonCenter/${item.userId}`">{{ item.username
                    }}</el-link>
                <Clock class="small_logo" />
                <span class="description_item">{{ item.createTime }}</span>
            </div>
            <!-- 分割线 -->
            <el-divider />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router';
import { addPostClickRecord, deleteById } from '@/api/post';
import { isMaster } from '@/api/block';

const route = useRoute()

defineProps<{
    postData: any
}>();

// 是否显示删除button
const showDeleteButton = ref(false)

// 获取当前登录用户是否拥有删除帖子权限
function hasDeletePermission() {
    if (!route.path.startsWith("/BlockIndex")) {
        return;
    }
    const blockId = String(route.params.id)
    if (!localStorage.getItem("token")) {
        return;
    }
    isMaster(blockId).then(response => {
        showDeleteButton.value = response.data
    })
}

// 删除帖子
function deletePost(postId: string) {
    ElMessageBox.confirm('确定要删除帖子？', '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', })
        .then(() => {
            deleteById(postId).then(response => {
                ElMessage.success(response.data)
            }).catch(error => {
                ElMessage.error(error)
            })
            setTimeout(() => {
                location.reload()
            }, 700);
        }).catch(() => { })
}

// 跳转到帖子页面
function toPostIndex(blockId: string, postId: string) {
    // 如果用户已登录，则发起请求新增点击记录到帖子记录表
    if (localStorage.getItem("token")) {
        let clickType = route.path.startsWith("/SearchIndex") ? 1 : 0;
        const data = { blockId: blockId, postId: postId, clickType: clickType }
        addPostClickRecord(data).catch(() => {
            ElMessage.error('出现了错误...')
        })
    }
    window.open("/PostIndex/" + blockId + '/' + postId, "_blank")
}

onMounted(() => {
    hasDeletePermission()
})
</script>


<style scoped>
.post_item {
    .post_block {
        font-size: 16px;
        margin-bottom: 10px;
    }

    .post_head {
        display: flex;
        justify-content: space-between;
        height: auto;
        align-items: center;
    }

    .img_div {
        margin-top: 10px;

        .demo-image__error .image-slot {
            font-size: 30px;
        }

        .demo-image__error .image-slot .el-icon {
            font-size: 30px;
        }

        .demo-image__error .el-image {
            width: 100%;
            height: 200px;
        }
    }

    .description {
        display: flex;
        align-items: center;
        justify-content: end;
        margin-top: 15px;

        .small_logo {
            width: 10px;
            height: 10px;
            margin: 0 5px 0 15px;
            color: gray;
        }

        .description_item {
            font-size: 12px;
            color: lightgray;
        }
    }
}
</style>