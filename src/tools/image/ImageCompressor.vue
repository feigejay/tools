<template>
  <div class="tool-container">
    <tool-header
      :title="$t('tools.imageCompressor.title')"
      :description="$t('tools.imageCompressor.desc')"
      :icon="Picture"
    />
    
    <div class="tool-content">
      <!-- 上传区域 -->
      <div v-if="!originalImage" class="upload-area">
        <div class="upload-card">
          <h2 class="upload-title">{{ $t('tools.imageCompressor.dragImageHere') }}</h2>
          <p class="upload-desc">{{ $t('tools.imageCompressor.supportFormat') }}</p>
          
          <el-upload
            class="upload-drop"
            drag
            action=""
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleFileChange"
            accept="image/*"
          >
            <div class="image-icon">
              <el-icon class="upload-icon"><PictureRounded /></el-icon>
            </div>
            <div class="upload-text">
              <span>{{ $t('tools.imageCompressor.dragImageHere') }}</span>
            </div>
          </el-upload>
          
          <el-button type="primary" class="select-button" @click="triggerUpload">
            {{ $t('tools.imageCompressor.selectFile') }}
          </el-button>
        </div>
      </div>
      
      <!-- 图片处理区域 -->
      <div v-else class="process-area">
        <!-- 压缩选项 -->
        <div class="compression-options">
          <h3 class="options-title">{{ $t('tools.imageCompressor.compressionOptions') }}</h3>
          
          <div class="option-item">
            <div class="option-label">{{ $t('tools.imageCompressor.quality') }}</div>
            <div class="option-control quality-control">
              <div class="quality-labels">
                <span>{{ $t('tools.imageCompressor.low') }}</span>
                <span class="quality-value">{{ qualityPercent }}%</span>
                <span>{{ $t('tools.imageCompressor.high') }}</span>
              </div>
              <el-slider
                v-model="quality"
                :min="40"
                :max="95"
                :step="5"
                @change="showQualityPercent"
                :show-tooltip="false"
              />
            </div>
          </div>
          
          <div class="option-item">
            <div class="option-label">{{ $t('tools.imageCompressor.outputFormat') }}</div>
            <div class="option-control">
              <el-select v-model="outputFormat" class="format-select">
                <el-option value="auto" :label="$t('tools.imageCompressor.formatAuto')"></el-option>
                <el-option value="jpeg" label="JPEG"></el-option>
                <el-option value="png" label="PNG"></el-option>
                <el-option value="webp" label="WebP"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        
        <!-- 压缩结果 -->
        <div class="compression-results" v-if="compressedImage">
          <h3 class="result-title">
            {{ $t('tools.imageCompressor.compressionResults') }}
            <el-button type="text" class="recompress-button" @click="resetImage">
              <el-icon><Refresh /></el-icon>
              {{ $t('tools.imageCompressor.recompress') }}
            </el-button>
          </h3>
          
          <div class="result-stats">
            <div class="stat-card">
              <div class="stat-title">{{ $t('tools.imageCompressor.originalSize') }}</div>
              <div class="stat-value blue-text">{{ formatFileSize(originalFileSize) }}</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-title">{{ $t('tools.imageCompressor.compressedSize') }}</div>
              <div class="stat-value blue-text">{{ formatFileSize(compressedFileSize) }}</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-title">{{ $t('tools.imageCompressor.reduced') }}</div>
              <div class="stat-value blue-text">{{ 100 - Number(compressionRatio) }}%</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-title">{{ $t('tools.imageCompressor.dimensions') }}</div>
              <div class="stat-value blue-text">{{ imageDimensions }}</div>
            </div>
          </div>
          
          <div class="image-comparisons">
            <div class="image-card">
              <div class="image-card-header">
                {{ $t('tools.imageCompressor.originalImage') }}
              </div>
              <div class="image-card-content">
                <img :src="originalImage" alt="Original" />
              </div>
            </div>
            
            <div class="image-card">
              <div class="image-card-header">
                {{ $t('tools.imageCompressor.compressedImage') }}
              </div>
              <div class="image-card-content">
                <img :src="compressedImage" alt="Compressed" />
              </div>
            </div>
          </div>
          
          <div class="action-buttons">
            <el-button type="primary" @click="downloadImage" class="download-button">
              {{ $t('tools.imageCompressor.downloadImage') }}
            </el-button>
          </div>
        </div>
        
        <!-- 压缩按钮 (当图片上传但未压缩时显示) -->
        <div class="compress-actions" v-if="!compressedImage">
          <el-button
            type="primary"
            size="large"
            :disabled="isCompressing"
            :loading="isCompressing"
            @click="compressImage"
            class="compress-button"
          >
            {{ $t('tools.imageCompressor.startCompression') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import imageCompression from 'browser-image-compression';
import { Upload, Download, RefreshLeft, Picture, Refresh, PictureRounded } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import ToolHeader from '../../components/ToolHeader.vue';

const { t } = useI18n();

// 状态
const originalImage = ref(null);
const compressedImage = ref(null);
const originalFileSize = ref(0);
const compressedFileSize = ref(0);
const isCompressing = ref(false);
const fileObject = ref(null);
const imageDimensions = ref('');
const uploadRef = ref(null);

// 图片压缩选项
const quality = ref(85); // 默认质量85%
const qualityPercent = ref(85);
const outputFormat = ref('auto'); // 默认自动格式
const maxWidth = ref(1920); // 默认最大宽度

// 触发文件上传
const triggerUpload = () => {
  // 获取上传组件的DOM元素
  const uploadDom = document.querySelector('.upload-drop .el-upload__input');
  if (uploadDom) {
    uploadDom.click();
  }
};

// 显示质量百分比
const showQualityPercent = () => {
  qualityPercent.value = quality.value;
};

// 计算压缩比例
const compressionRatio = computed(() => {
  if (!originalFileSize.value || !compressedFileSize.value) return 0;
  const ratio = (compressedFileSize.value / originalFileSize.value) * 100;
  return ratio.toFixed(1);
});

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 处理文件上传
const handleFileChange = (file) => {
  if (!file.raw) {
    ElMessage.error(t('tools.imageCompressor.uploadFailed'));
    return;
  }
  
  const isImage = file.raw.type.startsWith('image/');
  if (!isImage) {
    ElMessage.error(t('tools.imageCompressor.pleaseUploadImage'));
    return;
  }
  
  // 检查文件大小
  if (file.raw.size > 10 * 1024 * 1024) {
    ElMessage.error(t('tools.imageCompressor.fileTooLarge'));
    return;
  }
  
  fileObject.value = file.raw;
  originalFileSize.value = file.raw.size;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    originalImage.value = e.target.result;
    compressedImage.value = null;
    compressedFileSize.value = 0;
    
    // 获取图片尺寸
    const img = new Image();
    img.onload = () => {
      imageDimensions.value = `${img.width} x ${img.height}`;
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file.raw);
};

// 压缩图片
const compressImage = async () => {
  if (!fileObject.value) return;
  
  isCompressing.value = true;
  
  try {
    // 设置输出格式
    let targetFormat = undefined;
    if (outputFormat.value !== 'auto') {
      targetFormat = 'image/' + outputFormat.value;
    }
    
    const options = {
      maxSizeMB: 10,
      maxWidthOrHeight: maxWidth.value,
      useWebWorker: true,
      initialQuality: quality.value / 100,
      fileType: targetFormat
    };
    
    const compressedFile = await imageCompression(fileObject.value, options);
    compressedFileSize.value = compressedFile.size;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      compressedImage.value = e.target.result;
      
      // 获取压缩后图片尺寸
      const img = new Image();
      img.onload = () => {
        imageDimensions.value = `${img.width} x ${img.height}`;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(compressedFile);
    
    ElMessage.success(t('tools.imageCompressor.compressionSuccess'));
  } catch (error) {
    console.error('压缩失败:', error);
    ElMessage.error(t('tools.imageCompressor.compressionFailed'));
  } finally {
    isCompressing.value = false;
  }
};

// 下载压缩后的图片
const downloadImage = () => {
  if (!compressedImage.value) return;
  
  // 确定下载文件后缀
  let extension = 'jpg'; // 默认jpg
  if (outputFormat.value !== 'auto') {
    extension = outputFormat.value;
  } else if (fileObject.value.name) {
    const originalExt = fileObject.value.name.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(originalExt)) {
      extension = originalExt;
    }
  }
  
  // 构建文件名
  const originalName = fileObject.value.name || 'image';
  const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || 'image';
  const fileName = `${baseName}_compressed.${extension}`;
  
  const a = document.createElement('a');
  a.href = compressedImage.value;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// 重置图片
const resetImage = () => {
  compressedImage.value = null;
  compressedFileSize.value = 0;
  quality.value = 85;
  qualityPercent.value = 85;
  outputFormat.value = 'auto';
  // 保留原图信息，只重置压缩结果
};

// 完全重置（上传新图片）
const fullReset = () => {
  originalImage.value = null;
  compressedImage.value = null;
  originalFileSize.value = 0;
  compressedFileSize.value = 0;
  fileObject.value = null;
  imageDimensions.value = '';
  quality.value = 85;
  qualityPercent.value = 85;
  outputFormat.value = 'auto';
  maxWidth.value = 1920;
};
</script>

<style scoped>
.tool-container {
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}

.tool-content {
  margin-top: var(--spacing-xl);
}

/* 上传区域样式 */
.upload-area {
  margin: 0 auto;
  max-width: 900px;
}

.upload-card {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-xl) var(--spacing-md);
}

.upload-title {
  font-size: 24px;
  color: #4e6ef2;
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
}

.upload-desc {
  color: #606266;
  margin-bottom: var(--spacing-lg);
  font-size: 16px;
}

.upload-drop {
  width: 100%;
  min-height: 300px;
  border: 2px dashed #4e6ef2;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  padding: var(--spacing-xl) var(--spacing-md);
  background-color: #f5f7ff;
  margin-bottom: var(--spacing-md);
}

.upload-drop:hover {
  border-color: #4e6ef2;
  background-color: #edf1ff;
}

.image-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid #4e6ef2;
  margin-bottom: var(--spacing-md);
}

.upload-icon {
  font-size: 40px;
  color: #4e6ef2;
}

.upload-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.upload-text span {
  color: #606266;
  font-size: 16px;
  font-weight: 500;
}

.select-button {
  margin-top: var(--spacing-md);
  background-color: #4e6ef2;
  border-color: #4e6ef2;
  font-size: 16px;
  height: 40px;
  padding: 0 24px;
}

.select-button:hover {
  background-color: #4058d9;
  border-color: #4058d9;
}

/* 处理区域样式 */
.process-area {
  margin: 0 auto;
  max-width: 1100px;
}

/* 压缩选项样式 */
.compression-options {
  background-color: #fff;
  border-radius: 8px;
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #ebeef5;
}

.options-title {
  font-size: 20px;
  margin-bottom: var(--spacing-lg);
  color: #303133;
  font-weight: bold;
}

.option-item {
  display: flex;
  margin-bottom: var(--spacing-lg);
  align-items: center;
}

.option-label {
  flex: 0 0 120px;
  color: #303133;
  font-weight: 500;
  font-size: 16px;
}

.option-control {
  flex: 1;
  display: flex;
  align-items: center;
}

.quality-control {
  flex-direction: column;
  align-items: stretch;
}

.quality-labels {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
  color: #606266;
  font-size: 14px;
}

.quality-value {
  font-weight: bold;
  color: #4e6ef2;
}

.format-select {
  width: 240px;
}

.compress-actions {
  margin-top: var(--spacing-lg);
  display: flex;
  justify-content: center;
}

.compress-button {
  background-color: #4e6ef2;
  border-color: #4e6ef2;
  font-size: 16px;
  height: 46px;
  padding: 0 30px;
}

.compress-button:hover {
  background-color: #4058d9;
  border-color: #4058d9;
}

/* 压缩结果样式 */
.compression-results {
  margin-top: var(--spacing-xl);
}

.result-title {
  font-size: 20px;
  margin-bottom: var(--spacing-lg);
  color: #303133;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.recompress-button {
  font-size: 14px;
  color: #4e6ef2;
  display: flex;
  align-items: center;
}

.recompress-button .el-icon {
  margin-right: 4px;
}

.result-stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.stat-card {
  flex: 1;
  min-width: 150px;
  background-color: #f5f7ff;
  border-radius: 8px;
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.stat-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.blue-text {
  color: #4e6ef2;
}

.image-comparisons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.image-card {
  flex: 1;
  min-width: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #ebeef5;
}

.image-card-header {
  background-color: #4e6ef2;
  color: #fff;
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: 500;
  text-align: center;
}

.image-card-content {
  padding: var(--spacing-md);
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.image-card-content img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.download-button {
  background-color: #4e6ef2;
  border-color: #4e6ef2;
  font-size: 16px;
  height: 46px;
  padding: 0 30px;
}

.download-button:hover {
  background-color: #4058d9;
  border-color: #4058d9;
}

@media (max-width: 768px) {
  .option-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .option-label {
    margin-bottom: var(--spacing-sm);
  }
  
  .result-stats {
    flex-direction: column;
  }
  
  .image-comparisons {
    flex-direction: column;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .el-button {
    width: 100%;
  }
}
</style> 