<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo-section">
        <router-link to="/" class="logo">
          <el-icon><Tools /></el-icon>
          <span>{{ $t('header.title') }}</span>
        </router-link>
        <span class="subtitle">{{ $t('header.subtitle') }}</span>
      </div>

      <div class="search-section">
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            :placeholder="$t('common.searchPlaceholder')"
            class="search-input"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <div class="header-actions">
        <div class="language-options">
          <el-dropdown @command="changeLanguage">
            <span class="language-dropdown">
              <el-icon><Location /></el-icon>
              <span>{{ currentLanguage }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh-CN">简体中文</el-dropdown-item>
                <el-dropdown-item command="zh-TW">繁體中文</el-dropdown-item>
                <el-dropdown-item command="en-US">English</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <el-button
          class="theme-toggle"
          @click="toggleTheme"
          circle
        >
          <el-icon>
            <component :is="isDarkMode ? Sunrise : Moon" />
          </el-icon>
        </el-button>

        <el-button
          class="mobile-menu-toggle"
          @click="toggleMobileMenu"
          circle
        >
          <el-icon>
            <component :is="isMobileMenuOpen ? Close : Menu" />
          </el-icon>
        </el-button>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div class="search-results-container" v-if="showSearchResults">
      <div class="search-results-header">
        <h2>"{{ searchQuery }}" {{ $t('common.noResults') }}</h2>
        <el-button @click="clearSearch" class="clear-search">
          {{ $t('common.clearSearch') }}
        </el-button>
      </div>
      
      <div class="no-results-message">
        <p>{{ $t('common.tryOtherKeywords') }}</p>
        <ul>
          <li>{{ $t('common.checkSpelling') }}</li>
          <li>{{ $t('common.useGenericKeywords') }}</li>
          <li>{{ $t('common.useCategorySearch') }}</li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { Tools, Search, Location, Moon, Sunrise, Menu, Close } from '@element-plus/icons-vue';

const { t, locale } = useI18n();
const isDarkMode = inject('isDarkMode');

// 移动菜单状态
const isMobileMenuOpen = ref(false);

// 搜索状态
const searchQuery = ref('');
const showSearchResults = ref(false);
const searchResults = ref([]);

// 当前语言显示
const currentLanguage = computed(() => {
  switch (locale.value) {
    case 'zh-CN': return '简体中文';
    case 'zh-TW': return '繁體中文';
    case 'en-US': return 'English';
    default: return '简体中文';
  }
});

// 切换主题
const toggleTheme = () => {
  emit('toggle-theme');
};

// 切换语言
const changeLanguage = (lang) => {
  emit('change-language', lang);
};

// 切换移动菜单
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  emit('toggle-mobile-menu', isMobileMenuOpen.value);
};

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 简易模拟搜索结果，实际应用中可以使用 API 或者 Store
    showSearchResults.value = true;
    searchResults.value = []; // 这里模拟搜索，实际需要搜索逻辑
  } else {
    showSearchResults.value = false;
  }
};

// 清除搜索
const clearSearch = () => {
  searchQuery.value = '';
  showSearchResults.value = false;
  searchResults.value = [];
};

// 定义事件
const emit = defineEmits(['toggle-theme', 'change-language', 'toggle-mobile-menu']);

// 监听 route 变化，清除搜索
watch(() => window.location.href, () => {
  clearSearch();
});
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-height);
  background-color: var(--bg-color);
  box-shadow: var(--box-shadow);
  z-index: 100;
  transition: background-color var(--transition-time), box-shadow var(--transition-time);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  height: 100%;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.logo-section {
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
}

.logo .el-icon {
  margin-right: var(--spacing-sm);
  font-size: 24px;
}

.subtitle {
  font-size: 12px;
  color: var(--text-secondary);
}

.search-section {
  flex: 1;
  max-width: 500px;
  margin: 0 var(--spacing-lg);
}

.search-box {
  width: 100%;
}

.search-input :deep(.el-input__inner) {
  border-radius: var(--border-radius-md);
  background-color: var(--bg-light);
  border-color: var(--border-light);
  color: var(--text-primary);
  transition: all var(--transition-time);
}

.search-input :deep(.el-input__inner):focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.language-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--text-primary);
}

.language-dropdown .el-icon {
  margin-right: var(--spacing-xs);
}

.theme-toggle, .mobile-menu-toggle {
  color: var(--text-primary);
}

.mobile-menu-toggle {
  display: none;
}

.search-results-container {
  position: absolute;
  top: var(--header-height);
  left: 0;
  width: 100%;
  background-color: var(--bg-color);
  box-shadow: var(--box-shadow);
  z-index: 99;
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  transition: all var(--transition-time);
}

.search-results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.search-results-header h2 {
  font-size: 18px;
  margin: 0;
  color: var(--text-primary);
}

.no-results-message {
  margin-top: var(--spacing-lg);
}

.no-results-message p {
  color: var(--text-regular);
  margin-bottom: var(--spacing-sm);
}

.no-results-message ul {
  list-style: disc;
  padding-left: var(--spacing-xl);
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .logo-section {
    flex-shrink: 0;
  }
  
  .search-section {
    display: none;
  }
  
  .language-options {
    display: none;
  }
  
  .mobile-menu-toggle {
    display: block;
  }
  
  .subtitle {
    display: none;
  }
  
  .logo {
    font-size: 18px;
  }
}
</style> 