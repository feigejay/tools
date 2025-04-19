<template>
  <div class="json-formatter">
    <el-card class="tool-card">
      <template #header>
        <div class="card-header">
          <h2>JSON格式化工具</h2>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" class="tool-tabs">
        <el-tab-pane label="格式化" name="format">
          <div class="editor-container">
            <div class="editor-actions">
              <div class="left-actions">
                <el-button @click="clearInput">清空</el-button>
                <el-button @click="pasteFromClipboard">从剪贴板粘贴</el-button>
                <el-button @click="loadSampleData">加载示例</el-button>
              </div>
              <div class="right-actions">
                <el-button type="primary" @click="formatJson">格式化</el-button>
              </div>
            </div>
            
            <el-input
              v-model="inputJson"
              type="textarea"
              :rows="10"
              placeholder="请输入或粘贴JSON文本"
              class="json-input"
            ></el-input>
            
            <div class="spacing"></div>
            
            <div class="output-header">
              <span>格式化结果</span>
              <div class="output-actions">
                <el-select v-model="indentSize" placeholder="缩进空格" style="width: 110px">
                  <el-option label="2 空格" :value="2"></el-option>
                  <el-option label="4 空格" :value="4"></el-option>
                  <el-option label="8 空格" :value="8"></el-option>
                </el-select>
                <el-button type="primary" @click="copyToClipboard">复制结果</el-button>
              </div>
            </div>
            
            <div class="output-container" ref="outputContainer">
              <pre class="json-output"><code>{{ formattedJson }}</code></pre>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="JSON编辑器" name="editor">
          <div class="json-editor-container">
            <div class="editor-info">
              <el-alert
                title="可视化JSON编辑器"
                type="info"
                description="拖拽重新排序，点击编辑值，右键显示更多选项"
                :closable="false"
                show-icon
              />
            </div>
            <div class="json-editor-wrapper" ref="jsonEditorContainer">
              <!-- JsonEditor将在此处挂载 -->
            </div>
            <div class="editor-actions mt-3">
              <el-button @click="getEditorJson">获取JSON</el-button>
              <el-button type="primary" @click="copyEditorJson">复制JSON</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      
      <div class="instruction">
        <h3>使用说明</h3>
        <ul>
          <li><strong>格式化</strong> - 将无格式或压缩的JSON文本转换为易读的格式</li>
          <li><strong>JSON编辑器</strong> - 可视化编辑JSON数据，支持添加、删除、修改节点</li>
        </ul>
        <p>温馨提示：处理大型JSON文件时可能需要稍等片刻</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { ElMessage } from 'element-plus';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';

// 响应式数据
const inputJson = ref('');
const formattedJson = ref('');
const indentSize = ref(2);
const activeTab = ref('format');
const outputContainer = ref(null);
const jsonEditorContainer = ref(null);

// JSONEditor实例
let jsonEditor = null;

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
  }
});

// 销毁编辑器
onBeforeUnmount(() => {
  if (jsonEditor) {
    jsonEditor.destroy();
  }
});

// 格式化JSON
const formatJson = () => {
  if (!inputJson.value.trim()) {
    ElMessage.warning('请先输入JSON文本');
    return;
  }
  
  try {
    const jsonObj = JSON.parse(inputJson.value);
    formattedJson.value = JSON.stringify(jsonObj, null, indentSize.value);
    ElMessage.success('格式化成功');
  } catch (e) {
    ElMessage.error('无效的JSON格式: ' + e.message);
  }
};

// 清空输入
const clearInput = () => {
  inputJson.value = '';
  formattedJson.value = '';
};

// 从剪贴板粘贴
const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText();
    inputJson.value = text;
    ElMessage.success('已从剪贴板粘贴');
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
  max-width: 1000px;
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

.tool-tabs {
  margin-top: 10px;
}

.editor-container {
  margin-top: 20px;
}

.editor-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.left-actions, .right-actions {
  display: flex;
  gap: 10px;
}

.spacing {
  height: 20px;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.output-actions {
  display: flex;
  gap: 10px;
}

.json-input {
  font-family: monospace;
}

.output-container {
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 10px;
  max-height: 400px;
  overflow: auto;
}

.json-output {
  margin: 0;
  font-family: monospace;
  white-space: pre-wrap;
}

.json-editor-container {
  margin-top: 20px;
}

.json-editor-wrapper {
  height: 500px;
  margin-top: 15px;
}

.editor-info {
  margin-bottom: 15px;
}

.mt-3 {
  margin-top: 15px;
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

.instruction ul {
  padding-left: 20px;
}

.instruction li {
  margin-bottom: 8px;
}
</style> 