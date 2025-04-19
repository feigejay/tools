<template>
  <router-link :to="link" class="tool-card">
    <div class="tool-icon">
      <el-icon><component :is="icon" /></el-icon>
    </div>
    <div class="tool-info">
      <h3 class="tool-title">{{ title }}</h3>
      <p v-if="description" class="tool-desc">{{ description }}</p>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  icon: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.tool-card {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  box-shadow: var(--box-shadow);
  transition: all var(--transition-time);
  cursor: pointer;
  text-decoration: none;
  color: var(--text-primary);
}

.tool-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--hover-shadow);
  border-color: var(--primary-light);
}

.tool-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-sm);
  background-color: var(--primary-color);
  color: white;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
}

.tool-icon .el-icon {
  font-size: 24px;
}

.tool-info {
  flex: 1;
}

.tool-title {
  margin: 0 0 var(--spacing-xs);
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  transition: color var(--transition-time);
}

.tool-desc {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  transition: color var(--transition-time);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

@media (max-width: 768px) {
  .tool-card {
    padding: var(--spacing-sm);
  }
  
  .tool-icon {
    width: 40px;
    height: 40px;
  }
  
  .tool-icon .el-icon {
    font-size: 20px;
  }
  
  .tool-title {
    font-size: 15px;
  }
  
  .tool-desc {
    font-size: 13px;
  }
}
</style> 