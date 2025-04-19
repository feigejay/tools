<template>
  <aside class="app-sidebar" :class="{ 'active': isMobileActive }">
    <nav class="category-nav">
      <ul class="category-list">
        <li 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
          :class="{ 'active': activeCategory === category.id }"
          @click="setActiveCategory(category.id)"
        >
          <router-link :to="category.to">
            <el-icon><component :is="category.icon" /></el-icon>
            <span>{{ category.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { ref, onMounted, watch, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { 
  Menu as MenuIcon,
  Timer,
  Odometer,
  Operation,
  Lock,
  Calendar,
  Cpu,
  Document,
  Picture,
  Setting,
  Search,
  DataAnalysis,
  Star,
  Reading,
  VideoPlay,
  DataBoard,
  Connection
} from '@element-plus/icons-vue';

const { t } = useI18n();
const route = useRoute();
const activeCategory = ref('all');
const isMobileActive = inject('isMobileMenuOpen', ref(false));

// 分类列表
const categories = ref([
  { 
    id: 'all', 
    name: t('categories.all'), 
    icon: MenuIcon,
    to: '/'
  },
  { 
    id: 'recent', 
    name: t('categories.recent'), 
    icon: Timer,
    to: '/?category=recent'
  },
  { 
    id: 'calc', 
    name: t('categories.calc'), 
    icon: Odometer,
    to: '/?category=calc'
  },
  { 
    id: 'convert', 
    name: t('categories.convert'), 
    icon: Operation,
    to: '/?category=convert'
  },
  { 
    id: 'encrypt', 
    name: t('categories.encrypt'), 
    icon: Lock,
    to: '/?category=encrypt'
  },
  { 
    id: 'life', 
    name: t('categories.life'), 
    icon: Calendar,
    to: '/?category=life'
  },
  { 
    id: 'develop', 
    name: t('categories.develop'), 
    icon: Cpu,
    to: '/?category=develop'
  },
  { 
    id: 'text', 
    name: t('categories.text'), 
    icon: Document,
    to: '/?category=text'
  },
  { 
    id: 'image', 
    name: t('categories.image'), 
    icon: Picture,
    to: '/?category=image'
  },
  { 
    id: 'format', 
    name: t('categories.format'), 
    icon: Setting,
    to: '/?category=format'
  },
  { 
    id: 'query', 
    name: t('categories.query'), 
    icon: Search,
    to: '/?category=query'
  },
  { 
    id: 'entertainment', 
    name: t('categories.entertainment'), 
    icon: DataAnalysis,
    to: '/?category=entertainment'
  },
  { 
    id: 'health', 
    name: t('categories.health'), 
    icon: Star,
    to: '/?category=health'
  },
  { 
    id: 'education', 
    name: t('categories.education'), 
    icon: Reading,
    to: '/?category=education'
  },
  { 
    id: 'video', 
    name: t('categories.video'), 
    icon: VideoPlay,
    to: '/?category=video'
  },
  { 
    id: 'browser', 
    name: t('categories.browser'), 
    icon: DataBoard,
    to: '/?category=browser'
  },
  { 
    id: 'rpa', 
    name: t('categories.rpa'), 
    icon: Connection,
    to: '/?category=rpa'
  }
]);

// 设置激活分类
const setActiveCategory = (categoryId) => {
  activeCategory.value = categoryId;
  if (window.innerWidth <= 768) {
    isMobileActive.value = false;
  }
};

// 根据路由更新激活分类
const updateActiveCategoryFromRoute = () => {
  const categoryParam = new URLSearchParams(window.location.search).get('category');
  
  if (route.path === '/' && categoryParam) {
    activeCategory.value = categoryParam;
  } else if (route.path === '/') {
    activeCategory.value = 'all';
  } else if (route.path.startsWith('/tools/')) {
    const toolCategory = route.path.split('/')[2];
    activeCategory.value = toolCategory || 'all';
  }
};

// 监听路由变化
watch(() => route.fullPath, updateActiveCategoryFromRoute);

// 组件挂载时初始化
onMounted(() => {
  updateActiveCategoryFromRoute();
});
</script>

<style scoped>
.app-sidebar {
  width: var(--sidebar-width);
  height: 100%;
  background-color: var(--bg-light);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  transition: all var(--transition-time);
  padding-top: var(--spacing-lg);
}

.category-nav {
  padding: 0 var(--spacing-sm);
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  margin-bottom: var(--spacing-xs);
  border-radius: var(--border-radius-md);
  transition: background-color var(--transition-time);
}

.category-item a {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-regular);
  text-decoration: none;
  transition: color var(--transition-time);
}

.category-item a .el-icon {
  margin-right: var(--spacing-md);
  font-size: 18px;
}

.category-item:hover {
  background-color: rgba(45, 140, 240, 0.1);
}

.category-item.active {
  background-color: var(--primary-color);
}

.category-item.active a {
  color: white;
}

@media (max-width: 768px) {
  .app-sidebar {
    position: fixed;
    top: var(--header-height);
    left: -100%;
    z-index: 98;
    box-shadow: var(--box-shadow);
    width: 80%;
    max-width: 300px;
  }
  
  .app-sidebar.active {
    left: 0;
  }
}
</style> 