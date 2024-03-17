<template>
    <!-- 整体布局 -->
    <div class="body_div">
        <!-- 信息搜索组件 -->
        <InfoSearch></InfoSearch>

        <!-- 用户信息展示区域 -->
        <div class="description_div">
            <!-- 用户头像 -->
            <el-avatar shape="square" :size="145" :src="info.avatar" class="head_img" />

            <!-- 描述信息显示区域 -->
            <div class="description_display_flex">
                <div class="description_inner_div">
                    <!-- 用户名和编辑按钮 -->
                    <div class="description_item">
                        <h1 style="font-size: 24px;">{{ info.username }}</h1>
                        <a href="/MyInfoDetail">
                            <el-button type="primary" plain icon="Edit" class="editor_button"
                                v-if="isMe">编辑资料</el-button>
                        </a>
                    </div>
                    <!-- 用户性别、注册时间、发帖数信息 -->
                    <div class="description_item">
                        <img src="../../assets/male.png" alt="男" class="sex_icon" v-show="true">
                        <img src="../../assets/female.png" alt="女" class="sex_icon" v-show="false">
                        <span class="register">注册时间：{{ info.createTime }}</span>
                        <span style="font-size: small;">发帖数：{{ postData.total }}</span>
                    </div>
                </div>
                <el-tooltip content="私信" placement="top-start">
                    <el-button type="info" :icon="Message" circle v-if="!isMe" @click="chat" />
                </el-tooltip>
            </div>

        </div>

        <!-- 关注板块、我的帖子和收藏帖子区域 -->
        <div class="post_div">
            <el-card class="my_post">
                <div class="head_css">
                    <img src="@/assets/follow.png" class="icon_css">
                    <h3 class="h3_css">关注板块</h3>
                </div>
                <el-empty description="暂无" :image-size="80" v-if="blockList.length == 0" />
                <div class="follow_block">
                    <span v-for="(item, index) in blockList">
                        <el-tag type="success" :key="item.id" closable class="block_button" size="large"
                            @close="unFollowBlock(index, item.id)">
                            <el-link :underline="false" :href="`/BlockIndex/${item.id}`" target="_blank" type="success">
                                {{ item.blockName }}
                            </el-link>
                        </el-tag>
                    </span>
                </div>
                <el-divider />
                <div class="head_css">
                    <img src="@/assets/pencil.png" class="icon_css">
                    <h3 class="h3_css">发布帖子</h3>
                </div>
                <br>
                <PostDescription :postData="postData.data"></PostDescription>
                <div class="pagination_css">
                    <el-pagination v-model:current-page="postData.currentPage" :background="false" :page-size="15"
                        layout="total, prev, pager, next, jumper" :total="postData.total"
                        @current-change="handleCurrentChangeByPost" />
                </div>
            </el-card>

            <el-card class="like">
                <!-- 收藏帖子 -->
                <div class="like_head">
                    <img src="@/assets/favorite.png" class="icon_css">
                    <h4 style="margin: 0 5px 0 0;">收藏帖子</h4>
                    <el-text size="small">({{ favoritePage.total }})</el-text>
                </div>
                <el-empty description="暂无" :image-size="60" v-if="favoritePage.data.length == 0" />
                <div class="post_list_css" v-for="item in favoritePage.data" :key="item.id">
                    <el-text style="width: 70%;" truncated>
                        <el-link @click="toPostIndex(item.blockId, item.id)" style="font-size: small;" type="info">
                            {{ item.title }}
                        </el-link>
                    </el-text>
                    <el-link @click="toPostIndex(item.blockId, item.id)" style="font-size: small;" type="info">
                        查看
                    </el-link>
                    <el-link @click="removeFavoriteByPostId(item.id)" style="font-size: small;" type="info">
                        删除
                    </el-link>
                </div>
                <div class="pagination_css" style="margin: 15px 0 0 0;">
                    <el-pagination v-model:current-page="favoritePage.currentPage" layout="prev, pager, next" small
                        background :pager-count="5" :page-size="10" :total="favoritePage.total"
                        @current-change="handleCurrentChangeByFavorite" />
                </div>
            </el-card>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { Message } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { formatter } from "@/utils/dateFormat";
import { processUrl } from "@/utils/ImageUtil";
import { getAllFollow, unFollow } from "@/api/block";
import { getLoginId } from "@/utils/JwtUtil";
import { getFavoritePage, getPageByPublishedPosts, removeFavorite } from "@/api/post";
import { getUserInfo } from "@/api/user";
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router';
import { addChatRoom } from '@/api/message';

const route = useRoute()

// 是否显示私信
const isMe = computed(() => {
    const userId = String(route.params.id)
    const loginId = getLoginId()
    return userId === loginId
})

// 分页数据（我/他的帖子）
const postData = reactive({
    currentPage: 1,
    total: 100,
    data: [] as any
})

// 分页数据（我/他收藏的帖子）
const favoritePage = reactive({
    currentPage: 1,
    total: 0,
    data: [] as any
})

// 个人信息
const info = reactive({
    id: '',
    username: '',
    avatar: '',
    createTime: ''
})
// 获取用户信息
async function getUser() {
    // 获取当前路径后面的用户id
    let userId = String(route.params.id)

    // 登录id
    let loginId = ''

    if (localStorage.getItem("token")) {
        loginId = String(getLoginId())
    }

    // 若当前用户id与登录id相同，则直接取localStorage的数据
    if (userId === loginId) {
        if (localStorage.getItem("userInfo") == null) {
            return
        }
        const userInfo = JSON.parse(localStorage.getItem("userInfo") as string)
        info.username = userInfo.username
        info.avatar = processUrl(userInfo.avatar)
        info.createTime = formatter(userInfo.createTime, 'yyyy-MM-dd')
        return
    }

    if (!sessionStorage.getItem('otherUserInfo')) {
        try {
            const response = await getUserInfo(userId)
            sessionStorage.setItem('otherUserInfo', JSON.stringify(response.data))
        } catch (error) {
            console.log(error);
            return error
        }
    }

    const otherUserInfo = JSON.parse(sessionStorage.getItem('otherUserInfo') as string)
    info.username = otherUserInfo.username
    info.avatar = processUrl(otherUserInfo.avatar)
    info.createTime = formatter(otherUserInfo.createTime, 'yyyy-MM-dd')
}

