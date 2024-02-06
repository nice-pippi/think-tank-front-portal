<template>
    <!-- 板块首页主体 -->
    <div class="body_div">
        <!-- 信息搜索组件 -->
        <InfoSearch></InfoSearch>

        <!-- 板块信息组件 -->
        <BlockIndexInfo :blockInfo="blockInfo" :showEditButton="showEditButton"></BlockIndexInfo>

        <div class="post_div">
            <el-card class="post_crad">
                <el-input v-model="page.title" placeholder="板块内搜索" class="search" clearable />
                <el-button :icon="Search" circle @click="searchPost" />
                <PostDescription :postData="pageData.data"></PostDescription>
                <div class="pagination_css">
                    <el-pagination v-model:current-page="page.currentPage" :background="false" :page-size="page.size"
                        layout="total, prev, pager, next, jumper" :total="pageData.total"
                        @current-change="handleCurrentChange" hide-on-single-page />
                </div>
            </el-card>
            <!-- 个人信息卡片 -->
            <el-card class="info_card">
                <h4 style="margin-top: 0;">个人信息</h4>
                <!-- 我的信息组件 -->
                <MyInfo></MyInfo>
                <el-divider />
                <!-- 板块板主信息组件 -->
                <BlockMasterInfo :blockId="$route.params.id" :masterList="masterInfo.masterList"
                    :smallMasterList="masterInfo.smallMasterList"></BlockMasterInfo>
            </el-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getBlockInfo, getAllBlockMasterById, isMaster } from "@/api/block";
import { useRoute } from 'vue-router'
import { processUrl } from "@/utils/ImageUtil";
import { getPostsByCurrentBlockId } from "@/api/post";

const route = useRoute()

// 搜索帖子
function searchPost() {
    getPosts()
}

// 分页查询条件数据
const page = reactive({
    blockId: route.params.id,
    currentPage: 1,
    size: 10,
    title: ''
})

const pageData = reactive({
    data: [],
    total: 0
})

// 处理当前页变化
const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
}

// 板块信息
const blockInfo = ref({})

// 是否显示编辑按钮
const showEditButton = ref(false)

// 获取板块信息以及是否拥有修改板块权限
function getBlockInfoAndIsMasterById() {
    const id = String(route.params.id)

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

// 当前板块所有板主/小板主列表
const masterInfo = reactive({
    masterList: [],
    smallMasterList: []
})


// 获取当前板块所有板主列表
function getAllBlockMaster() {
    const id = String(route.params.id)
    getAllBlockMasterById(id).then(response => {
        const masterList = response.data.masterList
        const smallMasterList = response.data.smallMasterList
        for (let i = 0; i < masterList.length; i++) {
            masterList[i].avatar = processUrl(masterList[i].avatar)
        }
        for (let i = 0; i < smallMasterList.length; i++) {
            smallMasterList[i].avatar = processUrl(smallMasterList[i].avatar)
        }
        masterInfo.masterList = masterList
        masterInfo.smallMasterList = smallMasterList
    })
}

// 分页查询当前板块帖子
async function getPosts() {
    try {
        const response = await getPostsByCurrentBlockId(page)
        pageData.data = response.data
        pageData.total = Number(response.map.total)
    } catch (error) {
        console.error(error);
    }
}


onMounted(() => {
    getBlockInfoAndIsMasterById()
    getAllBlockMaster()
    getPosts()
})
</script>

<style scoped>
.body_div {
    padding: 20px;

    .post_div {
        width: 70%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;

        .post_crad {
            width: 73%;

            .search {
                width: 93%;
                margin: 10px 10px 10px 0;
            }

            .pagination_css {
                margin: 20px 0;
                display: flex;
                justify-content: center;
            }
        }

        .info_card {
            width: 25%;
            height: 100%;
            position: sticky;
            top: 0;
            margin-bottom: 10px;

            .block_master_head {
                display: flex;
                justify-content: space-between;
                align-content: center;
            }

            .block_master {
                margin-top: 20px;
                display: flex;
                flex-direction: row;
            }

            .master_css {
                font-size: smaller;
            }
        }
    }
}
</style>