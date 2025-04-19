<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-about">
        <h3>{{ $t('footer.about') }}</h3>
        <p>{{ $t('footer.aboutText') }}</p>
      </div>
      <div class="footer-right">
        <p>{{ $t('footer.copyright') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
.app-footer {
  width: 100%;
  background-color: var(--bg-light);
  border-top: 1px solid var(--border-color);
  transition: background-color var(--transition-time), border-color var(--transition-time);
  height: var(--footer-height);
  flex-shrink: 0;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  height: 100%;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.footer-about {
  max-width: 600px;
}

.footer-about h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 var(--spacing-xs);
  color: var(--text-primary);
  transition: color var(--transition-time);
}

.footer-about p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  transition: color var(--transition-time);
}

.footer-right {
  text-align: right;
}

.footer-right p {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  transition: color var(--transition-time);
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: var(--spacing-md);
    height: auto;
  }
  
  .footer-about {
    margin-bottom: var(--spacing-md);
  }
  
  .footer-right {
    text-align: center;
  }
  
  .app-footer {
    height: auto;
    padding: var(--spacing-md) 0;
  }
}
</style> 