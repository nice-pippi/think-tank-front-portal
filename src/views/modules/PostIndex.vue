<template>
    <div class="body_div">
        <!-- InfoSearch 和 BlockIndexInfo 组件 -->
        <InfoSearch></InfoSearch>
        <BlockIndexInfo :blockInfo="blockInfo" :showEditButton="showEditButton"></BlockIndexInfo>

        <!-- 帖子标题以及帖子管理按钮 -->
        <div class="post_head">
            <span style="font-size: large;">主题：{{ title }}</span>
            <div>
                <!-- 评分、收藏、删除 -->
                <div class="action">
                    <span style="margin-right: 10px;">打分</span>
                    <el-rate v-model="rate.score" :colors="rate.colors" @click="scorePost" />
                    <el-button type="success" icon="Star" style="margin-left: 20px;" v-if="IsFavorite == true"
                        @click="removeFavoriteByPostId">已收藏</el-button>
                    <el-button type="primary" icon="Star" style="margin-left: 20px;" v-if="IsFavorite == false"
                        @click="favorite">收藏</el-button>
                    <el-button type="danger" icon="Delete" style="margin-left: 20px;" v-if="showDeleteButton"
                        @click="deletePost">删除</el-button>
                </div>
            </div>

        </div>
        <div class="post_tag">
            <el-text type="info">标签：</el-text>
            <el-tag v-for="item in tag" class="tag_item">{{ item }}</el-tag>
        </div>
        <div class="post_div">
            <div class="comments">
                <!-- 评论部分的卡片 -->
                <el-card>
                    <!-- 使用 v-for 遍历 userComment 数组 -->
                    <span v-for="(item, index) in pageData.data">
                        <div class="comment">
                            <div class="user">
                                <!-- 用户头像 -->
                                <el-avatar shape="square" :size="70" :src="processUrl(item.avatar)" />
                                <div class="user_info">
                                    <!-- 用户名 -->
                                    <el-link :href="`/PersonCenter/` + item.userId" target="_blank" class="user_name">
                                        {{ item.username }}
                                    </el-link>
                                    <!-- 帖主、层主标志 -->
                                    <img src="@/assets/post_master.png" style=" width: 45px;"
                                        v-show="item.userId == masterId">
                                    <img src="@/assets/floor_master.png" style=" width: 45px;"
                                        v-show="item.userId != masterId">
                                </div>
                            </div>

                            <div class=" content">
                                <!-- 评论内容 -->
                                <div class="ql-snow">
                                    <div class="ql-editor" v-html="item.content"></div>
                                </div>
                                <!-- 评论底部 -->
                                <div class="content_footer">
                                    <img src="@/assets/like.png" title="点赞" class="like" v-if="!item.likeFlag"
                                        @click="addLike(item.id)">
                                    <img src="@/assets/like2.png" title="取消点赞" class="like" v-if="item.likeFlag"
                                        @click="removeLike(item.id)">
                                    <span class="description_item">{{ item.likes }}</span>
                                    <el-button type="danger" link size="small" icon="WarningFilled"
                                        @click="reportType(0, String(item.id))">举报</el-button>
                                    <Clock class="small_logo" />
                                    <span class="description_item">{{ item.createTime }}</span>
                                    <span class="description_item">第{{ index + 1 }}层</span>
                                    <el-button type="primary" link size="small" icon="ChatDotRound"
                                        @click="openDrawer(item)">回复({{ getChildrenCount(item.replies) }})</el-button>
                                </div>
                            </div>
                        </div>
                        <!-- 分隔线 -->
                        <el-divider />
                    </span>
                </el-card>
                <!-- 分页 -->
                <div class="pagination_css">
                    <el-pagination v-model:current-page="pageData.currentPage" :background="false" :page-size="10"
                        layout="total, prev, pager, next, jumper" :total="pageData.total"
                        @current-change="handleCurrentChange" />
                </div>
                <!-- 回复 -->
                <el-card>
                    <div class="comment_head">
                        <h4 style="margin:0">发帖回复</h4>
                        <el-button type="danger" icon="WarningFilled" size="small" @click="reportType(1, '')">举报</el-button>
                    </div>
                    <!-- 编辑器组件 -->
                    <EditorComponent></EditorComponent>
                </el-card>
            </div>

            <!-- 热门新闻和区块分类的区域 -->
            <div class="hotnews_and_blockclassify">
                <div class="affix_div">
                    <!-- 热门新闻和区块分类组件 -->
                    <HotPost></HotPost>
                    <BlockClassify></BlockClassify>
                </div>
            </div>
        </div>

        <!-- 抽屉 -->
        <el-drawer v-model="drawer.status" title="评论区" :with-header="true" :before-close="closeDrawer">
            <!-- 发表评论输入框 -->
            <div class="send_comment">
                <el-input :rows="4" type="textarea" v-model="drawerContent" placeholder="发表评论，请注意用语..."
                    style="margin-right: 10px;" />
                <el-button type="success" @click="commentReply">评论</el-button>
            </div>
            <!-- 子评论 -->
            <div class="inner_comment_item" v-for="item in drawer.data">
                <!-- 用户信息和操作 -->
                <div class="avatar_username_time_flex">
                    <div class="avatar_username_time">
                        <el-avatar shape="circle" :size="40" :src="processUrl(item.avatar)" />
                        <el-text>{{ item.username }}</el-text>
                        <el-text v-if="isReplyComment(item.parentId)">回复</el-text>
                        <el-text v-if="isReplyComment(item.parentId)">
                            {{ getUserByReplyCommentId(item.parentId) }}
                        </el-text>
                        <el-text>{{ item.createTime }}</el-text>
                    </div>
                    <!-- 回复抽屉评论区某个评论 -->
                    <div class="reply_like_flex">
                        <el-icon class="message" @click="reply_user(item)">
                            <ChatDotSquare />
                        </el-icon>
                        <img src="@/assets/like.png" title="点赞" class="like" v-if="!item.likeFlag"
                            @click="addLike(item.id)">
                        <img src="@/assets/like2.png" title="取消点赞" class="like" v-if="item.likeFlag"
                            @click="removeLike(item.id)">
                        <el-text size="small">{{ item.likes }}</el-text>
                    </div>
                </div>
                <!-- 评论内容 -->
                <div class="comment_content">{{ item.content }}</div>
                <!-- 回复评论 -->
                <div class="send_comment" v-if="drawer.replyCommentId == item.id">
                    <el-input :rows="3" type="textarea" v-model="drawerContent" :placeholder="drawer.replyUserName"
                        class="reply_comment" />
                    <el-button type="success" @click="subCommentReply">评论</el-button>
                </div>
            </div>
        </el-drawer>

        <!-- 举报原因对话框 -->
        <el-dialog v-model="reportDialog" title="举报原因" :before-close="closeReportDialog" width="650">
            <el-form ref="ruleFormRef" :model="reportForm" :rules="rules" label-width="130px" class="demo-ruleForm"
                status-icon label-position="left">
                <el-form-item label="请选择举报原因" prop="reportTypeId">
                    <el-radio-group v-model="reportForm.reportTypeId">
                        <el-radio label="1">色情低俗</el-radio>
                        <el-radio label="2">垃圾广告</el-radio>
                        <el-radio label="3">辱骂攻击</el-radio>
                        <el-radio label="4">违法犯罪</el-radio>
                        <el-radio label="5">政治相关</el-radio>
                        <el-radio label="6">少儿不宜</el-radio>
                        <el-radio label="7">侵权犯罪</el-radio>
                        <el-radio label="8">其他原因</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="详细原因" prop="reason" v-if="reportForm.reportTypeId === '8'">
                    <el-input v-model="reportForm.reason" type="textarea" rows="4" style="width: 410px;"
                        placeholder="提供更多信息有利于加快审核" />
                </el-form-item>
                <el-button type="primary" @click="submitReport(ruleFormRef)" style="margin-left: 79%;">提交</el-button>
            </el-form>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { getBlockInfo, isMaster } from "@/api/block";