// 获取用户发帖数据
async function getPublishPost() {
    const loginId = String(route.params.id)
    try {
        const response = await getPageByPublishedPosts(loginId, postData.currentPage)
        postData.data = response.data
        postData.total = Number(response.map.total)
    } catch (error) {
        console.log(error);
    }
}

// 板块数据
const blockList = ref([] as any)

// 获取当前账号所有关注的板块 
async function getAllFollowByCurrentId() {
    const currentUserId = String(route.params.id)
    const loginId = getLoginId()

    if (currentUserId === loginId) {
        if (!localStorage.getItem("followBlock")) {
            const response = await getAllFollow(loginId)
            if (response.data) {
                localStorage.setItem("followBlock", JSON.stringify(response.data))
            } else {
                localStorage.setItem("followBlock", '[]')
            }
        }
        blockList.value = JSON.parse(String(localStorage.getItem("followBlock")))
        return
    }

    const response = await getAllFollow(currentUserId)
    if (response.data) {
        blockList.value = response.data
    } else {
        blockList.value = []
    }

}

// 取关板块
function unFollowBlock(index: number, blockId: string) {
    ElMessageBox.confirm('您确定要取消关注此板块?', '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        .then(() => {
            unFollow(blockId).then(response => {
                blockList.value.splice(index, 1)
                ElMessage.success(response.data)
                // 从 localStorage 获取数据
                let data = JSON.parse(localStorage.getItem('followBlock') as string) || [];
                // 删除指定 id 的数据
                data = data.filter((item: { id: string; }) => item.id !== blockId);
                // 将更新后的数据存回 localStorage
                localStorage.setItem('followBlock', JSON.stringify(data));
            }).catch(error => {
                ElMessage.error(error)
            })
        })
        .catch(() => { })
}

// 分页查询当前用户收藏的帖子
function getFavoritePageByCurrentId() {
    const userId = String(route.params.id)
    getFavoritePage(userId, favoritePage.currentPage).then(response => {
        favoritePage.data = response.data.records
        favoritePage.total = Number(response.data.total)
    }).catch(error => {
        ElMessage.error(error)
    })
}

// 处理当前页变化（我关注的）
const handleCurrentChangeByPost = (val: number) => {
    console.log(`current page: ${val}`)
}

// 处理当前页变化（我关注的）
const handleCurrentChangeByFavorite = (val: number) => {
    console.log(`current page: ${val}`)
}

// 跳转到帖子页面
function toPostIndex(blockId: string, postId: string) {
    window.open("/PostIndex/" + blockId + '/' + postId, "_blank")
}

// 删除收藏帖子
function removeFavoriteByPostId(postId: string) {
    ElMessageBox.confirm(
        '确定要取消收藏该帖子？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        .then(() => {
            removeFavorite(postId).then(response => {
                ElMessage.success(response.data)
                // 删除指定 id 的帖子
                const data = favoritePage.data.filter((item: { id: string; }) => item.id !== postId);
                favoritePage.data = data
            }).catch(error => {
                ElMessage.error(error)
            })
        })
        .catch(() => { })
}

// 进入聊天室
function chat() {
    const data = {
        userIdA: getLoginId(),
        userIdB: String(route.params.id)
    }
    addChatRoom(data).then(() => {
        router.replace('/Message')
    }).catch(error => {
        ElMessage.error(error)
    })

}

onMounted(() => {
    getUser()
    getPublishPost()
    getAllFollowByCurrentId()
    getFavoritePageByCurrentId()
})

onUnmounted(() => {
    sessionStorage.removeItem('otherUserInfo')
})

</script>

<style scoped>
.body_div {
    padding: 20px;

    .description_div {
        width: 70%;
        height: 130px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border-radius: 3px;
        margin: 100px auto 25px auto;
        display: flex;

        .head_img {
            position: relative;
            left: 30px;
            top: -75px;
            margin-right: 55px;
        }

        .description_display_flex {
            width: 75%;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .description_inner_div {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                flex-wrap: wrap;
                margin-right: 370px;

                .description_item {
                    display: flex;
                    align-items: center;
                    height: 50px;

                    .editor_button {
                        margin-left: 20px;
                        font-size: xx-small;
                    }

                    .sex_icon {
                        width: 20px;
                        height: 20px;
                    }

                    .register {
                        font-size: small;
                        margin: 0 30px 0 5px;
                    }
                }
            }

            .publish {
                width: 40px;
                height: 40px;
            }
        }

    }

    .post_div {
        width: 70%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;

        .my_post {
            width: 70%;

            .head_css {
                display: flex;
                align-items: center;
            }

            .follow_block {
                display: flex;
                flex-wrap: wrap;

                .block_button {
                    margin: 20px 10px 0 10px;
                }
            }

        }

        .like {
            width: 28%;
            height: 100%;
            position: sticky;
            top: 0;

            .like_head {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }

            .post_list_css {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }

        .pagination_css {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }
    }

    .h3_css {
        margin: 0;
    }

    .icon_css {
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }
}
</style>