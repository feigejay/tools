<template>
  <tool-container>
    <div class="image-compressor">
      <div class="tool-content">
        <div class="integrated-layout">
          <!-- 左侧区域：上传+压缩选项 -->
          <div class="left-panel">
            <!-- 上传区域 - 始终显示 -->
            <div class="upload-area" :class="{ 'compact-upload': originalImage }">
              <div class="upload-card">
                <div class="upload-title" v-if="!originalImage">拖拽图片到此处或点击上传</div>
                <p class="upload-desc" v-if="!originalImage">支持JPG、PNG、WEBP格式，最大10MB，上传后自动压缩</p>
                
                <el-upload
                  class="upload-drop"
                  drag
                  action=""
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="handleFileChange"
                  accept="image/*"
                >
                  <div v-if="!originalImage">
                    <div class="image-icon">
                      <el-icon class="upload-icon"><PictureRounded /></el-icon>
                    </div>
                    <div class="upload-text">
                      <span>拖拽图片到此处</span>
                    </div>
                  </div>
                  <div v-else class="reupload-area">
                    <el-icon class="upload-icon-small"><PictureRounded /></el-icon>
                    <span>点击或拖拽更换图片</span>
                  </div>
                </el-upload>
                
                <el-button type="primary" class="select-button" @click="triggerUpload" v-if="!originalImage">
                  选择图片文件
                </el-button>
              </div>
            </div>
            
            <!-- 压缩选项 - 仅在有图片时显示 -->
            <div class="compression-options" v-if="originalImage">
              <div class="tool-section-title">压缩选项</div>
              
              <div class="compact-options">
                <div class="option-row">
                  <span class="option-label-compact">压缩质量:</span>
                  <div class="option-slider">
                    <span class="quality-value-compact">{{ qualityPercent }}%</span>
                    <el-slider
                      v-model="quality"
                      :min="40"
                      :max="95"
                      :step="5"
                      @input="showQualityPercent"
                      :show-tooltip="false"
                    />
                  </div>
                </div>
                
                <div class="option-row">
                  <span class="option-label-compact">输出格式:</span>
                  <el-select v-model="outputFormat" size="small" class="format-select-compact">
                    <el-option value="auto" label="自动"></el-option>
                    <el-option value="jpeg" label="JPEG"></el-option>
                    <el-option value="png" label="PNG"></el-option>
                    <el-option value="webp" label="WebP"></el-option>
                  </el-select>
                </div>
              </div>
              
              <!-- 压缩统计信息 -->
              <div v-if="compressedImage" class="result-stats">
                <div class="compact-stats">
                  <span class="stat-item-inline">
                    <span class="stat-label">原始大小:</span>
                    <span class="stat-value blue-text">{{ formatFileSize(originalFileSize) }}</span>
                  </span>
                  
                  <span class="stat-divider">|</span>
                  
                  <span class="stat-item-inline">
                    <span class="stat-label">压缩后:</span>
                    <span class="stat-value blue-text">{{ formatFileSize(compressedFileSize) }}</span>
                  </span>
                  
                  <span class="stat-divider">|</span>
                  
                  <span class="stat-item-inline">
                    <span class="stat-label">减小:</span>
                    <span class="stat-value blue-text">{{ 100 - Number(compressionRatio) }}%</span>
                  </span>
                  
                  <span class="stat-divider">|</span>
                  
                  <span class="stat-item-inline">
                    <span class="stat-label">尺寸:</span>
                    <span class="stat-value blue-text">{{ imageDimensions }}</span>
                  </span>
                </div>
                
                <div class="action-buttons">
                  <el-button type="primary" @click="downloadImage" class="download-button" icon="Download">
                    下载压缩图片
                  </el-button>
                  <el-button @click="fullReset" class="reset-button-small" icon="RefreshLeft">
                    重新上传
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 右侧图片预览 - 仅在有图片时显示 -->
          <div class="right-panel" v-if="originalImage && compressedImage" ref="previewSection">
            <div class="image-preview">
              <div class="image-comparisons">
                <div class="image-card">
                  <div class="image-card-header">
                    原始图片
                  </div>
                  <div class="image-card-content">
                    <img :src="originalImage" alt="原图" />
                  </div>
                </div>
                
                <div class="image-card">
                  <div class="image-card-header">
                    压缩后图片
                  </div>
                  <div class="image-card-content">
                    <img :src="compressedImage" alt="压缩后" />
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
import { ref, computed, onMounted, watch } from 'vue';
import imageCompression from 'browser-image-compression';
import { Upload, Download, RefreshLeft, PictureRounded } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import ToolContainer from '../../components/ToolContainer.vue';

// 状态
const originalImage = ref(null);
const compressedImage = ref(null);
const originalFileSize = ref(0);
const compressedFileSize = ref(0);
const isCompressing = ref(false);
const fileObject = ref(null);
const imageDimensions = ref('');
const uploadRef = ref(null);
const previewSection = ref(null);

// 图片压缩选项
const quality = ref(85); // 默认质量85%
const qualityPercent = ref(85);
const outputFormat = ref('auto'); // 默认自动格式
const maxWidth = ref(1920); // 默认最大宽度

// 监听文件上传和质量设置变化，自动执行压缩
watch([fileObject, outputFormat], ([newFile, newFormat], [oldFile, oldFormat]) => {
  // 如果是新上传的文件，或者在已有文件的情况下修改了格式
  if (newFile && (newFile !== oldFile || newFormat !== oldFormat)) {
    compressImage();
  }
});

