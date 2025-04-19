<template>
  <div class="tool-header">
    <div class="tool-info">
      <div class="tool-icon">
        <el-icon><component :is="icon" /></el-icon>
      </div>
      <div class="tool-titles">
        <h1 class="tool-title">{{ title }}</h1>
        <p v-if="description" class="tool-description">{{ description }}</p>
      </div>
    </div>
    <div class="tool-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: [String, Object],
    required: true
  }
});
</script>

<style scoped>
.tool-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  transition: border-color var(--transition-time);
}

.tool-info {
  display: flex;
  align-items: center;
}

.tool-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--border-radius-sm);
  background-color: var(--primary-color);
  color: white;
  margin-right: var(--spacing-lg);
  flex-shrink: 0;
}

.tool-icon .el-icon {
  font-size: 28px;
}

.tool-titles {
  display: flex;
  flex-direction: column;
}

.tool-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 var(--spacing-xs);
  color: var(--text-primary);
  transition: color var(--transition-time);
}

.tool-description {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
  transition: color var(--transition-time);
}

.tool-actions {
  display: flex;
  gap: var(--spacing-md);
}

@media (max-width: 768px) {
  .tool-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .tool-actions {
    margin-top: var(--spacing-md);
    width: 100%;
    justify-content: flex-end;
  }
  
  .tool-icon {
    width: 48px;
    height: 48px;
  }
  
  .tool-icon .el-icon {
    font-size: 24px;
  }
  
  .tool-title {
    font-size: 20px;
  }
  
  .tool-description {
    font-size: 14px;
  }
}
</style> 