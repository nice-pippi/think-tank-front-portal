<template>
    <div class="body_div">
        <InfoSearch></InfoSearch>
        <BlockIndexInfo :blockInfo="blockInfo"></BlockIndexInfo>

        <el-card class="master_card">

            <div class="block_master_head">
                <el-text size="large">板主团队（15）</el-text>
            </div>
            <el-divider />

            <div class="block_master_head">
                <el-text size="default">板主</el-text>
                <img src="../../assets/big_block_master.png" class="master_logo">
            </div>
            <UserList style="margin-left: 20px;" :userList="masterInfo.masterList"></UserList>
            <el-divider />

            <div class="block_master_head">
                <el-text size="default">小板主</el-text>
                <img src="../../assets/small_block_master.png" class="master_logo">
            </div>
            <UserList style="margin-left: 20px;" :userList="masterInfo.smallMasterList"></UserList>
            <el-divider />

            <div class="block_master_head">
                <el-text size="default">板主介绍</el-text>
            </div>
            <div class="footer">
                <div class="master_description">
                    <img src="../../assets/big_block_master.png" class="big_master_logo">
                    <div>
                        <el-text size="large">板主</el-text>
                        <br>
                        <el-text size="small">拥有管理贴吧事务的权限，例如板块信息更改、板块内帖子管理等，主要引导板块内持续发展...</el-text>
                    </div>
                </div>
                <div class="master_description">
                    <img src="../../assets/small_block_master.png" class="big_master_logo">
                    <div>
                        <el-text size="large">小板主</el-text>
                        <br>
                        <el-text size="small">是板主有力的左右手，与板主共同肩负着管理板块的权力和责任。权责有：管理帖子，如：清理不良信息，引导言论...</el-text>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getBlockInfo, getAllBlockMasterById } from "@/api/block";
import { processUrl } from "@/utils/ImageUtil";

const route = useRoute()

// 板块信息
const blockInfo = ref({})

// 获取板块信息
function getBlockInfoById() {
    const id = String(route.params.id)

    getBlockInfo(id).then(response => {
        blockInfo.value = response.data
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


onMounted(() => {
    getBlockInfoById()
    getAllBlockMaster()
})
</script>

<style scoped>
.body_div {
    padding: 20px;

    .master_card {
        width: 70%;
        margin: 0 auto 40px auto;


        .block_master_head {
            border-left: 3px solid #409EFF;
            padding-left: 10px;
            margin-bottom: 30px;
            display: flex;
            align-items: center;

            .master_logo {
                width: 15px;
                margin-left: 10px;
            }
        }

        .footer {
            width: 70%;
            margin: 0 auto;
            display: flex;

            .master_description {
                display: flex;
                width: 300px;
                margin-right: 50px;

                .big_master_logo {
                    width: 50px;
                    height: 50px;
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>