<template>
    <div class="body_div">
        <InfoSearch></InfoSearch>
        <div class="background_img"></div>
        <div class="main_div">
            <el-card class="post_card">
                <div v-for="(item, index) in hotPostList" class="post_item">
                    <div class="post_item_detail">
                        <div class="post_head">
                            <el-link type="primary" :underline="false" target="_blank" class="post_title"
                                @click="toPostIndex(item.blockId, item.id)">
                                <el-tag :type="top3Color(index)" style="margin-right: 15px;">{{ index + 1 }} </el-tag>
                                {{ item.title }}
                            </el-link>
                            <el-text type="warning" style="font-size: smaller;">评分：{{ item.avgScore.toFixed(2) }}</el-text>
                        </div>
                    </div>
                </div>
            </el-card>
            <el-card class="rule_card">
                <h3 style="margin: 0;">榜单介绍</h3>
                <p>热议榜单</p>
                <p>热议榜单汇集了智库内正在引发热议的帖子，以评分和评论数量为依据，展示了各个话题下受到欢迎的帖子，让你随时了解智库的热门动态。
                </p>
                <p>一、更新频率</p>
                <p>榜单每小时自动更新一次，以保持与智库内最新讨论的同步。</p>
                <p>二、评分和评论数量排序</p>
                <p>榜单中的帖子首先按照评分从高到低进行排序，评分相同的帖子，将按照评论数量从高到低进行次要排序。</p>
                <p>三、评分计算</p>
                <p>1. 帖子的评分取自用户的评分，单次评分最高为5分。最终将会取该帖子的平均分作为排序标准</p>
                <p>四、规则保障</p>
                <p>1. 为了确保榜单的公正性和透明度，评分系统会严格遵守评分标准，杜绝刷分等行为。</p>
                <p>2. 对于违规操作和不真实评分，贴吧将采取相应措施，以保护榜单的权威性。</p>
                <p>以上是热议榜单的规则，让我们一同共享和探讨有价值的内容，为贴吧的互动增添更多乐趣！</p>
            </el-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getHotPostByTop30 } from "@/api/post";
const hotPostList = ref([] as any)

// 计算el-tag颜色
function top3Color(index: number) {
    if (index == 0) {
        return 'danger'; // 返回'success'表示绿色
    } else if (index == 1) {
        return 'warning'; // 返回'info'表示蓝色
    } else if (index == 2) {
        return 'success';
    } else {
        return 'info'
    }
}

function toPostIndex(blockId: string, postId: string) {
    window.open("/PostIndex/" + blockId + '/' + postId, "_blank")
}

// 获取热门帖子top30
function getHotPostTop30() {
    getHotPostByTop30().then(response => {
        hotPostList.value = response.data
    })
}

onMounted(() => {
    getHotPostTop30()
})
</script>

<style scoped>
.body_div {
    padding: 20px 0 20px 0;

    .background_img {
        margin-top: 20px;
        width: 100%;
        height: 100vh;
        background: url('../../assets/hot_post.png') no-repeat;
        background-size: 100%;
    }

    .main_div {
        margin: -635px auto;
        width: 70%;
        display: flex;
        justify-content: space-between;

        .post_card {
            width: 73%;

            .post_item {
                display: flex;
                margin: 15px;

                .post_item_detail {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;

                    .post_head {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        .post_title {
                            font-size: larger;
                        }
                    }

                    .content {
                        width: 480px;
                    }
                }
            }
        }

        .rule_card {
            width: 25%;
            height: 100%;
            position: sticky;
            top: 0;
        }

        .rule_card p {
            font-size: xx-small;
            color: rgb(136, 136, 136);
        }
    }
}
</style>