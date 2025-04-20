<template>
  <tool-container>
    <div class="json-formatter">
      <div class="tool-content">
        <el-tabs v-model="activeTab" class="tool-tabs">
          <el-tab-pane label="格式化" name="format">
            <div class="integrated-layout">
              <!-- 左侧输入区 -->
              <div class="left-panel">
                <div class="input-section">
                  <div class="section-title">
                    输入JSON
                    <div class="input-actions">
                      <el-button size="small" @click="pasteFromClipboard">粘贴</el-button>
                      <el-button size="small" @click="loadSampleData">示例</el-button>
                      <el-button size="small" @click="clearInput">清空</el-button>
                    </div>
                  </div>
                  
                  <el-input
                    v-model="inputJson"
                    type="textarea"
                    :rows="10"
                    placeholder="请输入或粘贴JSON文本，自动格式化"
                    class="json-input"
                    :class="{ 'invalid-json': !isValidJson && inputJson }"
                    @focus="autoFormatOnFocus"
                  ></el-input>
                  
                  <div class="format-options">
                    <div class="option-row">
                      <span class="option-label-compact">缩进:</span>
                      <el-select v-model="indentSize" size="small" class="format-select-compact">
                        <el-option label="2 空格" :value="2"></el-option>
                        <el-option label="4 空格" :value="4"></el-option>
                        <el-option label="8 空格" :value="8"></el-option>
                      </el-select>
                    </div>
                    
                    <div class="actions-row">
                      <el-button type="primary" size="small" @click="formatJson" :disabled="!inputJson.trim()">格式化</el-button>
                      <el-button type="success" size="small" @click="copyToClipboard" :disabled="!formattedJson">复制结果</el-button>
                    </div>
                  </div>
                  
                  <!-- JSON状态信息 -->
                  <div v-if="formattedJson && isValidJson" class="json-stats">
                    <span class="stat-item-inline">
                      <span class="stat-label">字符数:</span>
                      <span class="stat-value">{{ inputJson.length }}</span>
                    </span>
                    
                    <span class="stat-divider">|</span>
                    
                    <span class="stat-item-inline">
                      <span class="stat-label">节点数:</span>
                      <span class="stat-value">{{ countJsonNodes() }}</span>
                    </span>
                    
                    <span class="stat-divider">|</span>
                    
                    <span class="stat-item-inline">
                      <span class="stat-label">格式:</span>
                      <span class="stat-value">有效</span>
                    </span>
                  </div>
                  <div v-else-if="inputJson && !isValidJson" class="json-stats error">
                    <span class="stat-error">JSON格式无效，请检查输入</span>
                  </div>
                </div>
              </div>
              
              <!-- 右侧结果区 -->
              <div class="right-panel" ref="previewSection">
                <div class="output-section">
                  <div class="section-title">
                    格式化结果
                    <el-button type="primary" size="small" @click="copyToClipboard" :disabled="!formattedJson">复制</el-button>
                  </div>
                  
                  <div class="output-container" ref="outputContainer">
                    <pre class="json-output"><code>{{ formattedJson }}</code></pre>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="JSON编辑器" name="editor">
            <div class="json-editor-container">
              <div class="json-editor-wrapper" ref="jsonEditorContainer">
                <!-- JsonEditor将在此处挂载 -->
              </div>
              <div class="editor-actions">
                <el-button size="small" @click="getEditorJson">更新至文本区</el-button>
                <el-button type="primary" size="small" @click="copyEditorJson">复制JSON</el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </tool-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { ElMessage } from 'element-plus';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';
import ToolContainer from '../../components/ToolContainer.vue';

// 响应式数据
const inputJson = ref('');
const formattedJson = ref('');
const indentSize = ref(2);
const activeTab = ref('format');
const outputContainer = ref(null);
const jsonEditorContainer = ref(null);
const isValidJson = ref(true);
const debounceTimeout = ref(null);
const previewSection = ref(null);

// JSONEditor实例
let jsonEditor = null;

// 自动格式化触发条件之一：获得焦点且有内容时
const autoFormatOnFocus = () => {
  if (inputJson.value.trim() && !formattedJson.value) {
    formatJson();
  }
};

