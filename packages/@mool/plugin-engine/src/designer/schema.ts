export const componentLibrary = [
  {
    name: "顶部导航", // 显示名称
    type: "Toolbar", // 组件类型，用于渲染逻辑
    compList: [
      {
        // 基本信息
        id: "tool-bar", // 唯一标识符，用于查找和引用
        // 组件引用
        component: defineAsyncComponent(() => import("./blocks/Toolbar.vue")), // 实际组件
        miniComponent: defineAsyncComponent(
          () => import("./blocks/miniToolbar.vue")
        ), // 侧边栏预览组件
        // 默认属性
        defaultProps: {
          title: "卡片标题",
          subtitle: "卡片副标题",
          showFooter: true,
          elevation: 1,
        },

        // 可配置属性定义（用于属性面板）
        propDefinitions: [
          {
            name: "title",
            label: "标题",
            type: "string",
            defaultValue: "卡片标题",
            required: false,
          },
          {
            name: "subtitle",
            label: "副标题",
            type: "string",
            defaultValue: "卡片副标题",
            required: false,
          },
        ],
      },
      {
        // 基本信息
        id: "tool-bar_223", // 唯一标识符，用于查找和引用
        // 组件引用
        component: defineAsyncComponent(() => import("./blocks/Toolbar.vue")), // 实际组件
        miniComponent: defineAsyncComponent(
          () => import("./blocks/miniToolbar.vue")
        ), // 侧边栏预览组件
        // 默认属性
        defaultProps: {
          title: "卡片标题",
          subtitle: "卡片副标题",
          showFooter: true,
          elevation: 1,
        },

        // 可配置属性定义（用于属性面板）
        propDefinitions: [
          {
            name: "title",
            label: "标题",
            type: "string",
            defaultValue: "卡片标题",
            required: false,
          },
          {
            name: "subtitle",
            label: "副标题",
            type: "string",
            defaultValue: "卡片副标题",
            required: false,
          },
        ],
      }
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
];
