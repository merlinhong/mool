<template>
  <pro-layout
    v-model:collapsed="collapsed"
    title="Admin Pro"
    :logo="logo"
    :menu-data="menuData"
    :page-title="pageTitle"
    :page-sub-title="pageSubTitle"
    :breadcrumb="true"
    :copyright="copyright"
    :links="links"
  >
    <template #rightContentRender>
      <div class="right-content">
        <el-tooltip content="搜索" placement="bottom">
          <el-button type="text">
            <el-icon><Search /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="帮助" placement="bottom">
          <el-button type="text">
            <el-icon><QuestionFilled /></el-icon>
          </el-button>
        </el-tooltip>
        <el-dropdown>
          <span class="user-dropdown">
            <el-avatar :size="32" src="https://joeschmoe.io/api/v1/random" />
            <span class="username">管理员</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
    <RouterView/>
  </pro-layout>
</template>

<script setup>
import { ref } from 'vue'
import ProLayout from '@/components/layout/ProLayout/index.vue'
import { 
  HomeFilled, 
  Document, 
  Setting, 
  User, 
  Search, 
  QuestionFilled 
} from '@element-plus/icons-vue'
import { routes } from '/src/app.tsx';
import {useMenuFromRoutes} from './useMenu';
const {menuData} = useMenuFromRoutes(routes);
// 状态
const collapsed = ref(false)
const pageTitle = ref('仪表盘')
const pageSubTitle = ref('这是一个示例页面')

// 配置
const logo = ref('/logo.png')
const copyright = ref('2023 Element Pro Admin')
const links = ref([
  { title: '帮助', href: 'https://example.com/help' },
  { title: '隐私', href: 'https://example.com/privacy' },
  { title: '条款', href: 'https://example.com/terms' }
])

// 菜单数据
// const menuData = ref(routes);
</script>

<style scoped>
.right-content {
  display: flex;
  align-items: center;
}

.right-content .el-button {
  font-size: 18px;
  margin-right: 16px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>