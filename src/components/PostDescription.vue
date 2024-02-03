<template>
    <div style="margin-left: 10px;">
        <!-- 帖子列表 -->
        <div class="post_item" v-for="item in postData" :key="item.id">
            <!-- 板块链接 -->
            <el-link type="info" :href="`/BlockIndex/${item.blockId}`" target="_blank" class="post_block"
                v-show="!$route.path.startsWith('/BlockIndex')">{{ item.blockName }}</el-link>
            <br>
            <!-- 帖子标题 -->
            <el-link @click="toPostIndex(item.blockId, item.id)" class="post_title"><span
                    v-html="item.title"></span></el-link>
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
import { addPostClickRecord } from '@/api/post';
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router';

const route = useRoute()

defineProps<{
    postData: any
}>();

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
</script>


<style scoped>
.post_item {
    .post_block {
        font-size: 16px;
        margin-bottom: 10px;
    }

    .post_title {
        font-size: 18px;
        margin: 0 0 20px 0;
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