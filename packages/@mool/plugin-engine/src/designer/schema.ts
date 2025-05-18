import { uuid } from "mooljs";
export const componentLibrary = [
  {
    name: "navigation bar", // 显示名称
    type: "navigationBar", // 组件类型，用于渲染逻辑
    compList: [
      {
        height: "auto",
        popoverHeight: "auto",
        id: `bar1`, // 唯一标识符，用于查找和引用
        desc:'普通菜单导航栏',
        // 组件引用
        component: defineAsyncComponent(
          () => import("./blocks/nav/bar1/normal.vue")
        ), // 实际组件
        miniComponent: defineAsyncComponent(
          () => import("./blocks/nav/bar1/mini.vue")
        ), // 侧边栏预览组件
        popoverComponent: defineAsyncComponent(
          () => import("./blocks/nav/bar1/popover.vue")
        ), // 侧边栏预览组件
        schema: [
          {
            // 基本信息
            id: `bar1_${uuid({})}`, // 唯一标识符，用于查找和引用
            template: "bar1",
            height: "auto",
            config: {
              menu_1: {
                type: "Button",
                label: "Files",
                props: {
                  class: "!text-[12px] !text-black",
                  text: true,
                  plain: true,
                },
              },
              menu_2: {
                type: "Button",
                label: "Edit",
                props: {
                  class: "!text-[12px] !text-black",
                  text: true,
                  plain: true,
                },
              },
              menu_3: {
                type: "Button",
                label: "View",
                props: {
                  class: "!text-[12px] !text-black",
                  text: true,
                  plain: true,
                },
              },
            },
          },
        ],
      },
      {
        height: "auto",
        popoverHeight: "auto",
        desc:'hover弹出式菜单导航栏',
        id: `bar2`, // 唯一标识符，用于查找和引用
        // 组件引用
        component: defineAsyncComponent(
          () => import("./blocks/nav/bar2/normal.vue")
        ), // 实际组件
        miniComponent: defineAsyncComponent(
          () => import("./blocks/nav/bar2/mini.vue")
        ), // 侧边栏预览组件
        popoverComponent: defineAsyncComponent(
          () => import("./blocks/nav/bar2/popover.vue")
        ), // 侧边栏预览组件
        schema: [
          {
            // 基本信息
            id: `bar2_${uuid({})}`, // 唯一标识符，用于查找和引用
            template: "bar2",
            height: "auto",
            config: {
              menu: {
                type: "div",
                props: {
                  class: "p-5 box-border bottom text-surface-0",
                  text: true,
                  plain: true,
                },
                loop: {
                  item:'item',
                  index:'index',
                  data: [
                    { label: "Tab 1", content: "Tab 1 Content", value: "0" },
                    { label: "Tab 2", content: "Tab 2 Content", value: "1" },
                    { label: "Tab 3", content: "Tab 3 Content", value: "2" },
                  ]
                },
                events: ['mouseenter', 'mouseleave']
              }
            },
          },
        ],
      },
    ],

  },

  {
    name: "banner", // 显示名称
    type: "Banner", // 组件类型，用于渲染逻辑
    compList: [
      {
        // 组件引用
        id: `leftRight`, // 唯一标识符，用于查找和引用
        height: "60vh",
        popoverHeight: "15vh",
        component: defineAsyncComponent(
          () => import("./blocks/banner/leftRight/normal.vue")
        ), // 实际组件
        miniComponent: defineAsyncComponent(
          () => import("./blocks/banner/leftRight/mini.vue")
        ), // 侧边栏预览组件
        popoverComponent: defineAsyncComponent(
          () => import("./blocks/banner/leftRight/popover.vue")
        ), // 侧边栏预览组件
        desc:'左右型',
        schema: [
          {
            // 基本信息
            id: `leftRight_${uuid({})}`, // 唯一标识符，用于查找和引用
            height: "60vh",
            template: "leftRight",
            config: {
              title: {
                props: {
                  class: "text-xl xl:text-5xl font-bold text-primary-900 mb-4",
                },
                type: "div",
                label: "Create the screens your",
              },
              subTitle: {
                type: "p",
                label: "visitors deserve to see",
                props: {
                  class: "text-xl xl:text-5xl font-bold text-primary-900 mb-4",
                },
              },
              desc: {
                type: "p",
                label:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                props: {
                  class:
                    "text-surface-900/90 lg:text-surface-0 dark:text-surface-200 text-xl leading-normal mb-8 max-w-xl lg:max-w-none",
                },
              },
              // button:['Learn More','Live Demo']
              button1: {
                type: "Button",
                label: "Leran More",
                props: {
                  class: "",
                  type: "button",
                },
              },
              button2: {
                type: "Button",
                label: "Live Demo",
                props: {
                  class: "",
                  type: "button",
                  outlined: true,
                },
              },
            },
          },
        ],
      },
      {
        // 组件引用
        id: `single`, // 唯一标识符，用于查找和引用
        height: "60vh",
        popoverHeight: "15vh",
        component: defineAsyncComponent(
          () => import("./blocks/banner/single/normal.vue")
        ), // 实际组件
        miniComponent: defineAsyncComponent(
          () => import("./blocks/banner/single/mini.vue")
        ), // 侧边栏预览组件
        popoverComponent: defineAsyncComponent(
          () => import("./blocks/banner/single/popover.vue")
        ), // 侧边栏预览组件
        desc:'单图背景型',
        schema: [
          {
            // 基本信息
            id: `banner2_${uuid({})}`, // 唯一标识符，用于查找和引用
            height: "60vh",
            template: "single",
            config: {
              title: {
                props: {
                  class: "text-6xl font-bold text-surface-900 mb-4",
                },
                type: "div",
                label: "Create the screens your",
              },
              desc: {
                type: "p",
                label:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                props: {
                  class:
                    "text-surface-200 dark:text-surface-200 text-xl leading-normal mb-8 max-w-xl lg:max-w-none",
                },
              },
              // button:['Learn More','Live Demo']
              button1: {
                type: "Button",
                label: "Leran More",
                props: {
                  class: "!bg-surface-900 !text-surface-0",
                  type: "button",
                  rounded:true
                },
              },
              button2: {
                type: "Button",
                label: "Live Demo",
                props: {
                  class: "!text-surface-900 hover:!text-surface-0",
                  type: "button",
                  outlined: true,
                  rounded:true
                },
              },
            },
          },
        ],
      },
      {
        schema: [
          {
            // 基本信息
            id: `dup_${uuid({})}`, // 唯一标识符，用于查找和引用
            height: "60vh",
            template: "dup",
          },
        ],
        height: "60vh",
        popoverHeight: "15vh",
        id: `dup`, // 唯一标识符，用于查找和引用
        desc:'多图轮播型',
        // 组件引用
        component: defineAsyncComponent(
          () => import("./blocks/banner/dup/normal.vue")
        ), // 实际组件
        miniComponent: defineAsyncComponent(
          () => import("./blocks/banner/dup/mini.vue")
        ), // 侧边栏预览组件
        popoverComponent: defineAsyncComponent(
          () => import("./blocks/banner/dup/popover.vue")
        ), // 侧边栏预览组件
      },
      {
        schema: [
          {
            // 基本信息
            id: `product_${uuid({})}`, // 唯一标识符，用于查找和引用
            height: "60vh",
            template: "product",
          },
        ],
        height: "60vh",
        popoverHeight: "15vh",
        id: `product`, // 唯一标识符，用于查找和引用
        desc:'产品型',
        // 组件引用
        component: defineAsyncComponent(
          () => import("./blocks/banner/product/normal.vue")
        ), // 实际组件
        miniComponent: defineAsyncComponent(
          () => import("./blocks/banner/product/mini.vue")
        ), // 侧边栏预览组件
        popoverComponent: defineAsyncComponent(
          () => import("./blocks/banner/product/popover.vue")
        ), // 侧边栏预览组件
      },
    ],
  },
];
