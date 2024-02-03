<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <ClientNav></ClientNav>
            </el-header>
            <el-container>
                <el-main>
                    <RouterView></RouterView>
                    <el-backtop target=".el-main" :right="100" :bottom="100" />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
  

<script lang="ts" setup>

</script>

<style scoped>
.el-container {
    margin: 0px;
    padding: 0px;
    height: 100vh;
}

.el-header {
    padding: 0;
}

.el-main {
    margin: 0 0 20px 0;
    padding: 0;
}
</style>