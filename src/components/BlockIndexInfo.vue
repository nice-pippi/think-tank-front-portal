<template>
  <!-- 描述区域容器 -->
  <div class="description_div">
    <!-- 头部图片 -->

    <el-avatar shape="square" fit="fill" :size="250" :src="avatar" class="head_img" />
    <!-- <img :src="avatar" /> -->

    <div class="description_display_flex">
      <!-- 描述内容 -->
      <div class="description_inner_div">
        <!-- 标题及操作按钮 -->
        <div class="description_item">
          <a :href="`/BlockIndex/${blockInfo.id}`" class="block_name_link">
            <h1 style="font-size: 26px">{{ blockInfo.blockName }}</h1>
          </a>
          <el-button type="success" class="action_button" v-if="!isFollow"
            @click="followBlock(String(blockInfo.id))">关注</el-button>
          <el-button type="danger" class="action_button" v-if="isFollow"
            @click="unFollowBlock(String(blockInfo.id))">取消关注</el-button>
          <el-button type="warning" class="action_button" @click="openUpdateInfoDialog"
            v-if="showEditButton">编辑</el-button>
        </div>

        <!-- 描述及类型 -->
        <div class="description_item">
          <el-text style="margin-right: 15px">简介:{{ blockInfo.description }}</el-text>
          <el-text>所属类型:{{ blockType }}</el-text>
        </div>
      </div>
    </div>
  </div>
  <el-dialog v-model="updateBlockInfoDialog.status" title="编辑板块信息" width="45%" :before-close="handleClose">
    <el-form :model="updateBlockInfoDialog.data">
      <el-form-item label="板块封面">
        <el-upload action="http://localhost:60100/file/blockAvatar" :show-file-list="false" :data="{ id: blockInfo.id }"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" auto-upload :headers="headers">
          <img v-if="blockInfo.avatar" :src="updateBlockInfoDialog.data.avatar" class="avatar">
        </el-upload>
      </el-form-item>
      <el-form-item label="当前分类">
        <el-input v-model="blockType" clearable style="width: 220px" disabled />
      </el-form-item>
      <el-form-item label="板块名称">
        <el-input v-model="updateBlockInfoDialog.data.blockName" clearable style="width: 220px" />
      </el-form-item>
      <el-form-item label="板块介绍" style="width: 90%">
        <el-input type="textarea" rows="3" v-model="updateBlockInfoDialog.data.description" placeholder="板块介绍" />
      </el-form-item>
    </el-form>
    <div style="text-align: right">
      <el-button type="primary" @click="onSubmit" style="margin-right: 65px">保存</el-button>
    </div>
  </el-dialog>

  <!-- 发帖按钮 -->
  <el-link :underline="false" :href="`/Publish/${blockInfo.id}`">
    <el-tooltip class="box-item" effect="dark" content="发帖" placement="top-start">
      <el-button type="primary" :icon="Edit" circle class="publish" />
    </el-tooltip>
  </el-link>
</template>

<script lang="ts" setup>
import { reactive, computed } from "vue";
import { Edit } from "@element-plus/icons-vue";
import type { UploadProps } from "element-plus";
import { processUrl } from "@/utils/ImageUtil";
import { updateInfo, follow, unFollow } from "@/api/block";
import { ElMessage } from 'element-plus'
import { useRoute } from "vue-router";

const route = useRoute()

// 提交板块信息更改
const onSubmit = () => {
  updateInfo(updateBlockInfoDialog.data).then(() => {
    ElMessage({ message: '更改成功~', type: 'success', })
    setTimeout(() => {
      location.reload()
    }, 1000);
  }).catch(error => {
    ElMessage({ message: error, type: 'error', })
  })
};

// 板块信息
const props = defineProps<{
  blockInfo: {
    id: String
    avatar: String;
    blockName: String;
    smallTypeName: String;
    bigTypeName: String;
    description: String;
    bigTypeId: String;
    smallTypeId: String;
  },
  showEditButton: boolean
}>();

