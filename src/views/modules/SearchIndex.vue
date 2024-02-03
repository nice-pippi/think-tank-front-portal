<template>
    <div style="padding: 20px;">
        <InfoSearch></InfoSearch>
        <el-tabs type="border-card" class="demo-tabs" @tab-click="activeChange" v-model="activeName">
            <el-tab-pane name="first">
                <template #label>
                    <span class="custom-tabs-label">
                        <el-icon>
                            <calendar />
                        </el-icon>
                        <span>搜板块</span>
                    </span>
                </template>
                <div v-if="blockPageData.length == 0" style="text-align: center;">
                    <el-result icon="warning" title="未搜到板块"></el-result>
                    <el-button type="primary" plain @click="openDialog" style="margin-bottom: 20px;">创建板块</el-button>
                </div>
                <BlockItem :pageData="blockPageData"></BlockItem>
            </el-tab-pane>
            <el-tab-pane name="second">
                <template #label>
                    <span class="custom-tabs-label">
                        <el-icon>
                            <calendar />
                        </el-icon>
                        <span>搜帖子</span>
                    </span>
                </template>
                <div v-if="postPageData.length == 0" style="text-align: center;">
                    <el-result icon="warning" title="未搜到帖子"></el-result>
                </div>
                <PostDescription :postData="postPageData"></PostDescription>
            </el-tab-pane>
            <el-pagination v-model:current-page="pageData.currentPage" :background="false" :page-size="pageData.size"
                layout="total, prev, pager, next, jumper" :total="pageData.total" @current-change="handleCurrentChange" />
        </el-tabs>
    </div>
    <el-dialog v-model="dialogVisible" title="申请创建板块" width="35%">
        <el-form :model="form" label-width="90" size="large">
            <el-form-item label="所属分类">
                <el-cascader :options="options" placeholder="请选择所属板块分类" clearable style=" width: 330px;"
                    @change="handleChange" />
            </el-form-item>
            <el-form-item label="板块名称">
                <el-input v-model="form.blockName" placeholder="请输入板块名称" class="input" />
            </el-form-item>
            <el-form-item label="板块介绍">
                <el-input v-model="form.description" type="textarea" placeholder="介绍一下你的板块吧" class="input" maxlength="30"
                    show-word-limit />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="closeDialog" size="large">取消</el-button>
                <el-button type="primary" @click="submitApplication" size="large">提交</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import PostDescription from '@/components/PostDescription.vue';
import { Calendar } from '@element-plus/icons-vue'
import { TabsPaneContext } from 'element-plus/es/components/tabs';
import { applicationBlock } from "@/api/block";
import { searchBlock, searchPost } from "@/api/search";
import { ElMessage } from 'element-plus'

// tab标签页
const activeName = ref('')

// 分页数据
const pageData = reactive({
    currentPage: 1,
    size: 10,
    total: 1,
})

// 板块分页数据
const blockPageData = ref([])

// 帖子分页数据
const postPageData = ref([])

// 处理当前页变化
const handleCurrentChange = (val: number) => {
    pageData.currentPage = val
    search()
}

// 评分和对应的颜色
const rate = reactive({
    score: 0,
    colors: ['#99A9BF', '#F7BA2A', '#FF9900']
})

// 申请创建板块dialog框状态
const dialogVisible = ref(false)
const options = ref([])
// 打开申请创建板块dialog框
function openDialog() {
    dialogVisible.value = true
    options.value = formatData(JSON.parse(localStorage.getItem("blockClassify") as string))
}
//关闭申请创建板块dialog框
function closeDialog() {
    dialogVisible.value = false
    form.smallTypeId = ''
    form.blockName = ''
    form.description = ''
}
// 格式转换函数，使得格式符合el-cascader的options
function formatData(data: any) {
    return data.map((item: any) => {
        const id = item.id
        const bigTypeName = item.bigTypeName
        const children = item.subCategories.map((subItem: any) => {
            const subId = subItem.id;
            const smallTypeName = subItem.smallTypeName;
            return { value: subId, label: smallTypeName }
        })
        return { value: id, label: bigTypeName, children }
    });
}
// 申请创建板块表单
const form = reactive({
    bigTypeId: '',
    smallTypeId: '',
    blockName: '',
    description: ''
})
//提交申请
function submitApplication() {
    applicationBlock(form).then(response => {
        ElMessage.success(response.data)
        closeDialog()
    }).catch(error => {
        ElMessage.error(error)
    })
}

// 选中子节点后的操作
function handleChange(value: any) {
    form.bigTypeId = value[0]
    form.smallTypeId = value[1]
}


// 搜索板块
async function search() {
    if (!sessionStorage.getItem("context")) {
        return
    }
    if (sessionStorage.getItem('searchType') == '0') {
        activeName.value = 'first'
        const context = String(sessionStorage.getItem("context"))
        const searchData = { currentPage: pageData.currentPage, size: pageData.size, blockName: context }
        const response = await searchBlock(searchData)
        blockPageData.value = response.data
        pageData.total = Number(response.map.total)

    } else if (sessionStorage.getItem('searchType') == '1') {
        activeName.value = 'second'
        // pageData.data = []
        const context = String(sessionStorage.getItem("context"))
        const searchData = { currentPage: pageData.currentPage, size: pageData.size, title: context }
        const response = await searchPost(searchData)
        postPageData.value = response.data
        pageData.total = Number(response.map.total)
    }
}

// 搜索
function activeChange(pane: TabsPaneContext, ev: Event) {
    // 写入搜索类型，pane.index分别为0或1（0代表搜索板块、1代表搜索帖子）
    sessionStorage.setItem('searchType', String(pane.index))
    search()
}

onMounted(() => {
    search()
})
</script>
<style scoped >
.demo-tabs {
    width: 70%;
    margin: 20px auto;

    .custom-tabs-label .el-icon {
        vertical-align: middle;
    }

    .custom-tabs-label span {
        vertical-align: middle;
        margin-left: 4px;
    }
}

.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}

.input {
    width: 330px;
}
</style>