<template>
  <div class="tool-container">
    <slot></slot>
  </div>
</template>

<script setup>
// 无需额外功能，仅提供样式和布局容器
</script>

<style>
.tool-container {
  padding: var(--spacing-sm);
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  overflow: auto;
  min-height: 100%;
}

.tool-content {
  margin-top: var(--spacing-sm);
  width: 100%;
  min-height: calc(100vh - var(--header-height) - var(--footer-height) - 80px);
  overflow: visible;
  display: flex;
  flex-direction: column;
}

/* 公共样式：确保图像不会溢出容器 */
.tool-container img {
  max-width: 100%;
  height: auto;
}

/* 工具区块通用样式 */
.tool-section {
  background-color: #fff;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: var(--spacing-sm);
}

.tool-section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--border-light);
}

/* 确保按钮可以在小屏幕上正确显示 */
@media (max-width: 768px) {
  .tool-container .el-button {
    margin: 5px 0;
  }
  
  .tool-content {
    min-height: auto;
  }
}
</style> 