// 监听压缩图片的变化，当压缩完成时自动滚动到预览区域
watch(compressedImage, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    // 压缩完成后，等待DOM更新完成再滚动
    setTimeout(() => {
      if (previewSection.value) {
        previewSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }
});

// 监听质量变化，使用节流方式处理以避免频繁压缩
let qualityDebounceTimer = null;
watch(quality, (newQuality) => {
  if (fileObject.value) {
    // 更新显示的质量百分比
    qualityPercent.value = newQuality;
    
    // 清除之前的定时器
    clearTimeout(qualityDebounceTimer);
    
    // 设置新的定时器，200ms后执行压缩
    qualityDebounceTimer = setTimeout(() => {
      compressImage();
    }, 200);
  }
});

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
  if (bytes === 0) return '0 字节';
  const k = 1024;
  const sizes = ['字节', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 处理文件上传
const handleFileChange = (file) => {
  if (!file.raw) {
    ElMessage.error('上传失败，请重试');
    return;
  }
  
  const isImage = file.raw.type.startsWith('image/');
  if (!isImage) {
    ElMessage.error('请上传图片文件');
    return;
  }
  
  // 检查文件大小
  if (file.raw.size > 10 * 1024 * 1024) {
    ElMessage.error('文件过大，请上传小于10MB的图片');
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
  } catch (error) {
    console.error('压缩失败:', error);
    ElMessage.error('压缩失败，请重试');
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
  
  ElMessage.success('下载成功');
};

// 重置图片
const resetImage = () => {
  compressedImage.value = null;
  compressedFileSize.value = 0;
  quality.value = 85;
  qualityPercent.value = 85;
  outputFormat.value = 'auto';
  // 保留原图信息，只重置压缩结果，然后重新压缩
  compressImage();
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
.image-compressor {
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
  gap: var(--spacing-md);
}

.right-panel {
  flex: 1;
  min-width: 0;
}

/* 上传区域样式 */
.upload-area {
  width: 100%;
}

.upload-area.compact-upload {
  margin: 0;
}

.upload-card {
  text-align: center;
  padding: var(--spacing-sm);
}

.upload-title {
  font-size: 20px;
  color: #4e6ef2;
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
}

.upload-desc {
  color: #606266;
  margin-bottom: var(--spacing-sm);
  font-size: 14px;
}

.upload-drop {
  width: 100%;
  min-height: 240px;
  border: 2px dashed #4e6ef2;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  padding: var(--spacing-md);
  background-color: #f5f7ff;
  margin-bottom: var(--spacing-sm);
}

.compact-upload .upload-drop {
  min-height: 80px;
  padding: var(--spacing-sm);
}

.reupload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.upload-icon-small {
  font-size: 24px;
  color: #4e6ef2;
}

.upload-drop:hover {
  border-color: #4e6ef2;
  background-color: #edf1ff;
}

.image-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid #4e6ef2;
  margin-bottom: var(--spacing-md);
}

.upload-icon {
  font-size: 36px;
  color: #4e6ef2;
}

.upload-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: var(--spacing-sm);
}

.upload-text span {
  color: #606266;
  font-size: 16px;
  font-weight: 500;
}

.select-button {
  margin-top: var(--spacing-sm);
  background-color: #4e6ef2;
  border-color: #4e6ef2;
  font-size: 16px;
  height: 42px;
  padding: 0 24px;
}

.select-button:hover {
  background-color: #4058d9;
  border-color: #4058d9;
}

/* 压缩选项样式 */
.compression-options {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  padding: var(--spacing-sm);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #ebeef5;
}

.tool-section-title {
  font-size: 15px;
  margin-bottom: var(--spacing-sm);
  color: #303133;
  font-weight: bold;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: var(--spacing-xs);
}

.compact-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  min-width: 64px;
}

.option-slider {
  flex: 1;
  position: relative;
}

.quality-value-compact {
  position: absolute;
  right: 0;
  top: -18px;
  font-size: 12px;
  color: #4e6ef2;
  font-weight: 600;
}

.format-select-compact {
  width: 120px;
}

/* 压缩结果样式 */
.result-stats {
  margin-top: var(--spacing-md);
  border-top: 1px solid #ebeef5;
  padding-top: var(--spacing-sm);
}

.compact-stats {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 4px 0;
  font-size: 12px;
  margin-bottom: var(--spacing-sm);
  background-color: #f8f9ff;
  border-radius: 4px;
  padding: 8px;
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
}

.blue-text {
  color: #4e6ef2;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.download-button {
  background-color: #4e6ef2;
  border-color: #4e6ef2;
  font-size: 15px;
  width: 100%;
}

.download-button:hover {
  background-color: #4058d9;
  border-color: #4058d9;
}

.reset-button-small {
  font-size: 14px;
}

/* 图片预览区域 */
.image-preview {
  width: 100%;
}

.image-comparisons {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.image-card {
  flex: 1;
  min-width: 280px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #ebeef5;
}

.image-card-header {
  background-color: #4e6ef2;
  color: #fff;
  padding: var(--spacing-xs) var(--spacing-md);
  font-weight: 500;
  text-align: center;
  font-size: 14px;
}

.image-card-content {
  padding: var(--spacing-sm);
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.image-card-content img {
  max-width: 100%;
  max-height: 180px;
  object-fit: contain;
}

@media (max-width: 1100px) {
  .integrated-layout {
    flex-direction: column;
  }
  
  .left-panel {
    width: 100%;
  }
  
  .right-panel {
    width: 100%;
  }
  
  .image-comparisons {
    flex-direction: row;
  }
  
  .image-card-content {
    height: 180px;
  }
  
  .image-card-content img {
    max-height: 160px;
  }
}

@media (max-width: 768px) {
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