// 监听输入变化，自动格式化
watch(inputJson, (newValue) => {
  // 如果为空，清空格式化结果
  if (!newValue.trim()) {
    formattedJson.value = '';
    isValidJson.value = true;
    return;
  }
  
  // 防抖处理，避免连续输入时频繁格式化
  clearTimeout(debounceTimeout.value);
  debounceTimeout.value = setTimeout(() => {
    try {
      const jsonObj = JSON.parse(newValue);
      formattedJson.value = JSON.stringify(jsonObj, null, indentSize.value);
      isValidJson.value = true;
      
      // 滚动到预览区
      scrollToPreview();
    } catch (e) {
      // 不显示错误提示，只标记无效状态
      isValidJson.value = false;
    }
  }, 300); // 缩短防抖时间，让响应更快
});

// 监听缩进大小变化，重新格式化
watch(indentSize, () => {
  if (formattedJson.value) {
    try {
      const jsonObj = JSON.parse(inputJson.value);
      formattedJson.value = JSON.stringify(jsonObj, null, indentSize.value);
    } catch (e) {
      // 忽略错误
    }
  }
});

// 监听标签页变化
watch(activeTab, (newVal) => {
  if (newVal === 'editor' && jsonEditor && inputJson.value) {
    try {
      // 尝试将当前输入的JSON传递给编辑器
      const jsonData = JSON.parse(inputJson.value);
      jsonEditor.set(jsonData);
    } catch (e) {
      // 如果解析失败，显示一个空对象
      jsonEditor.set({});
    }
  }
});

// 滚动到预览区域
const scrollToPreview = () => {
  setTimeout(() => {
    if (previewSection.value && window.innerWidth < 992) {
      previewSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 300);
};

// 统计JSON节点数量
const countJsonNodes = () => {
  try {
    if (!inputJson.value) return 0;
    const json = JSON.parse(inputJson.value);
    
    // 递归计算节点数
    const countNodes = (obj) => {
      if (obj === null) return 1;
      if (typeof obj !== 'object') return 1;
      
      let count = 1; // 当前节点
      
      if (Array.isArray(obj)) {
        // 数组
        obj.forEach(item => {
          count += countNodes(item);
        });
      } else {
        // 对象
        Object.keys(obj).forEach(key => {
          count += countNodes(obj[key]);
        });
      }
      
      return count;
    };
    
    return countNodes(json);
  } catch (e) {
    return 0;
  }
};

// 初始化JSON编辑器
onMounted(() => {
  if (jsonEditorContainer.value) {
    const options = {
      mode: 'tree',
      modes: ['tree', 'code', 'form', 'text', 'view'],
      onChangeJSON: function(json) {
        try {
          inputJson.value = JSON.stringify(json, null, indentSize.value);
          formattedJson.value = JSON.stringify(json, null, indentSize.value);
        } catch (e) {
          // 忽略错误
        }
      }
    };
    
    jsonEditor = new JSONEditor(jsonEditorContainer.value, options);
    jsonEditor.set({});
    
    // 自动加载示例数据，便于用户快速了解工具
    if (!inputJson.value) {
      loadSampleData();
    }
  }
});

// 销毁编辑器
onBeforeUnmount(() => {
  if (jsonEditor) {
    jsonEditor.destroy();
  }
});

// 手动格式化JSON
const formatJson = () => {
  if (!inputJson.value.trim()) {
    ElMessage.warning('请先输入JSON文本');
    return;
  }
  
  try {
    const jsonObj = JSON.parse(inputJson.value);
    formattedJson.value = JSON.stringify(jsonObj, null, indentSize.value);
    isValidJson.value = true;
    scrollToPreview();
  } catch (e) {
    isValidJson.value = false;
    ElMessage.error('无效的JSON格式: ' + e.message);
  }
};

// 清空输入
const clearInput = () => {
  inputJson.value = '';
  formattedJson.value = '';
  isValidJson.value = true;
};

// 从剪贴板粘贴
const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText();
    inputJson.value = text;
    ElMessage.success('已从剪贴板粘贴');
    
    // 自动格式化
    formatJson();
  } catch (e) {
    ElMessage.error('无法访问剪贴板: ' + e.message);
  }
};

