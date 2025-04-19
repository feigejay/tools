import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import router from './router';
import zhCN from './i18n/zh-CN';
import zhTW from './i18n/zh-TW';
import enUS from './i18n/en-US';

// 创建i18n实例
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN', // 默认语言
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en-US': enUS
  }
});

// 创建应用实例
const app = createApp(App);

// 注册ElementPlus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 使用插件
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.use(i18n);

// 挂载应用
app.mount('#app'); 