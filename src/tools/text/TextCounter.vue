<template>
  <div class="text-counter">
    <el-card class="tool-card">
      <template #header>
        <div class="card-header">
          <h2>文本计数器</h2>
        </div>
      </template>
      
      <div class="counter-input">
        <el-input
          v-model="text"
          type="textarea"
          :rows="10"
          placeholder="请输入或粘贴要计数的文本"
          @input="calculateStats"
        ></el-input>
        <div class="input-actions">
          <el-button @click="clearText">清空</el-button>
          <el-button @click="pasteFromClipboard">从剪贴板粘贴</el-button>
        </div>
      </div>
      
      <el-divider></el-divider>
      
      <div class="stats">
        <el-row :gutter="20">
          <el-col :xs="12" :sm="8" :md="6">
            <el-card shadow="hover" class="stat-card">
              <template #header>
                <div class="stat-header">字符数</div>
              </template>
              <div class="stat-value">{{ stats.characters }}</div>
            </el-card>
          </el-col>
          
          <el-col :xs="12" :sm="8" :md="6">
            <el-card shadow="hover" class="stat-card">
              <template #header>
                <div class="stat-header">单词数</div>
              </template>
              <div class="stat-value">{{ stats.words }}</div>
            </el-card>
          </el-col>
          
          <el-col :xs="12" :sm="8" :md="6">
            <el-card shadow="hover" class="stat-card">
              <template #header>
                <div class="stat-header">行数</div>
              </template>
              <div class="stat-value">{{ stats.lines }}</div>
            </el-card>
          </el-col>
          
          <el-col :xs="12" :sm="8" :md="6">
            <el-card shadow="hover" class="stat-card">
              <template #header>
                <div class="stat-header">段落数</div>
              </template>
              <div class="stat-value">{{ stats.paragraphs }}</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <el-divider></el-divider>
      
      <div class="advanced-stats">
        <h3>高级统计</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="stat-item">
              <span class="stat-label">不计空格的字符数：</span>
              <span class="stat-num">{{ stats.charactersNoSpaces }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">中文字符数：</span>
              <span class="stat-num">{{ stats.chineseCharacters }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">英文字符数：</span>
              <span class="stat-num">{{ stats.englishCharacters }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="stat-item">
              <span class="stat-label">数字个数：</span>
              <span class="stat-num">{{ stats.numbers }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">标点符号数：</span>
              <span class="stat-num">{{ stats.punctuation }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">空格数：</span>
              <span class="stat-num">{{ stats.spaces }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <div class="instruction">
        <h3>使用说明</h3>
        <p>在文本框中输入或粘贴任何文本，工具将自动计算统计信息。统计数据会随着文本内容的变化而实时更新。</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

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
  max-width: 900px;
  margin: 0 auto;
}

.tool-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.counter-input {
  margin-bottom: 20px;
}

.input-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.stats {
  margin: 20px 0;
}

.stat-card {
  text-align: center;
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-header {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  padding: 10px 0;
}

.advanced-stats {
  margin: 20px 0;
}

.advanced-stats h3 {
  margin-bottom: 15px;
}

.stat-item {
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 4px;
}

.stat-item:hover {
  background-color: #f5f7fa;
}

.stat-label {
  font-weight: bold;
}

.stat-num {
  color: #409EFF;
}

.instruction {
  margin-top: 30px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.instruction h3 {
  margin-top: 0;
  margin-bottom: 10px;
}
</style> 