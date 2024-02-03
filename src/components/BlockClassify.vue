<template>
    <!-- 板块分类卡片 -->
    <el-card class="block_classify">
        <!-- 分割线及标题 -->
        <el-divider>
            <h4 class="h4_css">板块分类</h4>
        </el-divider>
        <!-- 板块列表 -->
        <div class="block_classify_item">
            <!-- 循环渲染每个板块 -->
            <span v-for="item in blockClassifyList" style="margin: 5px;">
                <!-- 板块链接 -->
                <el-text>{{ item.smallTypeName }}</el-text>
            </span>
        </div>
        <!-- 查看全部按钮 -->
        <a class="look_all" href="/BlockClassifyIndex" target="_blank">
            <el-button plain style="width: 100%;">查看全部</el-button>
        </a>
    </el-card>
</template>
  
<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { getBlockClassify } from "@/api/block";
import { ElMessage } from 'element-plus'

const blockClassifyList = reactive([] as any)

// 获取板块分类
async function getFiveBlockClassify() {
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

    // 获取所有大板块分类，取前5个板块的第一个小分类在首页显示
    const allBlockClassify = JSON.parse(localStorage.getItem("blockClassify") as string)
    for (let index = 0; index < 5; index++) {
        blockClassifyList.push(allBlockClassify[index].subCategories[0])
    }
}
onMounted(() => {
    getFiveBlockClassify()
})
</script>
  

<style scoped>
.block_classify {
    margin-top: 10px;

    .h4_css {
        margin: 0;
        padding: 0;
    }

    .block_classify_item {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .look_all {
        display: block;
        width: 100%;
        margin: 15px 0;
    }
}
</style>