// 更新板块dialog
const updateBlockInfoDialog = reactive({
  status: false,
  data: {} as any,
});

// 更新板块
function openUpdateInfoDialog() {
  updateBlockInfoDialog.status = true;
  updateBlockInfoDialog.data.id = props.blockInfo.id
  updateBlockInfoDialog.data.avatar = processUrl(String(props.blockInfo.avatar));
  updateBlockInfoDialog.data.blockName = props.blockInfo.blockName;
  updateBlockInfoDialog.data.smallTypeName = props.blockInfo.smallTypeName;
  updateBlockInfoDialog.data.description = props.blockInfo.description;
}

// 关闭dialog
const handleClose = (done: () => void) => {
  updateBlockInfoDialog.status = false;
};

const handleAvatarSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  updateBlockInfoDialog.data.avatar = URL.createObjectURL(uploadFile.raw!);
  if (response.status == 200) {
    updateBlockInfoDialog.data.avatar = processUrl(String(response.data))
  }
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  return true;
};

// 转换头像地址
const avatar = computed(() => {
  return processUrl(String(props.blockInfo.avatar));
});

// 板块分类
const blockType = computed(() => {
  return props.blockInfo.bigTypeName + "/" + props.blockInfo.smallTypeName;
});

// 上传图片请求头
const headers = computed(() => {
  return { satoken: localStorage.getItem("token") };
});

// 判断是否已关注
const isFollow = computed(() => {
  const followBlock = localStorage.getItem('followBlock')
  if (!followBlock) {
    return false
  }
  const followBlockArr = JSON.parse(followBlock)
  return followBlockArr.find((item: { id: String; }) => item.id === props.blockInfo.id)
})

// 关注板块
function followBlock(blockId: string) {
  if (!localStorage.getItem('token')) {
    ElMessage.error('请登录！')
    return
  }

  follow(blockId).then(response => {
    ElMessage.success(response.data)

    // 从 localStorage 获取数据
    let data = JSON.parse(localStorage.getItem('followBlock') as string) || [];

    // 新增一条关注记录
    let newData = { id: blockId, blockName: props.blockInfo.blockName };
    data.push(newData);

    // 将更新后的数据存回 localStorage
    localStorage.setItem('followBlock', JSON.stringify(data));

    setTimeout(() => {
      location.reload()
    }, 800);
  }).catch(error => {
    ElMessage.error(error)
  })
}

// 取关板块
function unFollowBlock(blockId: string) {
  if (!localStorage.getItem('token')) {
    ElMessage.error('请登录！')
    return
  }

  unFollow(blockId).then(response => {
    ElMessage.success(response.data)

    // 从 localStorage 获取数据
    let data = JSON.parse(localStorage.getItem('followBlock') as string) || [];

    // 删除指定 id 的数据
    data = data.filter((item: { id: string; }) => item.id !== blockId);

    // 将更新后的数据存回 localStorage
    localStorage.setItem('followBlock', JSON.stringify(data));

    setTimeout(() => {
      location.reload()
    }, 800);
  }).catch(error => {
    ElMessage.error(error)
  })
}


</script>

<style scoped>
.description_div {
  display: flex;
  width: 70%;
  height: 130px;
  margin: 100px auto 0 auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 3px;

  .head_img {
    position: relative;
    top: -75px;
    left: 25px;
    width: 150px;
    height: 150px;
    margin-right: 55px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .description_display_flex {
    display: flex;
    align-items: center;

    .description_inner_div {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-items: flex-start;

      .description_item {
        display: flex;
        align-items: center;
        height: 50px;

        .block_name_link {
          font-style: normal;
          color: black;
          text-decoration: none
        }

        .action_button {
          width: 80px;
          margin: 0 20px 0 20px;
        }
      }
    }
  }
}

.publish {
  position: relative;
  top: -110px;
  left: 1150px;
  width: 40px;
  height: 40px;
}

.avatar {
  width: 150px;
}
</style>
