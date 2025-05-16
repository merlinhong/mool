import { uuid } from "mooljs";
export const componentLibrary = [
  {
    name: "navigation bar", // 显示名称
    type: "navigationBar", // 组件类型，用于渲染逻辑
    compList: [
      {
        height: "auto",
        popoverHeight: "auto",
        id: `navigationBar`, // 唯一标识符，用于查找和引用
        // 组件引用
        component: defineAsyncComponent(
          () => import("./blocks/navigationBar/bar1/normal.vue")
        ), // 实际组件
        miniComponent: defineAsyncComponent(
          () => import("./blocks/navigationBar/bar1/mini.vue")
        ), // 侧边栏预览组件
        popoverComponent: defineAsyncComponent(
          () => import("./blocks/navigationBar/bar1/popover.vue")
        ), // 侧边栏预览组件
        schema: [
          {
            // 基本信息
            id: `navigationBar_${uuid({})}`, // 唯一标识符，用于查找和引用
            component: "navigationBar",
            height: "auto",
            config: {
              menu_1: {
                type: "Button",
                label: "Files",
                prop: {
                  class: "!text-[12px] !text-black",
                  text: true,
                  plain: true,
                },
              },
              menu_2: {
                type: "Button",
                label: "Edit",
                prop: {
                  class: "!text-[12px] !text-black",
                  text: true,
                  plain: true,
                },
              },
              menu_3: {
                type: "Button",
                label: "View",
                prop: {
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
        id: `navigationBar2`, // 唯一标识符，用于查找和引用
        // 组件引用
        component: defineAsyncComponent(
          () => import("./blocks/navigationBar/bar2/normal.vue")
        ), // 实际组件
        miniComponent: defineAsyncComponent(
          () => import("./blocks/navigationBar/bar2/mini.vue")
        ), // 侧边栏预览组件
        popoverComponent: defineAsyncComponent(
          () => import("./blocks/navigationBar/bar2/popover.vue")
        ), // 侧边栏预览组件
        schema: [
          {
            // 基本信息
            id: `navigationBar2_${uuid({})}`, // 唯一标识符，用于查找和引用
            component: "navigationBar2",
            height: "auto",
            config: {
              menu: {
                type: "div",
                prop: {
                  class: "p-5 box-border bottom text-surface-0",
                  text: true,
                  plain: true,
                },
                loop: {
                  value: [
                    { label: "Tab 1", content: "Tab 1 Content", value: "0" },
                    { label: "Tab 2", content: "Tab 2 Content", value: "1" },
                    { label: "Tab 3", content: "Tab 3 Content", value: "2" },
                  ]
                },
                events: ['mouseenter', 'mouseleave']
              },
              pulldown_content: {
                type: "p",
                label: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat`,
                prop: {
                  class: 'text-surface-0',
                }
              }
            },
          },
        ],
      },
    ],

    // 分类信息
    category: "toolbar", // 组件分类：layout, content, form, data, media 等
    tags: ["nav", "search", "login"], // 用于搜索和过滤

    // 图标和视觉信息
    icon: "pi pi-credit-card", // PrimeVue 图标
    thumbnail: "/thumbnails/card.png", // 可选的缩略图

    // 描述信息
    description: "顶部导航组件，可包含标题、菜单和登录以及搜索", // 简短描述
    docLink: "/docs/components/card", // 可选的文档链接

    // 拖拽配置
    dragConfig: {
      draggable: true, // 是否可拖拽
      droppable: false, // 是否可作为放置目标
      childrenAllowed: true, // 是否允许包含子组件
      maxChildren: null, // 最大子组件数量，null 表示无限制
      allowedChildTypes: ["*"], // 允许的子组件类型，* 表示允许所有
    },

    // 样式配置
    styleConfig: {
      hasCustomStyles: true, // 是否支持自定义样式
      defaultClasses: "bg-white rounded-lg shadow", // 默认 CSS 类
      styleProperties: [
        "padding",
        "margin",
        "background",
        "border",
        "borderRadius",
      ], // 可配置的样式属性
    },

    // 版本和兼容性信息
    version: "1.0.0",
    deprecated: false,
    minAppVersion: "1.0.0",
  },
  {
    name: "carousel", // 显示名称
    type: "Carousel", // 组件类型，用于渲染逻辑
    compList: [
      {
        schema: [
          {
            // 基本信息
            id: `galleria_${uuid({})}`, // 唯一标识符，用于查找和引用
            height: "60vh",
            component: "galleria",
          },
        ],
        height: "60vh",
        popoverHeight: "15vh",
        id: `galleria`, // 唯一标识符，用于查找和引用
        // 组件引用
        component: defineAsyncComponent(
          () => import("./blocks/carousel/carousel2/normal.vue")
        ), // 实际组件
        miniComponent: defineAsyncComponent(
          () => import("./blocks/carousel/carousel2/mini.vue")
        ), // 侧边栏预览组件
        popoverComponent: defineAsyncComponent(
          () => import("./blocks/carousel/carousel2/popover.vue")
        ), // 侧边栏预览组件
      },
    ],
  },
  {
    name: "banner", // 显示名称
    type: "Banner", // 组件类型，用于渲染逻辑
    compList: [
      {
        // 组件引用
        id: `banner`, // 唯一标识符，用于查找和引用
        height: "60vh",
        popoverHeight: "15vh",
        component: defineAsyncComponent(
          () => import("./blocks/banner/banner1/normal.vue")
        ), // 实际组件
        miniComponent: defineAsyncComponent(
          () => import("./blocks/banner/banner1/mini.vue")
        ), // 侧边栏预览组件
        popoverComponent: defineAsyncComponent(
          () => import("./blocks/banner/banner1/popover.vue")
        ), // 侧边栏预览组件
        schema: [
          {
            // 基本信息
            id: `banner_${uuid({})}`, // 唯一标识符，用于查找和引用
            height: "60vh",
            component: "banner",
            config: {
              title: {
                prop: {
                  class: "text-xl xl:text-5xl font-bold text-primary-900 mb-4",
                },
                type: "div",
                label: "Create the screens your",
              },
              subTitle: {
                type: "p",
                label: "visitors deserve to see",
                prop: {
                  class: "text-xl xl:text-5xl font-bold text-primary-900 mb-4",
                },
              },
              desc: {
                type: "p",
                label:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                prop: {
                  class:
                    "text-surface-900/90 lg:text-surface-0 dark:text-surface-200 text-xl leading-normal mb-8 max-w-xl lg:max-w-none",
                },
              },
              // button:['Learn More','Live Demo']
              button1: {
                type: "Button",
                label: "Leran More",
                prop: {
                  class: "",
                  type: "button",
                },
              },
              button2: {
                type: "Button",
                label: "Live Demo",
                prop: {
                  class: "",
                  type: "button",
                  outlined: true,
                },
              },
            },
          },
        ],
      },
    ],
  },
];
