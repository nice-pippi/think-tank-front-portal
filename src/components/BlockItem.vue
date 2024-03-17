<template>
    <div v-for="item in pageData " class="block_item">
        <el-avatar shape="square" :size="70" :src="processUrl(item.avatar)" />
        <div class="block_info">
            <el-link :href="`/BlockIndex/${item.id}`" type="primary" target="_blank" style="font-size: 18px;"><span
                    v-html="item.blockName"></span>
            </el-link>
            <div class="block_info_footer">
                <el-text size="small">简介：{{ item.description }}</el-text>
                <el-link :href="`/BlockIndex/${item.id}`" type="primary" target="_blank" style="font-size: 12px;">
                    进入
                </el-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { processUrl } from '@/utils/ImageUtil'

// 板块信息
defineProps<{
    pageData: any
}>();

</script>

<style scoped>
.block_item {
    display: flex;
    margin: 0 10px 20px 0;

    .block_info {
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: space-between;
        width: 100%;

        .block_info_footer {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>