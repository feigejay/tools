<template>
  <div class="watermark-remover">
    <el-card class="tool-card">
      <template #header>
        <div class="card-header">
          <h2>图片去水印工具</h2>
        </div>
      </template>
      
      <el-alert
        title="此工具目前处于开发阶段"
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 20px;"
      />
      
      <div class="upload-container">
        <el-upload
          class="upload-area"
          drag
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleFileChange"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽图片到此处或 <em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">支持JPG/PNG格式图片</div>
          </template>
        </el-upload>
      </div>
      
      <div v-if="imageUrl" class="image-preview">
        <h3>预览</h3>
        <div class="image-container">
          <img :src="imageUrl" class="preview-image" />
        </div>
        <div class="controls">
          <el-button type="primary" :disabled="processing" @click="removeWatermark">
            <el-icon v-if="processing"><loading /></el-icon> 去除水印
          </el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>
      
      <div class="instruction">
        <h3>使用说明</h3>
        <ol>
          <li>上传含有水印的图片</li>
          <li>点击"去除水印"按钮进行处理</li>
          <li>处理完成后可下载无水印图片</li>
        </ol>
        <p class="note">注意：该工具仍在开发中，目前仅支持简单的水印移除。</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { UploadFilled, Loading } from '@element-plus/icons-vue';

const imageUrl = ref('');
const processing = ref(false);

const handleFileChange = (file) => {
  if (file && file.raw) {
    if (!['image/jpeg', 'image/png'].includes(file.raw.type)) {
      ElMessage.error('请上传JPG或PNG格式的图片');
      return;
    }
    imageUrl.value = URL.createObjectURL(file.raw);
  }
};

const removeWatermark = () => {
  processing.value = true;
  
  // 模拟处理过程
  setTimeout(() => {
    ElMessage.success('水印移除功能正在开发中，敬请期待');
    processing.value = false;
  }, 2000);
};

const reset = () => {
  imageUrl.value = '';
  processing.value = false;
};
</script>

<style scoped>
.watermark-remover {
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

.upload-container {
  width: 100%;
  margin: 20px 0;
}

.upload-area {
  width: 100%;
}

.image-preview {
  margin-top: 30px;
}

.image-container {
  margin: 15px 0;
  text-align: center;
  border: 1px dashed #ccc;
  padding: 10px;
  background-color: #fafafa;
}

.preview-image {
  max-width: 100%;
  max-height: 500px;
}

.controls {
  margin: 20px 0;
  display: flex;
  gap: 10px;
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

.note {
  font-size: 14px;
  color: #909399;
  margin-top: 10px;
}
</style> 