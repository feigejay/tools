<template>
  <div class="tools-layout">
    <!-- 主内容区域 -->
    <div class="tool-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { categories } from '../router';
</script>

<style scoped>
.tools-layout {
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
  overflow: auto;
}

.tool-content {
  min-height: 500px;
  width: 100%;
  overflow: auto;
}
</style> 