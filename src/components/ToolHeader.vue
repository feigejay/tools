<template>
  <div class="tool-header" :class="{
    'compact-mode': compact, 
    'is-collapsed': collapsed, 
    'ultra-compact': ultraCompact,
    'hidden-mode': hidden
  }" v-if="!hidden">
    <div class="tool-header-main" @click="handleHeaderClick">
      <div class="tool-info">
        <div class="tool-icon" v-if="!compact && !ultraCompact">
          <el-icon><component :is="icon" /></el-icon>
        </div>
        <div class="tool-icon tool-icon-small" v-else-if="compact && !ultraCompact">
          <el-icon><component :is="icon" /></el-icon>
        </div>
        <div class="tool-titles">
          <h1 class="tool-title" :class="{
            'tool-title-compact': compact,
            'tool-title-ultra': ultraCompact
          }">{{ ultraCompact ? shortTitle || title : title }}</h1>
          <p v-if="description && !collapsed && !ultraCompact" class="tool-description">{{ description }}</p>
        </div>
      </div>
      <div class="tool-actions">
        <slot name="actions"></slot>
        <el-button v-if="collapsible" type="text" class="collapse-btn" @click.stop="toggleCollapse">
          <el-icon><component :is="collapsed ? 'ArrowDown' : 'ArrowUp'" /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  shortTitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: [String, Object],
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  },
  ultraCompact: {
    type: Boolean,
    default: false
  },
  hidden: {
    type: Boolean,
    default: false
  },
  collapsible: {
    type: Boolean,
    default: false
  },
  defaultCollapsed: {
    type: Boolean,
    default: false
  }
});

const collapsed = ref(props.defaultCollapsed);

const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
};

const handleHeaderClick = () => {
  if (props.collapsible) {
    toggleCollapse();
  }
};
</script>

<style scoped>
.tool-header {
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.tool-header-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  transition: border-color var(--transition-time), padding 0.3s ease;
  cursor: default;
}

.collapsible .tool-header-main {
  cursor: pointer;
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
  transition: all 0.3s ease;
}

.tool-icon-small {
  width: 40px;
  height: 40px;
  margin-right: var(--spacing-md);
}

.tool-icon .el-icon {
  font-size: 28px;
  transition: font-size 0.3s ease;
}

.tool-icon-small .el-icon {
  font-size: 20px;
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
  transition: all var(--transition-time);
}

.tool-title-compact {
  font-size: 18px;
  margin: 0;
}

.tool-title-ultra {
  font-size: 16px;
  margin: 0;
  font-weight: 500;
  opacity: 0.7;
}

.tool-description {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
  transition: all var(--transition-time);
}

.tool-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.collapse-btn {
  padding: 4px;
}

/* 折叠状态样式 */
.is-collapsed {
  min-height: auto;
}

.is-collapsed .tool-header-main {
  padding-bottom: var(--spacing-sm);
}

.compact-mode .tool-header-main {
  padding-bottom: var(--spacing-sm);
}

.ultra-compact .tool-header-main {
  padding: var(--spacing-xs) 0;
  border-bottom: none;
  margin-bottom: var(--spacing-xs);
}

.hidden-mode {
  display: none;
}

@media (max-width: 768px) {
  .tool-header-main {
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
  
  .compact-mode .tool-header-main, .ultra-compact .tool-header-main {
    flex-direction: row;
    align-items: center;
  }
  
  .compact-mode .tool-actions, .ultra-compact .tool-actions {
    margin-top: 0;
    width: auto;
  }
}
</style> 