import { processUrl } from "@/utils/ImageUtil";
import { addFavorite, removeFavorite, getTitleAndTagById, isFavorite, deleteById, hasDeletePermission } from "@/api/post";
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCommentByPage, replyComment, addLikeComment, removeLikeComment } from "@/api/comment";
import { score, getScore } from "@/api/score";
import { report } from "@/api/report";
import router from '@/router';

const route = useRoute()

// 是否打开举报弹窗
const reportDialog = ref(false)
// type 0:举报评论 1 举报帖子
function reportType(type: number, commentId: string) {
    reportDialog.value = true
    if (type === 0) {
        reportForm.commentId = commentId
    }
}
// 取消举报
function closeReportDialog() {
    reportDialog.value = false
    reportForm.commentId = ''
    reportForm.reportTypeId = '1'
}

// 表单数据结构
interface RuleForm {
    blockId: string
    postId: string
    commentId: string
    reportTypeId: string
    reason: string
}
// 表单引用
const ruleFormRef = ref<FormInstance>()
// 举报原因
const reportForm = reactive<RuleForm>({
    blockId: String(route.params.blockId),
    postId: String(route.params.postId),
    commentId: '',
    reportTypeId: '1',
    reason: ''
})
// 举报表单验证规则
const rules = reactive<FormRules<RuleForm>>({
    reportTypeId: [
        {
            required: true,
            message: '请选择举报原因！',
            trigger: 'change',
        },
    ],
    reason: [
        {
            required: true,
            message: '请输入举报原因！',
            trigger: 'change',
        },
    ]
})
const submitReport = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            report(reportForm).then(response => {
                ElMessage.success(response.data)
                closeReportDialog()
            }).catch(error => {
                ElMessage.error(error)
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}

// 帖子标题
const title = ref('')

// 帖子tag标签
const tag = ref([])

// 获取本帖子标题以及tag标签
async function getTitle() {
    try {
        const response = await getTitleAndTagById(String(route.params.postId))
        title.value = response.data.title
        tag.value = JSON.parse(response.data.tag)

    } catch (error) {
        console.log(error);
    }
}

// 获取当前登录用户是否收藏了当前帖子
function getIsFavorite() {
    if (!localStorage.getItem("token")) {
        return
    }

    const postId = String(route.params.postId);

    isFavorite(postId).then(response => {
        IsFavorite.value = response.data
    }).catch(error => {
        ElMessage.error(error)
    })
}

// 帖主id
const masterId = ref(0)

// 收藏帖子
function favorite() {
    const postId = String(route.params.postId)
    addFavorite(postId).then(response => {
        ElMessage.success(response.data)
        IsFavorite.value = !IsFavorite.value
    }).catch(error => {
        ElMessage.error(error)
    })
}

// 取消收藏帖子
function removeFavoriteByPostId() {
    const postId = String(route.params.postId)
    removeFavorite(postId).then(response => {
        ElMessage.warning(response.data)
        IsFavorite.value = !IsFavorite.value
    }).catch(error => {
        ElMessage.error(error)
    })
}

// 是否显示收藏button
const IsFavorite = ref(false)

// 是否显示删除button
const showDeleteButton = ref(false)

// 获取当前登录用户是否拥有删除帖子权限
function hasDeletePermissionById() {
    if (!localStorage.getItem("token")) {
        return
    }
    const postId = String(route.params.postId)
    hasDeletePermission(postId).then(response => {
        showDeleteButton.value = response.data
    })
}

// 删除帖子
function deletePost() {
    ElMessageBox.confirm(
        '确定要删除帖子？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            const blockId = String(route.params.blockId)
            const postId = String(route.params.postId)
            deleteById(postId).then(response => {
                ElMessage.success(response.data)
            }).catch(error => {
                ElMessage.error(error)
            })
            setTimeout(() => {
                router.push('/BlockIndex/' + blockId)
            }, 700);
        })
}


