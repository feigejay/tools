<template>
  <div class="tools-layout">
    <el-row :gutter="20">
      <!-- 侧边栏导航 -->
      <el-col :xs="24" :sm="6" :md="5" :lg="4" class="sidebar-col">
        <div class="sidebar-container">
          <el-card class="sidebar-card">
            <template #header>
              <div class="sidebar-header">
                <h3>工具导航</h3>
              </div>
            </template>
            <el-menu
              router
              :default-active="$route.path"
              class="tools-menu"
            >
              <template v-for="category in categories" :key="category.path">
                <el-sub-menu :index="category.path">
                  <template #title>
                    <span>{{ category.name }}</span>
                  </template>
                  <el-menu-item 
                    v-for="tool in category.children"
                    :key="tool.path"
                    :index="`/tools/${category.path}/${tool.path}`"
                  >
                    {{ tool.name }}
                  </el-menu-item>
                </el-sub-menu>
              </template>
            </el-menu>
          </el-card>
        </div>
      </el-col>
      
      <!-- 主内容区域 -->
      <el-col :xs="24" :sm="18" :md="19" :lg="20" class="content-col">
        <div class="tool-content">
          <router-view></router-view>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { categories } from '../router';
</script>

<style scoped>
.tools-layout {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.sidebar-col {
  margin-bottom: 20px;
}

.sidebar-container {
  position: sticky;
  top: 20px;
}

.sidebar-card {
  margin-bottom: 20px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tools-menu {
  border-right: none;
}

.tool-content {
  min-height: 500px;
}

@media (max-width: 768px) {
  .sidebar-container {
    position: static;
  }
}
</style> 