<script setup lang="tsx">
import TopBar from "./components/TopBar.vue";
import SideBar from "./components/SideBar.vue";
import CanvasFrame from "./components/CanvasFrame.vue"; // 导入 CanvasFrame 组件
// import ConfigPlane from "./components/settings.vue";
import { useMagicKeys, useEventListener } from "@vueuse/core";
import { useStore, useLoading } from "mooljs";
const route = useRoute();
const router = useRouter();

const { loading, setLoading } = useLoading(true);
// const { canvas } = useStore();
const canvasFrameRef = ref<InstanceType<typeof CanvasFrame> | null>(null);

const projectName = ref("");
const pageName = ref("");

const pageConfig = ref({
  children: [],
  id: "55ty4epk",
  css: "",
});
const clonePageConfig = { ...pageConfig.value };
const containerStyle = ref<{ width?: string; margin?: string }>({});
const hasActive = ref(false);

const openBar = (arr: [boolean, string]) => {
  hasActive.value = arr[0];
  containerStyle.value.margin = arr[1];
};
const changeSize = (option: { size: string; isPC: boolean }) => {
  containerStyle.value.width = option.size;
};
watch(
  () => route.query,
  (n, o) => {
    querySchema(n.id as string);
    pageName.value = n.pageName as string;
  }
);
const openPage = (args: string[]) => {
  router.push({
    path: "/editor",
    query: {
      id: args[0],
      projectName: route.query.projectName,
      pageName: args[1],
    },
  });
  querySchema(args[0]);
};
const querySchema = (id: string = "cmef4ey5") => {
  setLoading(true);
  Object.assign(pageConfig.value, clonePageConfig);
  fetch(`/api/query-schema/${id}`, {
    method: "get",
  })
    .then((res) => res.json())
    .then((res) => {
      nextTick(() => {
        setTimeout(() => {
          pageConfig.value = res.data.pageInfo.schema;
          const styleEle = document.createElement("style");
          styleEle.dataset.id = pageConfig.value.id;
          styleEle.innerHTML = pageConfig.value.css;
          document.head.appendChild(styleEle);
          setLoading(false);
        }, 200);
      });
    });
};

// 添加这些新的 ref
const history = ref([]);
const historyIndex = ref(-1);

// 添加一个新的函数来保存历史记录
const saveToHistory = (config: any) => {
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1);
  }
  history.value.push(JSON.parse(JSON.stringify(config)));
  historyIndex.value = history.value.length - 1;
};

// 添加一个撤销函数
const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--;
    pageConfig.value = JSON.parse(
      JSON.stringify(history.value[historyIndex.value])
    );
  }
};

// 监听 pageConfig 的变化
watch(
  () => pageConfig.value,
  (newValue) => {
    saveToHistory(newValue);
  },
  { deep: true }
);
const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
    console.log("Undo triggered");
    undo();
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
    console.log("Save triggered");
    // 在这里添加保存逻辑
  }
};
// 修改组件挂载逻辑
onMounted(() => {
  projectName.value = route.query?.projectName as string;
  pageName.value = route.query?.pageName as string;
  // querySchema(route.query?.id as string);
});

const openPanel = ref<Record<"js" | "ref", boolean>>({
  js: false,
  ref: false,
});
const back = () => {
  router.push({
    path: "apply",
    query: {
      name: route.query?.projectName as string,
    },
  });
};
const drawer = ref(false);
provide("drawer", drawer);
const onMouseenter = () => {
  // drawer.value = false;
};
const hint = ref(false);
const place = ref<any | null>(null);
</script>

<template>
  <div class="h-[100vh] flex flex-col">
    <TopBar v-model:pageConfig="pageConfig" @changeSize="changeSize" />
    <Splitter class="h-[100%]">
      <SplitterPanel>
        <div class="flex panel_container justify-between">
          <!-- 侧边栏组件，用于显示和编辑页面配置 -->
          <!-- v-model:pageConfig 用于双向绑定页面配置 -->
          <!-- @change 事件用于监听侧边栏的打开或关闭 -->
          <SideBar
            v-model:pageConfig="pageConfig"
            @change="openBar"
            @editPage="openPage"
            v-model:openPanel="openPanel"
            v-model:hint="hint"
            @place="
              (item) => {
                console.log(item);
                
                place = item;
              }
            "
          />
          <!-- 画布组件，用于显示和编辑页面内容 -->
          <!-- v-model:pageConfig 用于双向绑定页面配置 -->

          <CanvasFrame @mouseenter="onMouseenter" :hint="hint" :place="place" />

          <!-- 侧边栏组件，用于显示和编辑页面配置 -->
          <el-aside class="page-design-config bg-zinc-700 !w-[20rem]">
            <!-- <config-plane :is-show-config="true" v-model:current="currentConf" v-model:pageConfig="pageConfig"
            @openJs="openPanel.js = true" @openRef="openPanel.ref = true" /> -->
          </el-aside>
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<style lang="less" scoped>
:deep(.hover-effect) {
  &:hover {
    background-color: #f1f1f1 !important;
  }
}
.panel_container {
  height: calc((100% - 0.2rem)) !important;
}

.common-layout {
  position: relative;
  outline: none;
  /* 添加这行以去除 focus 时的轮廓 */
}

.enter_page {
  border: 1px dashed #32adf7;
}

:deep(.dragging) {
  background-color: #fff;

  // border: 1px dashed @success-color;

  position: relative;

  &:after {
    content: "";

    width: 100%;

    height: 100%;

    background-color: #fff;

    position: absolute;

    top: 0;

    left: 0;

    right: 0;

    bottom: 0;

    z-index: 999;
  }
}
</style>
