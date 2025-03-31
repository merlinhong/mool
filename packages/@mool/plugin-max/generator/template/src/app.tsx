import { Router } from "vue-router";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { App } from "vue";
export const onRouterGuard = (router: Router) => {};
export const onSetupPlugins = (app: App) => {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
};
export const routes = [
  {
    path: "/",
    component: "/src/pages/index.vue",
    meta: {
      title: "仪表盘",
      icon: "HomeFilled",
    },
  },
  {
    path: "/form",
    meta: {
      title: "表单页",
      icon: "Document",
    },
    routes: [
      {
        path: "/form/basic",
        component: "/src/pages/form/basic.vue",
        meta: {
          title: "基础表单",
        },
      },
      {
        path: "/form/senior",
        component: "/src/pages/form/senior.vue",
        meta: {
          title: "高级表单",
        },
      },
    ],
  },
  {
    path: "/list",
    meta: {
      title: "列表页",
      icon: "Document",
    },
    routes: [
      {
        path: "/list/table",
        meta: {
          title: "表格列表",
        },
      },
      {
        path: "/list/card",
        meta: {
          title: "卡片列表",
        },
      },
    ],
  },
  {
    path: "/profile",
    meta: {
      title: "详情页",
      icon: "User",
    },
    routes: [
      {
        path: "/profile/basic",
        meta: {
          title: "基础详情页",
        },
      },
      {
        path: "/profile/advanced",
        meta: {
          title: "高级详情页",
        },
      },
    ],
  },
];
export const layout = {

}
export function getInitialState (){
    return {
        userName:'merlinhong'
    }
}