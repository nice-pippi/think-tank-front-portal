<template>
    <div class="body_div">
        <InfoSearch></InfoSearch>
        <div class="classify_div">
            <div class="big_classify">
                <div class="classify_nav">
                    <span style="color: white;">全部板块分类</span>
                    <el-icon style="color: white;">
                        <CaretBottom />
                    </el-icon>
                </div>
                <div v-for="item in category">
                    <el-popover placement="right" :title="item.bigTypeName" trigger="hover" width="600">
                        <div slot="content">
                            <span v-for="sub in item.subCategories">
                                <el-link @click="openBlockDialog(item.id, sub.id, sub.smallTypeName)">
                                    {{ sub.smallTypeName }}
                                </el-link>
                                <el-divider direction="vertical" />
                            </span>
                        </div>
                        <template #reference>
                            <el-button text class="category">{{ item.bigTypeName }}</el-button>
                        </template>
                    </el-popover>

                    <el-divider border-style="dashed" style="margin: 0;" />
                </div>
            </div>

            <div class="all_classify">
                <div class="classify_item" v-for="item in  category ">
                    <el-text size="large" class="title">{{ item.bigTypeName }}</el-text>
                    <span v-for="sub in  item.subCategories ">
                        <el-link @click="openBlockDialog(item.id, sub.id, sub.smallTypeName)">
                            {{ sub.smallTypeName }}
                        </el-link>
                        <el-divider direction="vertical" />
                    </span>
                </div>
            </div>
        </div>
        <el-dialog v-model="blockDialog.status" :title="blockDialog.currentBlockName" width="32%">
            <div style="display: flex;justify-content: space-between;">
                <el-select v-model="blockDialog.currentBlockId" filterable placeholder="选择板块" size="large">
                    <el-option v-for="item in blockDialog.blockList" :key="item.id" :label="item.blockName"
                        :value="item.id" />
                </el-select>
                <el-button type="primary" size="large" @click="toBlockIndex">进入</el-button>
                <el-button type="success" size="large" @click="applicationBlockDialog.status = true">申请创建板块</el-button>
            </div>
        </el-dialog>
        <el-dialog v-model="applicationBlockDialog.status" title="申请创建板块" width="35%">
            <el-form :model="applicationBlockDialog.form" label-width="90" size="large">
                <el-form-item label="板块名称">
                    <el-input v-model="applicationBlockDialog.form.blockName" placeholder="请输入板块名称" class="input" />
                </el-form-item>
                <el-form-item label="板块介绍">
                    <el-input v-model="applicationBlockDialog.form.description" type="textarea" placeholder="介绍一下你的板块吧"
                        class="input" maxlength="30" show-word-limit />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="applicationBlockDialog.status = false" size="large">取消</el-button>
                    <el-button type="primary" @click="submitApplication" size="large">提交</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { getBlockClassify, getAllBlockBySmallTypeId, applicationBlock } from "@/api/block";
import { ElMessage } from 'element-plus'
import router from '@/router';

// 大小分类
const category = ref([] as any)

// 获取板块分类
async function getAllBlockClassify() {
    // 若localStorage没有blockClassify，则发起请求获取
    if (!localStorage.getItem("blockClassify")) {
        const response = await getBlockClassify()
        if (response.status == 200) {
            localStorage.setItem("blockClassify", JSON.stringify(response.data))
        } else {
            ElMessage.error('获取板块分类过程中出现了问题...')
            return
        }
    }
    category.value = JSON.parse(localStorage.getItem("blockClassify") as string)
}

// 板块dialog
const blockDialog = reactive({
    status: false,
    blockList: [] as any,
    currentBlockId: '',
    currentBlockName: ''
})

// 打开板块dialog
function openBlockDialog(bigTypeId: string, smallTypeId: string, blockName: string) {
    blockDialog.status = true
    blockDialog.currentBlockId = ''
    blockDialog.currentBlockName = '所属板块小分类：' + blockName
    applicationBlockDialog.form.bigTypeId = bigTypeId
    applicationBlockDialog.form.smallTypeId = smallTypeId
    getAllBlockBySmallTypeId(smallTypeId).then(response => {
        blockDialog.blockList = response.data
    })
}

// 申请创建板块dialog
const applicationBlockDialog = reactive({
    status: false,
    form: {} as any,
})

//提交申请创建板块表单
function submitApplication() {
    applicationBlock(applicationBlockDialog.form).then(response => {
        ElMessage.success(response.data)
    }).catch(error => {
        ElMessage.error(error)
    })
    applicationBlockDialog.status = false
}

// 跳转到板块首页
function toBlockIndex() {
    if (blockDialog.currentBlockId === '') {
        ElMessage.error('请选择板块！')
        return
    }
    router.push('/BlockIndex/' + blockDialog.currentBlockId)
}

onMounted(() => {
    getAllBlockClassify()
})

</script>

<style scoped>
.body_div {
    padding: 20px;

    .classify_div {
        width: 70%;

        margin: 20px auto;
        display: flex;
        justify-content: space-between;

        .big_classify {
            width: 20%;
            height: 100%;
            display: flex;
            flex-direction: column;
            border: 1px solid #b1b3b8;
            border-radius: 5px;

            .classify_nav {
                padding: 5px 10px 5px 15px;
                background-color: #79bbff;
                background-size: cover;
                display: flex;
                justify-content: space-between;
            }

            .category {
                width: 100%;
                display: inline-block;
                text-align: left;
            }
        }

        .all_classify {
            width: 78%;
            display: flex;
            flex-wrap: wrap;

            .classify_item {
                width: 46%;
                margin: 20px 10px;

                .title {
                    margin-bottom: 10px;
                    display: block;
                }
            }
        }
    }
}
</style>