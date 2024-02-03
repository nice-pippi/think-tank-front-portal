<template>
    <div class="body_css">
        <!-- InfoSearch 组件 -->
        <InfoSearch></InfoSearch>
        <el-card class="message_div">
            <!-- 消息中心标题 -->
            <h1 style="margin-top: 0;">消息中心</h1>
            <el-tabs>
                <!-- 私信选项卡 -->
                <el-tab-pane label="我的消息">
                    <div class="private_letter_flex">
                        <div>
                            <el-scrollbar height="450px">
                                <!-- 每个私信项 -->
                                <div class="private_letter_item" v-for="(item, index) in privateLetterList" :key="item.id"
                                    :class="{ active: index === selectedMessageIndex }" @click="selectMessage(index)">
                                    <!-- 发送者头像 -->
                                    <el-avatar :size="40" :src="processUrl(item.avatar)" style="margin-left: 10px;" />
                                    <!-- 发送者名称和时间 -->
                                    <div class="name_time_content">
                                        <div class="name_and_time">
                                            <!-- 发送者名称 -->
                                            <el-text truncated style="width: 80px;">{{ item.username }}</el-text>
                                            <!-- 发送时间 -->
                                            <span class="time_css">{{ item.updateTime }}</span>
                                        </div>
                                        <!-- 私信内容 -->
                                        <el-text truncated style="width: 120px; font-size: x-small;">{{ item.latestContent
                                        }}</el-text>
                                    </div>
                                </div>
                            </el-scrollbar>
                        </div>
                        <div class="chat_div" v-show="currentChat.username != ''">
                            <div class="head_css">
                                <!-- 当前聊天用户名称 -->
                                <h4>{{ currentChat.username }}</h4>
                                <el-dropdown>
                                    <el-icon size="20">
                                        <More />
                                    </el-icon>
                                    <template #dropdown>
                                        <!-- 菜单选项 -->
                                        <el-dropdown-menu>
                                            <el-dropdown-item :icon="View" @click="toPersonCenter(currentChat.userId)">
                                                查看资料
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </div>
                            <div class="online_chat">
                                <el-scrollbar height="300px">
                                    <div v-for="(item, index) in messageList" class="avatar_bubble_flex"
                                        :class="{ bubble_right: isMe(String(item.sendUserId)) }">
                                        <!-- 聊天气泡 -->
                                        <el-avatar :size="40" :src="currentChat.avatarBySendUser" style="margin-left: 10px;"
                                            v-show="!isMe(String(item.sendUserId))" />
                                        <ChatBubble :message="item.content" :isMe="!isMe(String(item.sendUserId))">
                                        </ChatBubble>
                                        <div>
                                            <el-avatar :size="40" :src="currentChat.avatarByMe"
                                                v-show="isMe(String(item.sendUserId))" />
                                        </div>
                                    </div>
                                </el-scrollbar>
                            </div>
                            <div class="send_tool">
                                <!-- 发送消息工具栏 -->
                                <el-input v-model="message.content" :rows="2" type="textarea" placeholder="按Enter键发送消息"
                                    style="margin:0 10px 0 10px;" />
                                <el-button type="primary" @click="sendMessage()">发送</el-button>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <!-- 收到评论选项卡 -->
                <el-tab-pane label="收到评论">
                    <div class="comment_div" v-for="item in commentPage.data" :key="item.id">
                        <!-- 评论头部信息 -->
                        <div class="comment_head">
                            <el-avatar :size="50" :src="processUrl(item.avatar)" />
                            <div style="margin-left: 10px;">
                                <el-text>{{ item.username }}</el-text>
                                <div class="time_css" style="margin-top: 5px;">{{ item.createTime }}</div>
                            </div>
                        </div>
                        <!-- 评论内容 -->
                        <div class="content" v-html="item.content"></div>
                        <!-- 帖子标题 -->
                        <div class="post_title">
                            <el-link :underline="false" @click="toPostIndex(item.blockId, item.id)">
                                帖子：{{ item.title }}
                            </el-link>
                        </div>
                        <!-- 板块信息 -->
                        <div class="block_name">
                            所属板块：
                            <el-link type="info" :href="`/BlockIndex/${item.blockId}`" target="_blank"
                                style="font-size: x-small;">
                                {{ item.blockName }}
                            </el-link>
                        </div>
                        <el-divider />
                    </div>
                    <div class="pagination_css">
                        <el-pagination v-model:current-page="commentPage.currentPage" :background="false" :page-size="1"
                            layout="total, prev, pager, next, jumper" :total="commentPage.total"
                            @current-change="handleCurrentChange" hide-on-single-page />
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

  
<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { View } from '@element-plus/icons-vue'
import { getReceivedCommentsPage } from "@/api/comment";
import { getAllChatRoom, getPrivateMessage } from "@/api/message";
import { processUrl } from "@/utils/ImageUtil";
import { ElMessage } from 'element-plus'
import { getLoginId } from '@/utils/JwtUtil';
import { formatter } from "@/utils/dateFormat";

var socket: WebSocket | null = null

