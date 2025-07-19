<script setup lang="tsx">
import TopBar from "./components/TopBar.vue";
import SideBar from "./components/SideBar.vue";
import CanvasFrame from "./components/iframe.vue"; // 导入 CanvasFrame 组件
import ConfigPlane from "./components/propSetting.vue";
import { useMagicKeys, useEventListener } from "@vueuse/core";
import { useStore, useLoading, } from "mooljs";
import {usePreview} from './hooks/usePreview';
import { useProvide } from "./hooks/useProvide";
const route = useRoute();
const router = useRouter();

const { loading, setLoading } = useLoading(true);

const pageName = ref("");

const {getUserName,setUserName} = usePreview();

const {drawer} = useProvide();
watch(
  () => route.query,
  (n, o) => {
    // querySchema(n.id as string);
    pageName.value = n.pageName as string;
  }
);

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

const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
    console.log("Undo triggered");
    undo();
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
    console.log("Save triggered");
    // 在这里添加保存逻辑
  }
};

const back = () => {
  router.push({
    path: "apply",
    query: {
      name: route.query?.projectName as string,
    },
  });
};
const onMouseenter = () => {
  drawer.value = false;
};
const hint = ref(false);

const activeIds = ref({
  currActive: null,
  currHover: null,
  currRect: null,
  currWrapper: null,
});

onMounted(() => {
  router.replace({
    query: {
      ...route.query,
      uid: getUserName()
    },
  });
  setUserName();
});
</script>

<template>
  <div class="h-[100vh] flex flex-col">
    <TopBar />
    <Splitter class="h-[100%]">
      <SplitterPanel>
        <main class="flex panel_container justify-between">
          <SideBar v-model:hint="hint" v-model:activeIds="activeIds" />
          <!-- 画布组件，用于显示和编辑页面内容 -->
          <!-- v-model:pageConfig 用于双向绑定页面配置 -->
          <CanvasFrame
            @mouseenter="onMouseenter"
            :hint="hint"
            v-model:activeIds="activeIds"
          />
          <aside
            class="page-design-config !w-[21rem]"
            style="background-color: var(--surface-ground)"
          >
            <ConfigPlane></ConfigPlane>
          </aside>
        </main>
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
  background-color: #fff;
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