// 获取当前页所有评论
function getComments() {
    const postId = String(route.params.postId)
    getCommentByPage(postId, pageData.currentPage).then(response => {
        pageData.data = response.data.records
        pageData.currentPage = Number(response.data.current)
        pageData.total = Number(response.data.total)
        masterId.value = response.data.records.filter((item: { topicFlag: number; }) => item.topicFlag === 1)[0].userId;
    }).catch(error => {
        ElMessage.error(error)
    })
}

// 获取当前评论下所有子级评论数量
function getChildrenCount(comments: any[]) {
    let count = 0;
    for (const comment of comments) {
        count++;
        if (comment.replies && comment.replies.length > 0) {
            count += getChildrenCount(comment.replies);
        }
    }
    return count;
}

// 分页数据
const pageData = reactive({
    currentPage: 1,
    total: 0,
    data: [] as any
})
// 处理当前页变化
const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
}

// 评分和对应的颜色
const rate = reactive({
    score: 0,
    colors: ['#99A9BF', '#F7BA2A', '#FF9900']
})

// 帖子评分
function scorePost() {
    const form = {
        blockId: String(route.params.blockId),
        postId: route.params.postId,
        score: rate.score
    }

    score(form).catch(() => { ElMessage.error('请登录！') })
}

// 获取当前用户对帖子的评分
function getScoreByUser() {
    if (!localStorage.getItem('token')) {
        rate.score = 0
        return
    }

    const postId = String(route.params.postId)
    getScore(postId).then(response => {
        rate.score = response.data
    }).catch(error => {
        ElMessage.error(error)
    })
}