// 连接websocket
function connectWebSocket() {
    socket = new WebSocket('ws://localhost:60100/message/private_message/' + getLoginId());

    socket.onopen = () => {
        console.log("WebSocket连接成功");;
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        messageList.value.push({
            sendUserId: data.sendUserId,
            acceptUserId: data.acceptUserId,
            content: data.content
        })
        // 遍历 privateLetterList
        privateLetterList.value.forEach((item: { id: any; }, index: number) => {
            if (String(item.id) === String(data.chatRoomId)) {
                // 在找到匹配的 chatRoomId 时进行更新
                privateLetterList.value[index].latestContent = data.content;
                privateLetterList.value[index].updateTime = formatter(data.createTime, "yyyy-MM-dd HH:mm:ss")
                // 如果需要中断遍历，可以使用 return false
                return false;
            }
        });

        console.log('收到消息:', data);
    };

    socket.close = () => {
        console.log('断开连接');
    }
}

function isMe(acceptUserId: string) {
    const loginId = getLoginId()
    return loginId == acceptUserId
}

//  私信列表
const privateLetterList = ref([] as any)

// 查询所有私信列表
function getAllChatRooms() {
    getAllChatRoom().then(response => {
        privateLetterList.value = response.data
    }).catch(error => {
        ElMessage.error(error)
    })
}

// 当前聊天消息
const messageList = ref([] as any);

// 当前聊天室
const currentChat = reactive({
    chatRoomId: '1',
    userId: '',
    username: '',
    avatarBySendUser: '',
    avatarByMe: ''
})

// 消息
const message = reactive({
    sendUserId: getLoginId(),
    chatRoomId: '',
    acceptUserId: '',
    content: ''
})

// 发送消息
function sendMessage() {
    if (message.content == '') {
        ElMessage.error('消息文字不能为空')
    }

    if (socket != null) {
        message.chatRoomId = currentChat.chatRoomId
        message.acceptUserId = currentChat.userId
        messageList.value.push({
            sendUserId: message.sendUserId,
            acceptUserId: currentChat.userId,
            content: message.content
        })
        // 遍历 privateLetterList
        privateLetterList.value.forEach((item: { id: any; }, index: number) => {
            if (String(item.id) === String(message.chatRoomId)) {
                // 在找到匹配的 chatRoomId 时进行更新
                privateLetterList.value[index].latestContent = message.content;
                privateLetterList.value[index].updateTime = formatter(String(new Date()), "yyyy-MM-dd HH:mm:ss")
                // 如果需要中断遍历，可以使用 return false
                return false;
            }
        });
        socket.send(JSON.stringify(message))
        message.content = ''
    }
}

// -1代表一开始未选中聊天
const selectedMessageIndex = ref(-1)

// 选中聊天
function selectMessage(index: number) {
    selectedMessageIndex.value = index
    currentChat.chatRoomId = String(privateLetterList.value[index].id)
    currentChat.userId = String(privateLetterList.value[index].userId)
    currentChat.username = privateLetterList.value[index].username
    currentChat.avatarBySendUser = processUrl(privateLetterList.value[index].avatar)

    getPrivateMessage(currentChat.chatRoomId).then(response => {
        messageList.value = response.data
    }).catch(error => {
        ElMessage.error(error)
    })
}


// 处理当前页变化
const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
}


// 评论分页数据
const commentPage = reactive({
    currentPage: 1,
    data: [] as any,
    total: 0
})

// 分页查询收到的评论
function getReceivedComments() {
    getReceivedCommentsPage(commentPage.currentPage).then(response => {
        commentPage.data = response.data.records
        commentPage.total = Number(response.data.total)
    }).catch(error => {
        ElMessage.error(error)
    })
}

// 跳转帖子页码
function toPostIndex(blockId: string, postId: string) {
    window.open("/PostIndex/" + blockId + '/' + postId, "_blank")
}

// 跳转到用户个人中心页面
function toPersonCenter(userId: string) {
    window.open('/PersonCenter/' + userId, "_blank")
}

onMounted(() => {
    if (localStorage.getItem("userInfo") == null) {
        return
    }
    const userInfo = JSON.parse(localStorage.getItem("userInfo") as string)
    currentChat.avatarByMe = processUrl(userInfo.avatar)
    getReceivedComments()
    connectWebSocket()
    getAllChatRooms()
})




</script>

<style scoped>
.body_css {
    padding: 20px;

    .message_div {
        width: 70%;
        margin: 20px auto;
        border-radius: 5px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);


        .private_letter_flex {
            display: flex;

            .private_letter_item {
                height: 65px;
                display: flex;
                justify-content: space-between;
                width: 280px;
                align-items: center;
                border-right: 1px solid lightgray;
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;

                .name_time_content {
                    width: 78%;

                    .name_and_time {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 5px;
                    }

                }
            }

            .chat_div {
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .head_css {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px 0 20px;
                    border-bottom: 1px solid lightgray;
                }

                .online_chat {
                    .avatar_bubble_flex {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                    }

                    .bubble_right {
                        justify-content: flex-end;
                    }
                }

                .send_tool {
                    display: flex;
                    align-items: flex-end;
                }
            }

        }

        .comment_div {
            margin: 10px;

            .comment_head {
                display: flex;
                align-items: center;
            }

            .content {
                margin: 10px;
            }

            .post_title {
                border-radius: 5px;
                padding: 10px;
                background-color: #f4f4f5;
            }

            .block_name {
                margin: 10px;
                font-size: small;
                color: #b1b3b8;
                display: flex;
            }
        }

        .pagination_css {
            display: flex;
            justify-content: center;
        }

        /* 选中聊天后的背景颜色 */
        .active {
            background-color: rgba(150, 150, 150, 0.1);
            width: 270px;
        }

        .time_css {
            font-size: xx-small;
            color: gray;
            margin-right: 10px;
        }
    }
}
</style>
  