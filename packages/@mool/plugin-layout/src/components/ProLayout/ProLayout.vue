import { SplitterPanel } from 'primevue'; import { SplitterPanel } from
'primevue';
<template>
  <div class="pro-layout" :class="{ 'is-collapsed': collapsed }">
    <!-- 侧边栏菜单 -->
    <Splitter class="pro-layout-container" :gutterSize="0">
      <!-- 头部 -->
      <SplitterPanel
        :style="{ flexBasis: size + '%' }"
        style="transition: flex-basis 0.3s ease-in-out"
      >
        <Menu
          :data="menuData"
          :background-color="menuProps.backgroundColor"
          :text-color="menuProps.textColor || '#fff'"
          :active-text-color="menuProps.activeTextColor"
          :unique-opened="menuProps.uniqueOpened"
          title="ProLayout"
          logo="/src/assets/mooljs.png"
          :collapsed="isCollapsed"
        />
      </SplitterPanel>
      <SplitterPanel
        :style="{ flexBasis: 100 - size + '%' }"
        style="transition: flex-basis 0.3s ease-in-out"
      >
        <Splitter layout="vertical" :gutterSize="0">
          <SplitterPanel :size="6">
            <!-- 页面标题 -->
            <header
              v-if="headerRender !== false"
              class="pro-layout-header h-full"
            >
              <div class="header-left" v-if="menuRender">
                <i
                  @click="toggleCollapse"
                  class="pi-align-justify pi cursor-pointer"
                ></i>
              </div>
              <div class="header-center">
                <slot name="headerContent"></slot>
              </div>
              <div class="header-right">
                <slot name="rightContentRender"></slot>
              </div>
            </header>
          </SplitterPanel>
          <SplitterPanel class="pro-layout-main" :size="94">
            <!-- 主要内容 -->
            <div class="main-content h-full">
              <slot></slot>
            </div>
          </SplitterPanel>
        </Splitter>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import Menu from "@/layouts/menu.vue";
const props = defineProps({
  // 布局配置
  title: {
    type: String,
    default: "ProLayout",
  },
  logo: {
    type: String,
    default: "",
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
  menuData: {
    type: Array,
    default: () => [],
  },
  menuProps: {
    type: Object,
    default: () => ({
      backgroundColor: "#001529",
      textColor: "#fff",
      activeTextColor: "#ffd04b",
      uniqueOpened: true,
      router: true,
    }),
  },

  // 渲染控制
  headerRender: {
    type: [Boolean, Function],
    default: true,
  },
  footerRender: {
    type: [Boolean, Function],
    default: true,
  },
  pageTitleRender: {
    type: [Boolean, Function],
    default: true,
  },
  // menuRender:{
  //   type:Boolean,
  //   default:true
  // },
  // 内容配置
  pageTitle: {
    type: String,
    default: "",
  },
  pageSubTitle: {
    type: String,
    default: "",
  },
  breadcrumb: {
    type: Boolean,
    default: true,
  },
  copyright: {
    type: String,
    default: "Copyright © 2023 ProLayout",
  },
  links: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:collapsed", "collapsedChange"]);

const size = ref(14);
// 响应式状态
const isCollapsed = ref(props.collapsed);
const menuRender = ref(true);
const route = useRoute();

// 计算属性
const activeMenu = computed(() => {
  return route.path;
});

const breadcrumbItems = computed(() => {
  // 根据当前路由生成面包屑
  const items = [];
  let currentRoute = route;

  // 添加首页
  items.push({
    path: "/",
    title: "首页",
  });
  console.log(currentRoute);
  // 如果不是首页，添加当前路由
  if (
    currentRoute.path !== "/" &&
    currentRoute.meta &&
    currentRoute.meta.title
  ) {
    items.push({
      path: currentRoute.path,
      title: currentRoute.meta.title,
    });
  }
  console.log(items);
  return items;
});

// 方法
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  if (!isCollapsed.value) {
    size.value = 14;
  } else {
    size.value = 2.4;
  }
  emit("update:collapsed", isCollapsed.value);
  emit("collapsedChange", isCollapsed.value);
};

// 监听props变化
watch(
  () => props.collapsed,
  (newVal) => {
    isCollapsed.value = newVal;
  }
);
watch(
  () => route.meta,
  (newval) => {
    menuRender.value = newval.menuRender !== false;
  },
  { immediate: true }
);

// 生命周期钩子
onMounted(() => {
  // 初始化逻辑
});
</script>

<style scoped>
.pro-layout {
  display: flex;
  height: 100vh;
  width: 100%;
}

.pro-layout-sider {
  height: 100%;
  /* transition: width 0.2s; */
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
  flex: 6;
  border: none;
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
  padding: 20px 10px;
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
  overflow: auto;
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
  padding: 24px;
  border-radius: 2px;
}

.pro-layout-footer {
  padding: 24px;
  text-align: center;
  background-color: #f0f2f5;
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
