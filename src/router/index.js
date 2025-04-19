import { createRouter, createWebHistory } from 'vue-router';

// 导入主页和基础页面
const Home = () => import('../views/Home.vue');
const About = () => import('../views/About.vue');
const NotFound = () => import('../views/NotFound.vue');

// 工具分类定义
const categories = [
  {
    path: 'image',
    name: '图像工具',
    children: [
      {
        path: 'image-compressor',
        name: '图片压缩',
        component: () => import('../tools/image/ImageCompressor.vue')
      },
      {
        path: 'image-watermark-remover',
        name: '图片去水印',
        component: () => import('../tools/image/ImageWatermarkRemover.vue')
      }
    ]
  },
  {
    path: 'text',
    name: '文本工具',
    children: [
      {
        path: 'markdown-to-html',
        name: 'Markdown转HTML',
        component: () => import('../tools/text/MarkdownToHtml.vue')
      },
      {
        path: 'text-counter',
        name: '文本计数器',
        component: () => import('../tools/text/TextCounter.vue')
      }
    ]
  },
  {
    path: 'format',
    name: '格式化工具',
    children: [
      {
        path: 'json-formatter',
        name: 'JSON格式化',
        component: () => import('../tools/format/JsonFormatter.vue')
      }
    ]
  }
];

// 路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: '首页 - 智能工具导航' }
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: { title: '关于我们 - 智能工具导航' }
  },
  
  // 将工具直接平铺在根路由下
  ...categories.flatMap(category => 
    category.children.map(tool => ({
      path: `/tools/${category.path}/${tool.path}`,
      name: `tool-${tool.path}`,
      component: tool.component,
      meta: { 
        title: `${tool.name} - 智能工具导航`,
        category: category.name
      }
    }))
  ),
  
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: { title: '页面未找到 - 智能工具导航' }
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// 路由前置守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '智能工具导航';
  next();
});

// 导出工具分类以供其他组件使用
export { categories };

export default router; 