<template>
  <div class="app-container" :class="{ 'dark-mode': isDarkMode }">
    <app-header 
      @toggle-theme="toggleTheme" 
      @change-language="changeLanguage"
    />
    
    <main class="main-container">
      <app-sidebar />
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <app-footer />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeader from './components/AppHeader.vue';
import AppSidebar from './components/AppSidebar.vue';
import AppFooter from './components/AppFooter.vue';

const { locale } = useI18n();
const isDarkMode = ref(localStorage.getItem('theme') === 'dark');

// 提供暗色模式状态给所有组件
provide('isDarkMode', isDarkMode);

// 切换主题
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

// 切换语言
const changeLanguage = (lang) => {
  locale.value = lang;
  localStorage.setItem('language', lang);
};

// 初始化
const initApp = () => {
  // 从localStorage读取语言设置
  const savedLang = localStorage.getItem('language');
  if (savedLang) {
    locale.value = savedLang;
  }
  
  // 从localStorage读取主题设置
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark';
  } else {
    // 如果没有保存的主题设置，检查系统偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDarkMode.value = prefersDark;
    localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
  }
};

// 组件挂载后初始化
initApp();
</script>

<style>
:root {
  /* 主色调 */
  --primary-color: #2D8CF0;
  --primary-light: #5CADFF;
  --primary-dark: #2b7ad2;
  
  /* 辅助色 */
  --secondary-color: #F5F7FA;
  --success-color: #19be6b;
  --warning-color: #ff9900;
  --danger-color: #ed4014;
  --info-color: #2db7f5;
  
  /* 文本颜色 */
  --text-primary: #303133;
  --text-regular: #606266;
  --text-secondary: #909399;
  
  /* 背景色 */
  --bg-color: #ffffff;
  --bg-light: #f8f9fa;
  --bg-dark: #f2f3f5;
  
  /* 边框颜色 */
  --border-color: #e4e7ed;
  --border-light: #ebeef5;
  
  /* 阴影 */
  --box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  --hover-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
  
  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* 圆角 */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 16px;
  --border-radius-circle: 50%;
  
  /* 过渡效果 */
  --transition-time: 0.3s;
  
  /* 布局尺寸 */
  --header-height: 60px;
  --sidebar-width: 240px;
  --sidebar-collapsed-width: 80px;
  --footer-height: 60px;
}

.dark-mode {
  --primary-color: #2D8CF0;
  --primary-light: #5CADFF;
  --primary-dark: #2b7ad2;
  
  --secondary-color: #2d3035;
  --success-color: #19be6b;
  --warning-color: #ff9900;
  --danger-color: #ed4014;
  --info-color: #2db7f5;
  
  --text-primary: #e1e1e1;
  --text-regular: #c0c0c0;
  --text-secondary: #909399;
  
  --bg-color: #1c1e21;
  --bg-light: #2d3035;
  --bg-dark: #18191c;
  
  --border-color: #4a4a4a;
  --border-light: #383838;
  
  --box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  --hover-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.4);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  color: var(--text-primary);
  transition: background-color var(--transition-time), color var(--transition-time);
}

.main-container {
  display: flex;
  flex: 1;
  padding-top: var(--header-height);
  height: calc(100vh - var(--footer-height));
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 