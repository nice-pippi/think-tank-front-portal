<template>
  <!-- 板主信息容器 -->
  <div class="block_master_head">
    <!-- 板主信息标题及查看详情链接 -->
    <h4 style="margin: 0">板块信息</h4>
    <el-link type="primary" :href="`/BlockMasterDetail/${blockId}`" style="font-size: 12px" target="_blank">查看详情</el-link>
  </div>

  <!-- 循环展示板主头像 -->
  <el-divider content-position="center">板主</el-divider>
  <UserList :userList="masterList"></UserList>
  <el-divider content-position="center">小板主</el-divider>
  <UserList :userList="smallMasterList"></UserList>

  <!-- 板主人数及板块类型信息 -->
  <p class="master_css">版主：{{ masterList.length }}人</p>
  <p class="master_css">小版主：{{ smallMasterList.length }}人</p>
  <!-- 申请版主链接 -->
  <el-link type="primary" @click="handleOpen" class="master_css">申请版主</el-link>

  <el-dialog v-model="dialogVisible" title="申请板主" width="35%" :before-close="handleClose">
    <el-form :model="applicationForm">
      <div>本板块板主申请要求</div>
      <p>（1）已关注本板块</p>
      <p>（2）用户没有出现过违规操作（例如未禁言）</p>
      <el-form-item label="申请角色:">
        <el-radio-group v-model="applicationForm.roleId">
          <el-radio label="102">板主</el-radio>
          <el-radio label="103">小版主</el-radio>
        </el-radio-group>
      </el-form-item>
      <p>申请理由:</p>
      <el-input v-model="applicationForm.reason" rows="4" type="textarea" maxlength="30" show-word-limit
        placeholder="不得超过30字" />
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onSubmit">申请</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { applicationMaster } from "@/api/block";

// 板块相关信息
const props = defineProps<{
  blockId: string,
  masterList: any,
  smallMasterList: any
}>();

// 申请板主表单
const applicationForm = reactive({
  blockId: "", // 板块id
  roleId: "", // 角色id
  reason: "", // 申请理由
});

// 申请板主dialog框状态
const dialogVisible = ref(false);
// 关闭申请板主dialog执行的操作
function handleOpen() {
  dialogVisible.value = true;
  applicationForm.blockId = props.blockId;
};

// 关闭申请板主dialog执行的操作
function handleClose() {
  dialogVisible.value = false;
  applicationForm.roleId = ""
  applicationForm.reason = "";
};

// 板主
const blockMasterList = reactive([
  {
    id: 123,
    name: "大皮",
    url: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
  },
  {
    id: 234,
    name: "小皮",
    url: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
  },
  {
    id: 345,
    name: "肚皮",
    url: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
  },
]);

// 提交申请板主请求
function onSubmit() {
  applicationMaster(applicationForm).then(response => {
    ElMessage({ message: response.data, type: 'success' })
    handleClose()
  }).catch(error => {
    ElMessage({ message: error, type: 'warning' })
  })
}

// 板块信息
const blockInfo = reactive({
  id: 123,
  blockMasterNumber: 3,
  blockSmallMasterNumber: 10
});
</script>

<style scoped>
.block_master_head {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.master_css {
  font-size: smaller;
}
</style>
