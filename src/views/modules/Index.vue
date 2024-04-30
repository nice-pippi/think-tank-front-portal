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
                        <el-image :src="`http://192.168.88.150:9000/index-ad/carousel/img_` + i + '.jpg'"
                            fit="contain" />
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
        <img src="@/assets/ai.svg" class="ai_svg animate__animated animate__fadeInUp" @click="dialogVisible = true">
        <el-dialog v-model="dialogVisible" width="1100" align-center :before-close="handleClose">
            <div slot="title" class="custom_title">
                <img src="@/assets/ai.svg" style="width: 30px;">
                <h1>&nbsp;&nbsp;Ai小助手</h1>
            </div>
            <div class="main_box">
                <el-scrollbar height="430px">
                    <div v-for="(item) in messageList" class="avatar_bubble_flex"
                        :class="{ bubble_right: isMe(String(item.userId)) }">
                        <!-- 聊天气泡 -->
                        <img src="@/assets/ai_avatar.svg" style="width: 30px;" v-show="!isMe(String(item.userId))">
                        <ChatBubble :message="item.content" :isMe="!isMe(String(item.userId))">
                        </ChatBubble>
                        <div>
                            <el-avatar :size="40" :src="processUrl(getMyAvatar())" v-show="isMe(String(item.userId))" />
                        </div>
                    </div>
                </el-scrollbar>
                <el-icon class="is-loading" style="margin: 0 auto;" size="20" v-if="sendButtonStatus">
                    <Loading />
                </el-icon>
                <el-form @keyup.enter="sendToAi" class="dialog_footer">
                    <el-input v-model="sendMessage.content" :rows="3" type="textarea" placeholder="输入您要提问的问题..." />
                    <el-button type="primary" style="margin-left: 15px;" @click="sendToAi"
                        :disabled="sendButtonStatus">发送</el-button>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { getIndexPosts } from "@/api/post";
import 'animate.css';
import ChatBubble from '@/components/ChatBubble.vue';
import { getLoginId } from '@/utils/JwtUtil';
import { processUrl } from "@/utils/ImageUtil";
import { sendMessageToAi } from '@/api/message';


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

// 是否显示Ai小助手聊天框
const dialogVisible = ref(false)

// Ai小助手聊天框当前消息记录
const messageList = reactive([{
    content: '您好~请问有什么可以帮助您的？',
    userId: '1001'
}])

// Ai小助手聊天框当前消息是否为“我”发的
function isMe(userId: string) {
    const loginId = getLoginId()
    return loginId == userId
}

// 我的头像
function getMyAvatar() {
    const userInfo = JSON.parse(String(localStorage.getItem('userInfo')))
    return userInfo.avatar;
}

// 发送给Ai小助手的消息
const sendMessage = reactive({
    content: ''
})

// 是否禁用发送按钮
const sendButtonStatus = ref(false)

// 发送给Ai小助手
function sendToAi() {
    sendMessageToAi(sendMessage).then(response => {
        const newMessage = {
            content: response.data,
            userId: '1001'
        }
        messageList.push(newMessage)
        sendButtonStatus.value = false
    })
    const newSendMessage = {
        content: sendMessage.content,
        userId: getLoginId()
    }
    messageList.push(newSendMessage)
    sendMessage.content = ''
    sendButtonStatus.value = true
}

// 关闭Ai小助手聊天框后的操作
const handleClose = (done: () => void) => {
    dialogVisible.value = false

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

.ai_svg {
    width: 40px;
    position: absolute;
    right: 100px;
    top: 370px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 20%;
    padding: 5px;
}

.ai_svg:hover {
    width: 40px;
    position: absolute;
    right: 100px;
    top: 370px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    border-radius: 30%;
    padding: 5px;
    cursor: pointer;
}

.custom_title {
    margin-top: -50px;
    display: flex;
    align-items: center
}

.main_box {
    height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;

    .avatar_bubble_flex {
        display: flex;
        align-items: start;

    }

    .bubble_right {
        justify-content: flex-end;
    }

    .dialog_footer {
        display: flex;
        align-items: end;
    }
}
</style>