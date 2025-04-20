<template>
  <tool-container>
    <div class="markdown-tool">
      <div class="tool-content">
        <div class="integrated-layout">
          <!-- 左侧 Markdown 输入区 -->
          <div class="left-panel">
            <div class="section-title">
              Markdown 输入
              <div class="input-actions">
                <el-button size="small" @click="insertTemplate">示例</el-button>
                <el-button size="small" @click="clearInput">清空</el-button>
              </div>
            </div>
            
            <el-input
              v-model="markdownText"
              type="textarea"
              :rows="15"
              placeholder="请输入 Markdown 内容"
              @input="convertToHtml"
              class="md-input"
            ></el-input>
            
            <!-- 语法提示 -->
            <div class="markdown-tips">
              <div class="md-hint-title">常用语法提示</div>
              <div class="hint-items">
                <span class="md-hint-item" @click="insertSyntax('# 标题')">H1</span>
                <span class="md-hint-item" @click="insertSyntax('## 二级标题')">H2</span>
                <span class="md-hint-item" @click="insertSyntax('**粗体**')">粗体</span>
                <span class="md-hint-item" @click="insertSyntax('*斜体*')">斜体</span>
                <span class="md-hint-item" @click="insertSyntax('[链接](https://example.com)')">链接</span>
                <span class="md-hint-item" @click="insertSyntax('![图片](https://example.com/image.jpg)')">图片</span>
                <span class="md-hint-item" @click="insertSyntax('- 列表项\n- 列表项')">列表</span>
                <span class="md-hint-item" @click="insertSyntax('1. 有序项\n2. 有序项')">有序</span>
                <span class="md-hint-item" @click="insertSyntax('`行内代码`')">代码</span>
                <span class="md-hint-item" @click="insertSyntax('```\n代码块\n```')">代码块</span>
              </div>
            </div>
          </div>
          
          <!-- 右侧预览区 -->
          <div class="right-panel">
            <div class="section-title">
              HTML 预览
              <div class="preview-actions">
                <el-tooltip content="切换预览主题" placement="top">
                  <el-button size="small" @click="toggleTheme">{{ theme === 'light' ? '暗色' : '亮色' }}</el-button>
                </el-tooltip>
                <el-button size="small" type="primary" @click="copyHtml">复制 HTML</el-button>
              </div>
            </div>
            
            <div class="preview-tabs">
              <div class="tab-header">
                <div 
                  class="tab-item" 
                  :class="{ active: activeTab === 'preview' }" 
                  @click="activeTab = 'preview'"
                >预览效果</div>
                <div 
                  class="tab-item" 
                  :class="{ active: activeTab === 'code' }" 
                  @click="activeTab = 'code'"
                >HTML 代码</div>
              </div>
              
              <div class="tab-content">
                <!-- 预览效果 -->
                <div 
                  v-show="activeTab === 'preview'" 
                  class="preview-content" 
                  :class="{'preview-dark': theme === 'dark'}"
                  v-html="htmlOutput"
                ></div>
                
                <!-- HTML代码 -->
                <div v-show="activeTab === 'code'" class="code-content">
                  <pre class="html-code">{{ htmlCode }}</pre>
                </div>
              </div>
            </div>
            
            <!-- 转换统计信息 -->
            <div class="markdown-stats">
              <span class="stat-item-inline">
                <span class="stat-label">字符:</span>
                <span class="stat-value">{{ markdownText.length }}</span>
              </span>
              
              <span class="stat-divider">|</span>
              
              <span class="stat-item-inline">
                <span class="stat-label">标题:</span>
                <span class="stat-value">{{ countMarkdownElements('heading') }}</span>
              </span>
              
              <span class="stat-divider">|</span>
              
              <span class="stat-item-inline">
                <span class="stat-label">链接:</span>
                <span class="stat-value">{{ countMarkdownElements('link') }}</span>
              </span>
              
              <span class="stat-divider">|</span>
              
              <span class="stat-item-inline">
                <span class="stat-label">图片:</span>
                <span class="stat-value">{{ countMarkdownElements('image') }}</span>
              </span>
              
              <span class="stat-divider">|</span>
              
              <span class="stat-item-inline">
                <span class="stat-label">代码块:</span>
                <span class="stat-value">{{ countMarkdownElements('codeBlock') }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </tool-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import ToolContainer from '../../components/ToolContainer.vue';

// 创建markdown-it实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ''; // 使用默认样式
  }
});

const markdownText = ref('');
const htmlOutput = ref('');
const htmlCode = ref('');
const activeTab = ref('preview'); // 默认显示预览标签
const theme = ref('light'); // 默认亮色主题

// 切换主题
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};

// 初始化
onMounted(() => {
  insertTemplate();
});

// 转换Markdown到HTML
const convertToHtml = () => {
  if (!markdownText.value) {
    htmlOutput.value = '';
    htmlCode.value = '';
    return;
  }
  
  try {
    const result = md.render(markdownText.value);
    htmlOutput.value = result;
    htmlCode.value = result;
  } catch (error) {
    ElMessage.error('转换出错: ' + error.message);
  }
};

