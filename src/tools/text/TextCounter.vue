<template>
  <tool-container>
    <div class="text-counter">
      <div class="tool-content">
        <div class="integrated-layout">
          <!-- 左侧输入面板 -->
          <div class="left-panel">
            <div class="section-title">
              文本输入
              <div class="input-actions">
                <el-button size="small" @click="pasteFromClipboard">粘贴</el-button>
                <el-button size="small" @click="clearText">清空</el-button>
              </div>
            </div>
            
            <el-input
              v-model="text"
              type="textarea"
              :rows="14"
              placeholder="请输入或粘贴要计数的文本"
              @input="calculateStats"
              class="text-input"
            ></el-input>
            
            <!-- 基础统计信息 - 紧凑展示 -->
            <div class="compact-stats">
              <span class="stat-item-inline">
                <span class="stat-label">字符:</span>
                <span class="stat-value">{{ stats.characters }}</span>
              </span>
              
              <span class="stat-divider">|</span>
              
              <span class="stat-item-inline">
                <span class="stat-label">单词:</span>
                <span class="stat-value">{{ stats.words }}</span>
              </span>
              
              <span class="stat-divider">|</span>
              
              <span class="stat-item-inline">
                <span class="stat-label">行数:</span>
                <span class="stat-value">{{ stats.lines }}</span>
              </span>
              
              <span class="stat-divider">|</span>
              
              <span class="stat-item-inline">
                <span class="stat-label">段落:</span>
                <span class="stat-value">{{ stats.paragraphs }}</span>
              </span>
            </div>
          </div>
          
          <!-- 右侧统计面板 -->
          <div class="right-panel">
            <div class="section-title">详细统计</div>
            
            <div class="stats-container">
              <!-- 字符分类统计 -->
              <div class="stats-section">
                <div class="stats-section-title">字符分类</div>
                <div class="stats-grid">
                  <div class="detail-stat-item">
                    <div class="detail-stat-header">
                      <span class="detail-stat-icon">文</span>
                      <span class="detail-stat-label">中文字符</span>
                    </div>
                    <div class="detail-stat-value">{{ stats.chineseCharacters }}</div>
                  </div>
                  
                  <div class="detail-stat-item">
                    <div class="detail-stat-header">
                      <span class="detail-stat-icon">Aa</span>
                      <span class="detail-stat-label">英文字符</span>
                    </div>
                    <div class="detail-stat-value">{{ stats.englishCharacters }}</div>
                  </div>
                  
                  <div class="detail-stat-item">
                    <div class="detail-stat-header">
                      <span class="detail-stat-icon">123</span>
                      <span class="detail-stat-label">数字</span>
                    </div>
                    <div class="detail-stat-value">{{ stats.numbers }}</div>
                  </div>
                  
                  <div class="detail-stat-item">
                    <div class="detail-stat-header">
                      <span class="detail-stat-icon">,.!</span>
                      <span class="detail-stat-label">标点符号</span>
                    </div>
                    <div class="detail-stat-value">{{ stats.punctuation }}</div>
                  </div>
                </div>
              </div>
              
              <!-- 空格和其他统计 -->
              <div class="stats-section">
                <div class="stats-section-title">其他统计</div>
                <div class="stats-grid">
                  <div class="detail-stat-item">
                    <div class="detail-stat-header">
                      <span class="detail-stat-icon">□</span>
                      <span class="detail-stat-label">空格</span>
                    </div>
                    <div class="detail-stat-value">{{ stats.spaces }}</div>
                  </div>
                  
                  <div class="detail-stat-item">
                    <div class="detail-stat-header">
                      <span class="detail-stat-icon">Σ</span>
                      <span class="detail-stat-label">不含空格字符</span>
                    </div>
                    <div class="detail-stat-value">{{ stats.charactersNoSpaces }}</div>
                  </div>
                  
                  <div class="detail-stat-item">
                    <div class="detail-stat-header">
                      <span class="detail-stat-icon">%</span>
                      <span class="detail-stat-label">中文比例</span>
                    </div>
                    <div class="detail-stat-value">{{ calculateChinesePercentage() }}%</div>
                  </div>
                  
                  <div class="detail-stat-item">
                    <div class="detail-stat-header">
                      <span class="detail-stat-icon">≈</span>
                      <span class="detail-stat-label">平均行长</span>
                    </div>
                    <div class="detail-stat-value">{{ calculateAverageLineLength() }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </tool-container>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Document } from '@element-plus/icons-vue';
