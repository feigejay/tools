<template>
  <div class="markdown-tool">
    <el-card class="tool-card">
      <template #header>
        <div class="card-header">
          <h2>Markdown转HTML工具</h2>
        </div>
      </template>
      
      <el-row :gutter="20">
        <!-- 左侧Markdown输入 -->
        <el-col :span="12">
          <div class="editor-container">
            <div class="editor-header">
              <span>Markdown</span>
              <div class="editor-actions">
                <el-button size="small" @click="clearInput">清空</el-button>
                <el-button size="small" @click="insertTemplate">插入示例</el-button>
              </div>
            </div>
            <el-input
              v-model="markdownText"
              type="textarea"
              :rows="15"
              placeholder="请输入Markdown内容"
              @input="convertToHtml"
            ></el-input>
          </div>
        </el-col>
        
        <!-- 右侧HTML预览 -->
        <el-col :span="12">
          <div class="preview-container">
            <div class="preview-header">
              <span>HTML预览</span>
              <div class="preview-actions">
                <el-button size="small" type="primary" @click="copyHtml">复制HTML</el-button>
              </div>
            </div>
            <div class="preview-content" v-html="htmlOutput"></div>
          </div>
        </el-col>
      </el-row>
      
      <el-divider></el-divider>
      
      <div class="html-code">
        <div class="code-header">
          <span>HTML代码</span>
          <el-button size="small" type="primary" @click="copyHtml">复制HTML</el-button>
        </div>
        <el-input
          v-model="htmlCode"
          type="textarea"
          :rows="8"
          readonly
          placeholder="转换后的HTML代码将显示在这里"
        ></el-input>
      </div>
      
      <div class="instruction">
        <h3>使用说明</h3>
        <ol>
          <li>在左侧输入或粘贴Markdown文本</li>
          <li>右侧会实时显示转换后的HTML效果预览</li>
          <li>底部文本框显示实际HTML代码，可以复制使用</li>
        </ol>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

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
</script>

<style scoped>
.markdown-tool {
  max-width: 1200px;
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

.editor-container, .preview-container {
  height: 100%;
  margin-bottom: 20px;
}

.editor-header, .preview-header, .code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: bold;
}

.editor-actions, .preview-actions {
  display: flex;
  gap: 10px;
}

.preview-content {
  height: 360px;
  overflow: auto;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
}

.html-code {
  margin-top: 20px;
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

.instruction ol {
  padding-left: 20px;
}

.instruction li {
  margin-bottom: 8px;
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
</style> 