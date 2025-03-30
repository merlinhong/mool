<template>
  <pro-layout v-model:collapsed="collapsed" title="Admin Pro" :logo="logo" :menu-data="menuData" :page-title="pageTitle"
    :page-sub-title="pageSubTitle" :breadcrumb="true" :copyright="copyright" :links="links">
    <template #rightContentRender>
      <RightContent />
    </template>
    <RouterView />
  </pro-layout>
</template>

<script setup lang="tsx">
import { ref } from 'vue'
import ProLayout from '../components/ProLayout/index.vue'
import {
  HomeFilled,
  Document,
  Setting,
  User,
  Search,
  QuestionFilled
} from '@element-plus/icons-vue';
import { ElIcon, ElDropdown, ElDropdownMenu, ElDropdownItem, ElTooltip, ElButton, ElAvatar } from 'element-plus';
import { useMenuFromRoutes } from '../utils/useMenu';
import { useAccess,getAppConfig } from 'mooljs';

const access = useAccess(); 
const {routes=[],layout={}} = getAppConfig();


const { menuData } = useMenuFromRoutes(routes, {}, access);

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
const RightContent = layout.rightContent??(() => {
  return (
    <div className="right-content">
      <ElTooltip content="搜索" placement="bottom">
        <ElButton type="text">
          <ElIcon><Search /></ElIcon>
        </ElButton>
      </ElTooltip>
      <ElTooltip content="帮助" placement="bottom">
        <ElButton type="text">
          <ElIcon><QuestionFilled /></ElIcon>
        </ElButton>
      </ElTooltip>
      <ElDropdown v-slots={
        {
          dropdown: () => {
            return (
              <ElDropdownMenu>
                <ElDropdownItem>个人中心</ElDropdownItem>
                <ElDropdownItem>设置</ElDropdownItem>
                <ElDropdownItem divided>退出登录</ElDropdownItem>
              </ElDropdownMenu>
            )
          },
        }
      }>
        <div class="user-dropdown">
          <ElAvatar size={32} src="https://joeschmoe.io/api/v1/random" />
          <span class="username">管理员</span>
        </div>

      </ElDropdown>
    </div >
  )
})
</script>

<style>
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