// 加载示例数据
const loadSampleData = () => {
  inputJson.value = `{
  "name": "产品信息",
  "version": "1.0.0",
  "description": "这是一个示例JSON数据",
  "price": 99.9,
  "isAvailable": true,
  "tags": ["热门", "推荐", "新品"],
  "author": {
    "name": "张三",
    "email": "zhangsan@example.com",
    "roles": ["admin", "editor"]
  },
  "items": [
    {"id": 1, "name": "商品1"},
    {"id": 2, "name": "商品2"},
    {"id": 3, "name": "商品3"}
  ],
  "metadata": null
}`;
  // 自动格式化
  formatJson();
};

// 复制格式化结果到剪贴板
const copyToClipboard = async () => {
  if (!formattedJson.value) {
    ElMessage.warning('没有可复制的内容');
    return;
  }
  
  try {
    await navigator.clipboard.writeText(formattedJson.value);
    ElMessage.success('已复制到剪贴板');
  } catch (e) {
    ElMessage.error('复制失败: ' + e.message);
  }
};

// 获取编辑器中的JSON
const getEditorJson = () => {
  if (!jsonEditor) return;
  
  try {
    const json = jsonEditor.get();
    inputJson.value = JSON.stringify(json, null, indentSize.value);
    formattedJson.value = JSON.stringify(json, null, indentSize.value);
    activeTab.value = 'format';
    ElMessage.success('已获取编辑器中的JSON');
  } catch (e) {
    ElMessage.error('获取JSON失败: ' + e.message);
  }
};

// 复制编辑器JSON
const copyEditorJson = async () => {
  if (!jsonEditor) return;
  
  try {
    const json = jsonEditor.get();
    const jsonStr = JSON.stringify(json, null, indentSize.value);
    await navigator.clipboard.writeText(jsonStr);
    ElMessage.success('已复制到剪贴板');
  } catch (e) {
    ElMessage.error('复制失败: ' + e.message);
  }
};
</script>

<style scoped>
.json-formatter {
  width: 100%;
}

.tool-tabs {
  margin-top: 0;
}

.integrated-layout {
  display: flex;
  gap: var(--spacing-md);
  width: 100%;
  height: calc(100vh - 180px);
  min-height: 400px;
  max-height: 600px;
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

.input-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-actions {
  display: flex;
  gap: 5px;
}

.json-input {
  flex: 1;
  font-family: monospace;
  font-size: 14px;
}

.invalid-json .el-textarea__inner {
  border-color: #f56c6c;
  background-color: #fff0f0;
}

.format-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  padding: 8px;
  background-color: #f8f9ff;
  border-radius: 4px;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-label-compact {
  font-size: 13px;
  color: #303133;
  font-weight: 500;
  min-width: 44px;
}

.format-select-compact {
  width: 100px;
}

.actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.json-stats {
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

.json-stats.error {
  background-color: #fff0f0;
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

.stat-error {
  color: #f56c6c;
  font-weight: 500;
}

.output-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.output-container {
  flex: 1;
  background-color: #f9f9f9;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  overflow: auto;
  position: relative;
  height: calc(100% - 35px);
}

.json-output {
  margin: 0;
  font-family: monospace;
  font-size: 14px;
  white-space: pre-wrap;
}

.json-editor-container {
  height: calc(100vh - 180px);
  min-height: 400px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
}

.editor-info {
  margin-bottom: 10px;
}

.json-editor-wrapper {
  flex: 1;
  margin-bottom: 10px;
}

.editor-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 992px) {
  .integrated-layout {
    flex-direction: column;
    height: auto;
    max-height: none;
  }
  
  .left-panel,
  .right-panel {
    width: 100%;
  }
  
  .input-section {
    margin-bottom: var(--spacing-md);
  }
  
  .json-input {
    height: 180px;
  }
  
  .output-container {
    height: 180px;
  }
  
  .json-editor-container {
    height: auto;
  }
  
  .json-editor-wrapper {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .json-input,
  .output-container {
    height: 150px;
  }
  
  .json-editor-wrapper {
    height: 300px;
  }
}
</style> 