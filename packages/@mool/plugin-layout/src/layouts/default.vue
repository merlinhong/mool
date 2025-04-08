<template>
  <pro-layout v-model:collapsed="collapsed" title="Admin Pro" :logo="logo" :menu-data="menuData" :page-title="pageTitle"
    :page-sub-title="pageSubTitle" :breadcrumb="true" :copyright="copyright" :links="links" >
    <template #rightContentRender>
      <RightRender />
    </template>
    <template #footerContent>
      <FooterRender />
    </template>
    <template #headerContent>
      <HeaderRender />
    </template>
    <RouterView />
  </pro-layout>
</template>

<script setup lang="tsx">
import { ref,unref } from 'vue'
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
import { useAccess, useLayout,useMenuRoutes } from 'mooljs';
import { onMounted } from 'vue';

const access = useAccess();
const layout = useLayout();
const routes = useMenuRoutes();

const {menuData} = useMenuFromRoutes(routes, {}, access);

// onMounted(()=>{
//   renderMenu();
// })
// 状态
const collapsed = ref(false)
const pageTitle = ref('仪表盘')
const pageSubTitle = ref('这是一个示例页面')

// 配置
const logo = ref('/logo.png')
const copyright = ref('2023 Mooljs Pro Admin')
const links = ref([
  { title: '帮助', href: 'https://example.com/help' },
  { title: '隐私', href: 'https://example.com/privacy' },
  { title: '条款', href: 'https://example.com/terms' }
]);

const FooterRender = layout.footerRender ?? (() => {
  return (
    <div class="default-footer">
      <div>{copyright.value || "Copyright © 2023 ProLayout"}</div>
      {
        links.value && links.value.length && <div>
          {
            links.value.map((link, index) => (
              <a key={index} href={link.href} target="_blank">
                {link.title}
              </a>
            ))
          }
        </div>
      }
    </div>
  )
})
const HeaderRender = layout.headerRender ?? (() => { })

const RightRender = layout.rightRender ?? (() => {
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
</style>