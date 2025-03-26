<template>
    <div class="pro-layout" :class="{ 'is-collapsed': collapsed }">
      <!-- 侧边栏 -->
      <el-aside width="auto" class="pro-layout-sider">
        <div class="logo-container">
          <router-link to="/">
            <img v-if="logo" :src="logo" class="logo" alt="logo" />
            <h1 v-if="!collapsed || !logo" class="title">{{ title }}</h1>
          </router-link>
        </div>
        
        <el-scrollbar>
          <el-menu
            :default-active="activeMenu"
            :collapse="collapsed"
            :background-color="menuProps.backgroundColor || '#001529'"
            :text-color="menuProps.textColor || '#fff'"
            :active-text-color="menuProps.activeTextColor || '#ffd04b'"
            :unique-opened="menuProps.uniqueOpened"
            :collapse-transition="false"
            :router="menuProps.router"
            class="pro-menu"
          >
            <template v-for="(item, index) in menuData" :key="index">
              <template v-if="!item.hidden">
                <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
                  <template #title>
                    <el-icon v-if="item.meta && item.meta.icon">
                      <component :is="item.meta.icon" />
                    </el-icon>
                    <span>{{ item.meta && item.meta.title }}</span>
                  </template>
                  <template v-for="(child, childIndex) in item.children" :key="childIndex">
                    <el-menu-item v-if="!child.hidden && (!child.children || child.children.length === 0)" :index="child.path">
                      <el-icon v-if="child.meta && child.meta.icon">
                        <component :is="child.meta.icon" />
                      </el-icon>
                      <template #title>{{ child.meta && child.meta.title }}</template>
                    </el-menu-item>
                    <el-sub-menu v-else-if="!child.hidden" :index="child.path">
                      <template #title>
                        <el-icon v-if="child.meta && child.meta.icon">
                          <component :is="child.meta.icon" />
                        </el-icon>
                        <span>{{ child.meta && child.meta.title }}</span>
                      </template>
                      <el-menu-item v-for="(grandChild, grandChildIndex) in child.children" :key="grandChildIndex" :index="grandChild.path">
                        <el-icon v-if="grandChild.meta && grandChild.meta.icon">
                          <component :is="grandChild.meta.icon" />
                        </el-icon>
                        <template #title>{{ grandChild.meta && grandChild.meta.title }}</template>
                      </el-menu-item>
                    </el-sub-menu>
                  </template>
                </el-sub-menu>
                <el-menu-item v-else-if="!item.children || item.children.length === 0" :index="item.path">
                  <el-icon v-if="item.meta && item.meta.icon">
                    <component :is="item.meta.icon" />
                  </el-icon>
                  <template #title>{{ item.meta && item.meta.title }}</template>
                </el-menu-item>
              </template>
            </template>
          </el-menu>
        </el-scrollbar>
      </el-aside>
  
      <el-container class="pro-layout-container">
        <!-- 头部 -->
        <el-header v-if="headerRender !== false" height="64px" class="pro-layout-header">
          <div class="header-left">
            <el-button
              type="text"
              class="toggle-button"
              @click="toggleCollapse"
            >
              <el-icon>
                <Fold v-if="!collapsed" />
                <Expand v-else />
              </el-icon>
            </el-button>
            
            <!-- 面包屑 -->
            <el-breadcrumb v-if="breadcrumb" separator="/">
              <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index" :to="{ path: item.path }">
                {{ item.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          
          <div class="header-right">
            <slot name="headerContent"></slot>
            <slot name="rightContentRender"></slot>
          </div>
        </el-header>
  
        <!-- 内容区域 -->
        <el-main class="pro-layout-main">
          <!-- 页面标题 -->
          <div v-if="pageTitleRender !== false && pageTitle" class="page-header">
            <h1 class="page-title">{{ pageTitle }}</h1>
            <div v-if="pageSubTitle" class="page-subtitle">{{ pageSubTitle }}</div>
          </div>
          
          <!-- 主要内容 -->
          <div class="main-content">
            <slot></slot>
          </div>
        </el-main>
  
        <!-- 页脚 -->
        <el-footer v-if="footerRender !== false" height="auto" class="pro-layout-footer">
          <slot name="footerContent">
            <div class="default-footer">
              <div>{{ copyright || 'Copyright © 2023 ProLayout' }}</div>
              <div v-if="links && links.length">
                <a v-for="(link, index) in links" :key="index" :href="link.href" target="_blank">
                  {{ link.title }}
                </a>
              </div>
            </div>
          </slot>
        </el-footer>
      </el-container>
    </div>
  </template>
  
  <script setup>
  import { Fold, Expand } from '@element-plus/icons-vue'
  
  const props = defineProps({
    // 布局配置
    title: {
      type: String,
      default: 'ProLayout'
    },
    logo: {
      type: String,
      default: ''
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    menuData: {
      type: Array,
      default: () => []
    },
    menuProps: {
      type: Object,
      default: () => ({
        backgroundColor: '#001529',
        textColor: '#fff',
        activeTextColor: '#ffd04b',
        uniqueOpened: true,
        router: true
      })
    },
    
    // 渲染控制
    headerRender: {
      type: [Boolean, Function],
      default: true
    },
    footerRender: {
      type: [Boolean, Function],
      default: true
    },
    pageTitleRender: {
      type: [Boolean, Function],
      default: true
    },
    
    // 内容配置
    pageTitle: {
      type: String,
      default: ''
    },
    pageSubTitle: {
      type: String,
      default: ''
    },
    breadcrumb: {
      type: Boolean,
      default: true
    },
    copyright: {
      type: String,
      default: 'Copyright © 2023 ProLayout'
    },
    links: {
      type: Array,
      default: () => []
    }
  })
  
  const emit = defineEmits(['update:collapsed', 'collapsedChange'])
  
  // 响应式状态
  const isCollapsed = ref(props.collapsed)
  const route = useRoute()
  
  // 计算属性
  const activeMenu = computed(() => {
    return route.path
  })
  
  const breadcrumbItems = computed(() => {
    console.log(22);
    // 根据当前路由生成面包屑
    const items = []
    let currentRoute = route
    
    // 添加首页
    items.push({
      path: '/',
      title: '首页'
    })
    console.log(currentRoute);
    // 如果不是首页，添加当前路由
    if (currentRoute.path !== '/' && currentRoute.meta && currentRoute.meta.title) {
      items.push({
        path: currentRoute.path,
        title: currentRoute.meta.title
      })
    }
    console.log(items);
    return items
  })
  
  // 方法
  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
    emit('update:collapsed', isCollapsed.value)
    emit('collapsedChange', isCollapsed.value)
  }
  
  // 监听props变化
  watch(() => props.collapsed, (newVal) => {
    isCollapsed.value = newVal
  })
  
  // 生命周期钩子
  onMounted(() => {
    // 初始化逻辑
  })
  </script>
  
  <style scoped>
  .pro-layout {
    display: flex;
    height: 100vh;
    width: 100%;
  }
  
  .pro-layout-sider {
    height: 100%;
    background-color: #001529;
    transition: width 0.2s;
    overflow: hidden;
  }
  
  .pro-layout.is-collapsed .pro-layout-sider {
    width: 64px !important;
  }
  
  .logo-container {
    height: 64px;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  .logo {
    height: 32px;
    margin-right: 8px;
  }
  
  .title {
    color: #fff;
    font-size: 18px;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .pro-menu {
    border-right: none;
  }
  
  .pro-layout-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
  
  .pro-layout-header {
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
  }
  
  .header-left {
    display: flex;
    align-items: center;
  }
  
  .toggle-button {
    margin-right: 16px;
    font-size: 18px;
  }
  
  .header-right {
    display: flex;
    align-items: center;
  }
  
  .pro-layout-main {
    flex: 1;
    overflow: auto;
    padding: 24px;
    background-color: #f0f2f5;
  }
  
  .page-header {
    margin-bottom: 24px;
  }
  
  .page-title {
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 8px;
  }
  
  .page-subtitle {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
  }
  
  .main-content {
    background-color: #fff;
    padding: 24px;
    border-radius: 2px;
  }
  
  .pro-layout-footer {
    padding: 24px;
    text-align: center;
    background-color: #f0f2f5;
  }
  
  .default-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
  
  .default-footer a {
    color: rgba(0, 0, 0, 0.45);
    margin: 0 8px;
  }
  
  .default-footer a:hover {
    color: #1890ff;
  }
  
  @media screen and (max-width: 768px) {
    .pro-layout-sider {
      position: fixed;
      z-index: 100;
      height: 100vh;
      left: 0;
      top: 0;
    }
    
    .pro-layout.is-collapsed .pro-layout-sider {
      transform: translateX(-100%);
    }
    
    .pro-layout-container {
      margin-left: 0;
    }
  }
  </style>