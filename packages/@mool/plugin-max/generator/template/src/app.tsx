import { Router,useRouter } from "vue-router";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { App,defineAsyncComponent } from "vue";
import {type IMenuRoutes,LayoutConfig,GlobalConfig} from 'mooljs';

export const onRouterGuard = (router: Router) => {};


export const onSetupPlugins = (app: App) => {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
};
export const routes:IMenuRoutes[] = [
  {
    path: "/",
    component: "/src/pages/index.vue",
    meta: {
      title: "首页1",
      icon: "HomeFilled",
      menuRender:false,
    },
  },
  {
    path:'/admin',
    component:'/src/layouts/default.vue',
    meta: {
      title: "后台管理系统",
      hideInMenu:true,
    },
  },
  {
    path: "/form",
    meta: {
      title: "表单页",
      icon: "Document",
      access:'hasPermision',
    },
    routes: [
      {
        path: "/form/basic",
        component: "/src/pages/form/basic.vue",
        meta: {
          title: "基础表单",
          menuRender:false
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
  {
    path:'/user',
    component:'/src/pages/user/index.vue',
    meta:{
      title:'用户中心',
      icon:'User',
      layout:false
    }
  }
];
// export const layout:GlobalConfig['layout'] = (initialState):LayoutConfig => {
//   return {
//     menu: {
//       request: async () => {
//         const { data } = (await service.menu.getRoutes({})) as { data: any[] };
//         return data;
//       },
//     },
//     headerRender:defineAsyncComponent(()=>import('./layouts/header.tsx')),
    
//   };
// };


export const layout:LayoutConfig = {
  headerRender:defineAsyncComponent(()=>import('./layouts/header.tsx')),
  unAccessible:defineAsyncComponent(()=>import('./layouts/403.tsx'))

}
export function getInitialState (){
    return {
        userName:'merlinhog'
    }
}
