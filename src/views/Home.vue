<template>
  <div class="home-container">
    <!-- 统计信息 -->
    <div class="tools-stats">
      <div class="stats-text">{{ $t('home.toolsCount') }} <span class="highlight">100+</span> {{ $t('home.toolsCountUnit') }}</div>
      <div class="stats-text">{{ $t('home.usageCount') }} <span class="highlight">666,666,666+</span> {{ $t('home.usageCountUnit') }}</div>
    </div>

    <!-- 热门工具区域 -->
    <div class="hot-tools-section">
      <h2 class="section-title">
        <el-icon><Star /></el-icon>
        {{ $t('home.hotTools') }}
      </h2>
      <div class="tools-grid">
        <tool-card 
          v-for="tool in hotTools" 
          :key="tool.id"
          :icon="tool.icon"
          :title="tool.title"
          :description="tool.description"
          :link="tool.link"
        />
      </div>
    </div>

    <!-- 按分类展示工具 -->
    <div 
      v-for="category in categories" 
      :key="category.id"
      class="tools-section"
      :id="category.id"
    >
      <h2 class="section-title">
        <el-icon><component :is="category.icon" /></el-icon>
        {{ category.title }}
      </h2>
      <div class="tools-grid">
        <tool-card 
          v-for="tool in category.tools" 
          :key="tool.id"
          :icon="tool.icon"
          :title="tool.title"
          :description="tool.description"
          :link="tool.link"
        />
      </div>
    </div>

    <!-- 站长介绍区域 -->
    <div class="creator-section">
      <h2 class="section-title">{{ $t('home.creatorTitle') }}</h2>
      <div class="creator-profile">
        <div class="creator-avatar">
          <el-avatar :size="64" :icon="User" />
        </div>
        <div class="creator-info">
          <h3 class="creator-name">码农飞哥</h3>
          <p class="creator-desc">{{ $t('home.creatorDesc') }}</p>
          <div class="creator-links">
            <el-button type="primary" link>{{ $t('home.personalBlog') }}</el-button>
            <el-button type="primary" link>{{ $t('home.zhihu') }}</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ToolCard from '../components/ToolCard.vue';
import { Star, Picture, Document, Setting, Edit, Link, User } from '@element-plus/icons-vue';

const { t } = useI18n();

// 热门工具列表
const hotTools = ref([
  {
    id: 'image-compressor',
    icon: Picture,
    title: t('tools.imageCompressor.title'),
    description: t('tools.imageCompressor.desc'),
    link: '/tools/image/image-compressor'
  },
  {
    id: 'markdown-to-html',
    icon: Document,
    title: t('tools.markdownToHtml.title'),
    description: t('tools.markdownToHtml.desc'),
    link: '/tools/text/markdown-to-html'
  },
  {
    id: 'json-formatter',
    icon: Setting,
    title: t('tools.jsonFormatter.title'),
    description: t('tools.jsonFormatter.desc'),
    link: '/tools/format/json-formatter'
  },
  {
    id: 'text-counter',
    icon: Edit,
    title: t('tools.textCounter.title'),
    description: t('tools.textCounter.desc'),
    link: '/tools/text/text-counter'
  },
  {
    id: 'image-watermark-remover',
    icon: Picture,
    title: t('tools.watermarkRemover.title'),
    description: t('tools.watermarkRemover.desc'),
    link: '/tools/image/image-watermark-remover'
  }
]);

// 分类和工具
const categories = ref([
  {
    id: 'image',
    title: t('categories.image'),
    icon: Picture,
    tools: [
      {
        id: 'image-compressor',
        icon: Picture,
        title: t('tools.imageCompressor.title'),
        description: t('tools.imageCompressor.desc'),
        link: '/tools/image/image-compressor'
      },
      {
        id: 'image-watermark-remover',
        icon: Picture,
        title: t('tools.watermarkRemover.title'),
        description: t('tools.watermarkRemover.desc'),
        link: '/tools/image/image-watermark-remover'
      }
    ]
  },
  {
    id: 'text',
    title: t('categories.text'),
    icon: Document,
    tools: [
      {
        id: 'markdown-to-html',
        icon: Document,
        title: t('tools.markdownToHtml.title'),
        description: t('tools.markdownToHtml.desc'),
        link: '/tools/text/markdown-to-html'
      },
      {
        id: 'text-counter',
        icon: Edit,
        title: t('tools.textCounter.title'),
        description: t('tools.textCounter.desc'),
        link: '/tools/text/text-counter'
      }
    ]
  },
  {
    id: 'format',
    title: t('categories.format'),
    icon: Setting,
    tools: [
      {
        id: 'json-formatter',
        icon: Setting,
        title: t('tools.jsonFormatter.title'),
        description: t('tools.jsonFormatter.desc'),
        link: '/tools/format/json-formatter'
      }
    ]
  }
]);
</script>

<style scoped>
.home-container {
  padding: var(--spacing-lg);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.tools-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background-color: var(--bg-light);
  border-radius: var(--border-radius-md);
  transition: background-color var(--transition-time);
}

.stats-text {
  font-size: 18px;
  color: var(--text-primary);
  transition: color var(--transition-time);
}

.highlight {
  color: var(--primary-color);
  font-weight: 600;
  transition: color var(--transition-time);
}

.hot-tools-section,
.tools-section {
  margin-bottom: var(--spacing-xl);
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 20px;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
  transition: color var(--transition-time);
}

.section-title .el-icon {
  margin-right: var(--spacing-sm);
  color: var(--primary-color);
  transition: color var(--transition-time);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.creator-section {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background-color: var(--bg-light);
  border-radius: var(--border-radius-md);
  transition: background-color var(--transition-time);
}

.creator-profile {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.creator-avatar {
  flex-shrink: 0;
}

.creator-info {
  flex-grow: 1;
}

.creator-name {
  font-size: 18px;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
  transition: color var(--transition-time);
}

.creator-desc {
  margin-bottom: var(--spacing-md);
  color: var(--text-regular);
  transition: color var(--transition-time);
}

.creator-links {
  display: flex;
  gap: var(--spacing-md);
}

@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
  
  .creator-profile {
    flex-direction: column;
    text-align: center;
  }
  
  .section-title {
    font-size: 18px;
  }
}
</style> 