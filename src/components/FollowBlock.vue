<template>
    <!-- 关注板块 -->
    <h4>关注板块</h4>
    <div class="block_div">
        <!-- 板块项循环渲染 -->
        <span class="block_item" v-for="item in blockList" :key="item.id">
            <el-tooltip class="box-item" effect="dark" :content="item.blockName" placement="top">
                <el-link :underline="false" :href="`/BlockIndex/${item.id}`" target="_blank">
                    <el-button plain class="block_button">
                        <el-text class="block_name" truncated>{{ item.blockName }}</el-text>
                    </el-button>
                </el-link>
            </el-tooltip>
        </span>
    </div>
    <!-- 添加喜欢的板块按钮 -->

    <el-button plain style="width: 100%;" @click="openDialog">添加喜欢的板块</el-button>

    <el-dialog v-model="dialogVisible" title="添加喜欢的板块" width="40%">
        <el-tag class="block_tag" type="success" v-for="(item, index) in blockList" :key="item.id" closable
            @close="unFollowBlock(index, item.id)">
            {{ item.blockName }}
        </el-tag>
        <br>

        <el-input v-model="blockName" placeholder="输入板块名称" clearable class="block_namae_input" />
        <el-button type="primary" @click="search">搜索</el-button>
        <el-text type="info" style="margin-left: 10px;">添加爱逛的板块，时刻关注最新动态</el-text>

        <span v-for="item in blockPageData">
            <div class="block_list">
                <span v-html="item.blockName" class="block_list_item"></span>
                <el-button type="success" size="small" @click="followBlock(item.id, item.blockName)">添加</el-button>
            </div>
        </span>
        <el-pagination small v-model:current-page="pageData.currentPage" :page-size="pageData.size"
            layout="prev, pager, next" :total="pageData.total" @current-change="handleCurrentChange"
            style="margin-top: 10px;" v-if="blockPageData.length > 0" />
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAllFollow, follow, unFollow, getHotBlock } from "@/api/block";
import { getLoginId } from "@/utils/JwtUtil";
import { searchBlock } from '@/api/search';

// 板块数据
const blockList = ref([] as any)

// 获取当前账号所有关注的板块 
async function getAllFollowByCurrentId() {
    if (localStorage.getItem("token")) {
        if (!localStorage.getItem("followBlock")) {
            const loginId = getLoginId()
            const response = await getAllFollow(loginId)
            if (response.data) {
                localStorage.setItem("followBlock", JSON.stringify(response.data))
            } else {
                localStorage.setItem("followBlock", '[]')
            }
        }
        blockList.value = JSON.parse(String(localStorage.getItem("followBlock")))
    }
}

// 若为true则弹出添加喜欢的板块对话框
const dialogVisible = ref(false)

function openDialog() {
    dialogVisible.value = true
    blockName.value = ''
    getHotBlock().then(response => {
        blockPageData.value = response.data
    }).catch(error => {
        ElMessage.error(error)
    })
}

// 板块名称
const blockName = ref('')

// 分页参数
const pageData = reactive({
    currentPage: 1,
    size: 5,
    total: 1,
})

// 分页结果数据
const blockPageData = ref([] as any)

// 处理当前页变化
const handleCurrentChange = (val: number) => {
    pageData.currentPage = val
    search()
}

// 搜索板块
async function search() {
    if (blockName.value == '') {
        ElMessage.error('板块名称不能为空')
        blockPageData.value = []
        return
    }

    const searchData = { currentPage: pageData.currentPage, size: pageData.size, blockName: blockName.value }
    const response = await searchBlock(searchData)
    blockPageData.value = response.data
    pageData.total = Number(response.map.total)
}

// 关注板块
function followBlock(blockId: string, blockName: string) {
    if (!localStorage.getItem('token')) {
        ElMessage.error('请登录！')
        return
    }

    follow(blockId).then(response => {
        ElMessage.success(response.data)
        // 从 localStorage 获取数据
        let data = JSON.parse(localStorage.getItem('followBlock') as string) || [];
        // 新增一条关注记录
        let newData = { id: blockId, blockName: blockName.replace(/<[^>]+>/g, '') };
        data.push(newData);
        // 将更新后的数据存回 localStorage
        localStorage.setItem('followBlock', JSON.stringify(data));
        blockList.value.push(newData)
    }).catch(error => {
        ElMessage.error(error)
    })
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
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消操作',
            })
        })
}


onMounted(() => {
    getAllFollowByCurrentId()
})
</script>

<style scoped>
.block_div {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;

    .block_item {
        width: 100px;
        margin: 0 0 10px 0;

        .block_button {
            width: 100%;
            text-align: center;

            .block_name {
                width: 70px;
            }
        }
    }
}

.block_tag {
    margin: 5px 0 5px 5px;
}

.block_namae_input {
    width: 260px;
    margin: 10px 10px 10px 5px;
}

.block_list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 5px 0;

    .block_list_item {
        font-size: small;
        margin-left: 10px;
    }
}
</style>