<template>
    <div class="body_div">
        <!-- 信息搜索组件 -->
        <InfoSearch></InfoSearch>

        <!-- 广告部分 -->
        <div class="ad_body">
            <div class="block text-center">
                <!-- 轮播组件 -->
                <el-carousel height="200px" style="width: 660px;">
                    <el-carousel-item v-for="i in 5" :key="i">
                        <el-image :src="`http://192.168.88.150:9000/index-ad/carousel/img_` + i + '.jpg'" fit="contain" />
                    </el-carousel-item>
                </el-carousel>
            </div>
            <img src="http://192.168.88.150:9000/index-ad/ad_img.png" class="ad_backgroud_img">
        </div>

        <!-- 内容部分 -->
        <div class="content">
            <div class="left_div">
                <el-card class="info_card">
                    <h4 style="margin-top: 0;">个人信息</h4>
                    <!-- 我的信息组件 -->
                    <MyInfo></MyInfo>
                    <!-- 关注板块组件 -->
                    <FollowBlock></FollowBlock>
                </el-card>

                <div class="affix_div">
                    <!-- 热门新闻组件 -->
                    <HotPost></HotPost>
                    <!-- 板块分类组件 -->
                    <BlockClassify></BlockClassify>
                </div>
            </div>

            <el-card class="post_card">
                <div class="post_head">
                    <img src="@/assets/news.png" class="news_img">
                    <h3>帖子大厅</h3>
                </div>
                <!-- 帖子组件 -->
                <PostDescription :postData="latestPost"></PostDescription>
            </el-card>

        </div>

    </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { getIndexPosts } from "@/api/post";

// 输入框数据
const input = ref('')

// 图片数据
const img = reactive([
    'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    // ...其他图片链接
])

// 最新帖子数据
const latestPost = ref([] as any)

// 获取最新帖子
async function getLatest() {
    try {
        const response = await getIndexPosts()
        latestPost.value = response.data
    } catch (error) {
        console.error(error);
    }
}

onMounted(() => {
    getLatest()
})

</script>
  
<style scoped>
.body_div {
    padding: 20px;
}

.ad_body {
    width: 70%;
    height: 200px;
    margin: 25px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .demonstration {
        color: var(--el-text-color-secondary);
    }

    .el-carousel__item h3 {
        color: #475669;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
        text-align: center;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n + 1) {
        background-color: #d3dce6;
    }

    .ad_backgroud_img {
        width: 335px;
    }
}

.content {
    width: 70%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;

    .left_div {
        width: 25%;

        .info_card {
            margin-bottom: 10px;
        }

        .affix_div {
            /* 下面两行起到固钉的作用 */
            position: sticky;
            top: 0;
        }

    }


    .post_card {
        width: 73%;

        .post_head {
            margin-top: -20px;
            display: flex;
            align-items: center;

            .news_img {
                width: 30px;
                height: 30px;
                margin-right: 10px;
                margin-top: 5px;
            }

        }
    }

    .pagination_css {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }
}
</style>