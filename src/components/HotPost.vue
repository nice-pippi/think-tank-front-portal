<template>
    <!-- 热议帖子卡片 -->
    <el-card class="hot_post">
        <!-- 热议帖子标题和查看榜单链接 -->
        <div class="hot_head">
            <h4 class="h4_css">热议帖子</h4>
            <el-link type="warning" class="look_news" target="_blank" href="/HotPostIndex">查看榜单</el-link>
        </div>
        <el-divider />

        <!-- 热议帖子项循环渲染 -->
        <div class="hot-post-item" v-for="(item, index) in hotPosts" :key="index">
            <span class="grade">{{ index + 1 }}</span>
            <el-text class="hot_post_title" truncated @click="toPostIndex(item.blockId, item.id)">
                <el-link type="primary" style="font-size: xx-small;">{{ item.title }}</el-link>
            </el-text>
            <span class="comment_number">{{ item.avgScore.toFixed(2) }}</span>
        </div>
    </el-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getHotPostByTop5 } from "@/api/post";

// 热议帖子数据
const hotPosts = ref([] as any);

// 获取热门帖子top5
function getHotPostTop5() {
    getHotPostByTop5().then(response => {
        hotPosts.value = response.data
    })
}

function toPostIndex(blockId: string, postId: string) {
    window.open("/PostIndex/" + blockId + '/' + postId, "_blank")
}

onMounted(() => {
    getHotPostTop5()
})

</script>


<style scoped>
.hot_post {
    .hot_head {
        display: flex;
        justify-content: space-between;
        align-content: center;

        .look_news {
            font-size: 12px;
            margin: 0;
            padding: 0;
        }

        .h4_css {
            margin: 0;
            padding: 0;
        }
    }

    .hot-post-item {
        width: 100%;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 10px 0 10px 0;

        .grade {
            width: 15px;
            height: 19px;
            text-align: center;
        }


        .hot_post_title {
            width: 60%;
        }

        .hot_post_title:hover {
            color: #409EFF;
        }

        .comment_number {
            color: gray;
            font-size: 10px;
        }
    }

    .hot-post-item:nth-child(-n+5) .grade {
        color: #f26522;
    }
}
</style>