// 清空输入
const clearInput = () => {
  markdownText.value = '';
  convertToHtml();
};

// 在光标位置插入语法
const insertSyntax = (syntax) => {
  const textarea = document.querySelector('.md-input textarea');
  if (!textarea) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = markdownText.value;
  
  markdownText.value = text.substring(0, start) + syntax + text.substring(end);
  
  // 转换更新
  convertToHtml();
  
  // 聚焦并将光标移到插入内容之后
  setTimeout(() => {
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + syntax.length;
  }, 0);
};

// 插入示例模板
const insertTemplate = () => {
  markdownText.value = `# Markdown示例

## 标题和段落

这是一个**粗体文本**和*斜体文本*的例子。

## 列表

### 无序列表
- 项目1
- 项目2
- 项目3

### 有序列表
1. 第一项
2. 第二项
3. 第三项

## 链接和图片

[百度](https://www.baidu.com)

![示例图片](https://via.placeholder.com/150)

## 代码块

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

## 表格

| 名称 | 价格 |
| ---- | ---- |
| 商品1 | ¥100 |
| 商品2 | ¥200 |
`;
  convertToHtml();
};

// 复制HTML代码
const copyHtml = () => {
  if (!htmlCode.value) {
    ElMessage.warning('没有可复制的HTML代码');
    return;
  }
  
  navigator.clipboard.writeText(htmlCode.value)
    .then(() => {
      ElMessage.success('HTML代码已复制到剪贴板');
    })
    .catch(err => {
      ElMessage.error('复制失败: ' + err.message);
    });
};

// 统计Markdown元素数量
const countMarkdownElements = (type) => {
  const text = markdownText.value;
  if (!text) return 0;
  
  switch (type) {
    case 'heading':
      return (text.match(/^#{1,6}\s/gm) || []).length;
    case 'link':
      return (text.match(/\[.*?\]\(.*?\)/g) || []).length;
    case 'image':
      return (text.match(/!\[.*?\]\(.*?\)/g) || []).length;
    case 'codeBlock':
      return (text.match(/```[\s\S]*?```/g) || []).length;
    default:
      return 0;
  }
};
</script>

<style scoped>
.markdown-tool {
  width: 100%;
}

.integrated-layout {
  display: flex;
  gap: var(--spacing-md);
  width: 100%;
  height: calc(100vh - 150px);
}

.left-panel {
  width: 45%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.right-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
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

.input-actions, .preview-actions {
  display: flex;
  gap: 5px;
}

.md-input {
  flex: 1;
  font-family: monospace;
  font-size: 14px;
}

.preview-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.tab-header {
  display: flex;
  background-color: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
}

.tab-item {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 13px;
  color: #606266;
  border-right: 1px solid #dcdfe6;
}

.tab-item.active {
  color: #409EFF;
  background-color: #fff;
  font-weight: 500;
}

.tab-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.preview-content, .code-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 12px;
  box-sizing: border-box;
}

.preview-content {
  background-color: #fff;
}

.preview-dark {
  background-color: #282c34;
  color: #abb2bf;
}

.preview-dark :deep(h1),
.preview-dark :deep(h2),
.preview-dark :deep(h3) {
  color: #e06c75;
}

.preview-dark :deep(a) {
  color: #61afef;
}

.preview-dark :deep(code) {
  background-color: #3e4451;
  color: #98c379;
}

.html-code {
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.markdown-tips {
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;
  background-color: #f5f7fa;
}

.md-hint-title {
  font-size: 12px;
  margin-bottom: 6px;
  color: #606266;
}

.hint-items {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.md-hint-item {
  display: inline-block;
  padding: 2px 6px;
  background-color: #ecf5ff;
  color: #409EFF;
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.md-hint-item:hover {
  background-color: #409EFF;
  color: #fff;
}

/* Markdown 统计信息 */
.markdown-stats {
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

/* Markdown渲染样式 */
:deep(.preview-content) {
  line-height: 1.6;
}

:deep(.preview-content h1) {
  font-size: 2em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

:deep(.preview-content h2) {
  font-size: 1.5em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

:deep(.preview-content pre) {
  background-color: #f6f8fa;
  padding: 16px;
  overflow: auto;
  border-radius: 6px;
}

:deep(.preview-content code) {
  font-family: monospace;
}

:deep(.preview-content table) {
  border-collapse: collapse;
  width: 100%;
}

:deep(.preview-content th), :deep(.preview-content td) {
  border: 1px solid #ddd;
  padding: 8px;
}

:deep(.preview-content th) {
  background-color: #f2f2f2;
}

@media (max-width: 992px) {
  .integrated-layout {
    flex-direction: column;
    height: auto;
  }
  
  .left-panel,
  .right-panel {
    width: 100%;
  }
  
  .left-panel {
    margin-bottom: var(--spacing-md);
  }
  
  .md-input {
    height: 180px;
  }
  
  .preview-tabs {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .hint-items {
    gap: 4px;
  }
  
  .md-hint-item {
    padding: 2px 4px;
    font-size: 11px;
  }
}
</style> 