<template>
  <div class="about-container">
    <el-card class="about-card">
      <template #header>
        <div class="card-header">
          <h1>关于智能工具导航</h1>
        </div>
      </template>
      <div class="about-content">
        <h2>项目介绍</h2>
        <p>智能工具导航是一个集成了多种实用工具的在线平台，旨在为用户提供便捷、高效的在线工具体验。无论是图像处理、文本转换还是格式化工具，我们都致力于提供简单易用且功能强大的解决方案。</p>
        
        <h2>我们的特色</h2>
        <ul>
          <li><strong>全部免费</strong> - 所有工具完全免费使用，无需注册</li>
          <li><strong>本地处理</strong> - 大部分工具在浏览器本地处理，保护您的隐私</li>
          <li><strong>持续更新</strong> - 我们会不断添加新的工具和改进现有功能</li>
          <li><strong>响应式设计</strong> - 完美支持手机、平板和电脑等各种设备</li>
        </ul>
        
        <h2>技术栈</h2>
        <p>本项目基于以下技术开发：</p>
        <ul>
          <li>Vue 3 - 前端框架</li>
          <li>Element Plus - UI组件库</li>
          <li>Vite - 构建工具</li>
        </ul>
        
        <h2>联系我们</h2>
        <p>如果您有任何建议或问题，请随时联系我们：</p>
        <p><el-icon><Message /></el-icon> 邮箱：example@mail.com</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Message } from '@element-plus/icons-vue';
</script>

<style scoped>
.about-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 20px;
}

.about-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.about-content h2 {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 20px;
  color: #409EFF;
}

.about-content p {
  line-height: 1.6;
  margin-bottom: 15px;
}

.about-content ul {
  padding-left: 20px;
  margin-bottom: 15px;
}

.about-content li {
  line-height: 1.8;
}
</style> 