// 抽屉
const drawer = reactive({
    status: false, // 是否打开抽屉
    currentCommentId: 0, // 当前评论id
    data: [{} as any], // 当前所有子评论
    replyCommentId: 0, // 回复某评论id
    replyUserName: '' // 被回复的用户名
})
// 打开评论区抽屉
function openDrawer(data: any) {
    drawer.status = true
    drawer.currentCommentId = data.id
    drawer.data = findChildrenComments(data.replies)
}
// 关闭抽屉后执行的操作
function closeDrawer() {
    drawer.status = false
    drawer.currentCommentId = 0
    drawer.data = []
    drawer.replyCommentId = 0
    drawer.replyUserName = ''
    drawerContent.value = ''
}

// 绑定评论区抽屉文本框内容
const drawerContent = ref('')

// 回复评论
function commentReply() {
    const blockId = String(route.params.blockId)
    const postId = route.params.postId
    const parentId = drawer.currentCommentId
    const form = { blockId: blockId, postId: postId, parentId: parentId, content: drawerContent.value }

    replyComment(form).then(response => {
        ElMessage.success('发布成功')

        // 清空文本框
        drawerContent.value = ''
        setTimeout(() => {
            location.reload()
        }, 800);
    }).catch(error => {
        ElMessage.error(error)
    })
}

// 点击回复评论区某个用户
function reply_user(data: any) {
    // 清空文本框
    drawerContent.value = ''
    drawer.replyCommentId = data.id
    drawer.replyUserName = '回复:' + data.username
}

// 发表回复评论区某个用户
function subCommentReply() {
    const blockId = String(route.params.blockId)
    const postId = route.params.postId
    const parentId = drawer.replyCommentId
    const form = { blockId: blockId, postId: postId, parentId: parentId, content: drawerContent.value }

    replyComment(form).then(response => {
        ElMessage.success('发布成功')
        setTimeout(() => {
            location.reload()
        }, 800);
    }).catch(error => {
        ElMessage.error(error)
    })
}

// 递归遍历该评论的所有子级评论
function findChildrenComments(data: any) {
    const flatData: any = [];
    function flatten(nodes: any[]) {
        nodes.forEach(element => {
            flatData.push(element)

            if (element.replies) {
                flatten(element.replies)
            }
        });
    };
    flatten(data);
    return flatData;
}
// 判断当前评论是否是回复了其他评论
function isReplyComment(parentId: number) {
    if (parentId === drawer.currentCommentId) {
        return false
    }
    return true
}
// 根据当前评论id找到被评论的用户名称
function getUserByReplyCommentId(parentId: number) {
    let replyUserName = ''
    drawer.data.forEach(item => {
        if (parentId === item.id) {
            replyUserName = item.username
        }
    })
    return replyUserName
}