import ToolContainer from '../../components/ToolContainer.vue';
import ToolHeader from '../../components/ToolHeader.vue';

const text = ref('');
const stats = reactive({
  characters: 0,
  charactersNoSpaces: 0,
  words: 0,
  lines: 0,
  paragraphs: 0,
  chineseCharacters: 0,
  englishCharacters: 0,
  numbers: 0,
  punctuation: 0,
  spaces: 0
});

// 计算统计信息
const calculateStats = () => {
  const content = text.value || '';
  
  // 基础统计
  stats.characters = content.length;
  stats.charactersNoSpaces = content.replace(/\s/g, '').length;
  stats.words = content.trim() ? content.trim().split(/\s+/).length : 0;
  stats.lines = content ? content.split(/\r\n|\r|\n/).length : 0;
  stats.paragraphs = content ? content.split(/\r\n\r\n|\r\r|\n\n/).filter(p => p.trim().length > 0).length : 0;
  
  // 高级统计
  stats.chineseCharacters = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
  stats.englishCharacters = (content.match(/[a-zA-Z]/g) || []).length;
  stats.numbers = (content.match(/[0-9]/g) || []).length;
  stats.punctuation = (content.match(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g) || []).length;
  stats.spaces = (content.match(/\s/g) || []).length;
};

// 计算中文字符百分比
const calculateChinesePercentage = () => {
  if (stats.characters === 0) return 0;
  return ((stats.chineseCharacters / stats.characters) * 100).toFixed(1);
};

// 计算平均行长度
const calculateAverageLineLength = () => {
  if (stats.lines === 0) return 0;
  return (stats.characters / stats.lines).toFixed(1);
};

// 清空文本
const clearText = () => {
  text.value = '';
  calculateStats();
};

// 从剪贴板粘贴
const pasteFromClipboard = async () => {
  try {
    const clipboardText = await navigator.clipboard.readText();
    text.value = clipboardText;
    calculateStats();
    ElMessage.success('已从剪贴板粘贴文本');
  } catch (error) {
    ElMessage.error('无法从剪贴板读取：' + error.message);
  }
};

// 初始计算
calculateStats();
</script>

<style scoped>
.text-counter {
  width: 100%;
}

.integrated-layout {
  display: flex;
  gap: var(--spacing-md);
  width: 100%;
}

.left-panel {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.right-panel {
  flex: 1;
  min-width: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #303133;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-actions {
  display: flex;
  gap: 5px;
}

.text-input {
  flex: 1;
  font-family: monospace;
  font-size: 14px;
}

.compact-stats {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 4px 0;
  font-size: 12px;
  margin-top: 8px;
  background-color: #f0f9eb;
  border-radius: 4px;
  padding: 6px 8px;
}

.stat-item-inline {
  display: flex;
  gap: 3px;
}

.stat-divider {
  color: #c0c4cc;
  margin: 0 4px;
}

.stat-label {
  color: #606266;
}

.stat-value {
  font-weight: 600;
  color: #67c23a;
}

.stats-container {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #ebeef5;
}

.stats-section {
  padding: 12px;
  border-bottom: 1px solid #ebeef5;
}

.stats-section:last-child {
  border-bottom: none;
}

.stats-section-title {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.detail-stat-item {
  background-color: #f8f9ff;
  border-radius: 6px;
  padding: 10px;
}

.detail-stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.detail-stat-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  background-color: #ecf5ff;
  color: #409EFF;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.detail-stat-label {
  font-size: 13px;
  color: #606266;
}

.detail-stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #409EFF;
}

@media (max-width: 992px) {
  .integrated-layout {
    flex-direction: column;
  }
  
  .left-panel,
  .right-panel {
    width: 100%;
  }
  
  .left-panel {
    margin-bottom: var(--spacing-md);
  }
  
  .text-input {
    height: 180px;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style> 