// 评论点赞
function addLike(commentId: string) {
    const blockId = String(route.params.blockId)
    const postId = route.params.postId
    const form = { blockId: blockId, postId: postId, commentId: commentId }

    addLikeComment(form).then(() => {
        // 标记点赞成功后更新评论数据
        if (drawer.status == true) {
            const childComment = drawer.data.find((item) => item.id === commentId);
            if (childComment) {
                childComment.likeFlag = true;
                childComment.likes++;
            }
        } else {
            // 标记点赞成功后更新评论数据
            const comment = pageData.data.find((item: { id: string; }) => item.id === commentId);
            if (comment) {
                comment.likeFlag = true;
                comment.likes++;
            }
        }
    }).catch(() => { ElMessage.error('请登录！') })
}

// 取消评论点赞
function removeLike(commentId: string) {

    const blockId = String(route.params.blockId)
    const postId = route.params.postId
    const form = { blockId: blockId, postId: postId, commentId: commentId }

    removeLikeComment(form).then(() => {
        // 标记点赞成功后更新评论数据
        if (drawer.status == true) {
            const childComment = drawer.data.find((item) => item.id === commentId);
            if (childComment) {
                childComment.likeFlag = false;
                childComment.likes--;
            }
        } else {
            // 标记点赞成功后更新评论数据
            const comment = pageData.data.find((item: { id: string; }) => item.id === commentId);
            if (comment) {
                comment.likeFlag = false;
                comment.likes--;
            }
        }
    }).catch(error => { ElMessage.error('请登录！') })
}

// 板块信息
const blockInfo = ref({})

// 是否显示编辑按钮
const showEditButton = ref(false)

// 获取板块信息
function getBlockInfoById() {
    const id = String(route.params.blockId)
    getBlockInfo(id).then(response => {
        blockInfo.value = response.data
    })

    if (!localStorage.getItem("token")) {
        return
    }
    isMaster(id).then(response => {
        showEditButton.value = response.data
    })
}


onMounted(() => {
    // 获取板块信息
    getBlockInfoById()

    // 获取帖主id以及帖子标题
    getTitle()

    // 验证当前登录用户是否收藏了当前帖子
    getIsFavorite()

    // 加载评论
    getComments()

    // 获取当前用户对帖子的评分
    getScoreByUser()

    // 获取当前登录用户是否拥有删除帖子权限
    hasDeletePermissionById()
})

</script>

<style scoped>
.body_div {
    padding: 20px;

    .post_head {
        width: 70%;
        margin: 0 auto 20px auto;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .action {
            margin: 0 0 10px 5px;
            display: flex;
            align-items: center;
        }
    }

    .post_tag {
        width: 70%;
        margin: 0 auto 20px auto;

        .tag_item {
            margin: 5px;
        }
    }

    .post_div {
        width: 70%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;

        .comments {
            width: 73%;
            display: flex;
            flex-direction: column;
            min-height: 0;

            .comment {
                width: 100%;
                display: flex;
                flex-direction: column;

                .user {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .user_info {
                        width: 90%;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;

                        .user_name {
                            font-size: large;
                            margin: 0 20px;
                        }
                    }
                }

                .content {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;

                    .content_footer {
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        margin-top: 30px;

                        .small_logo {
                            width: 10px;
                            height: 10px;
                            color: gray;
                            margin: 0 5px 0 5px;
                        }

                        .description_item {
                            font-size: small;
                            color: #b1b3b8;
                            margin-right: 5px;
                        }
                    }
                }
            }

            .pagination_css {
                margin: 20px 0 20px 0;
            }

            .comment_head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
            }
        }

        .hotnews_and_blockclassify {
            width: 25%;

            .affix_div {
                position: sticky;
                top: 0;
            }
        }
    }

    .send_comment {
        display: flex;
        align-items: flex-end;

        .reply_comment {
            margin: 10px 10px 0 45px;
        }
    }

    .inner_comment_item {
        margin: 20px 20px 20px 0;

        .avatar_username_time_flex {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .avatar_username_time {
                display: flex;
                align-items: center;

                .el-text {
                    margin-left: 10px;
                }
            }


            .reply_like_flex {
                display: flex;
                align-items: center;

                .message {
                    width: 12px;
                    margin-top: 3px;
                }
            }
        }

        .comment_content {
            font-size: smaller;
            margin-left: 50px;
        }
    }

    .like {
        width: 12px;
        height: 12px;
        margin: 0 5px;
    }
}
</style>