<script setup lang="tsx">
import { ref, onMounted, watch, nextTick, onUnmounted, Ref } from "vue";
// import BasicCanvas from "./BasicCanvas.vue";
import { useMagicKeys, useEventListener } from "@vueuse/core";
import BasicPage from "./canvasContainer.vue";
import { VueDraggable } from "vue-draggable-plus";
import { componentLibrary } from "../schema";

defineOptions({
  inheritAttrs: true,
});
const props = defineProps<{
  // pageConfig: any;
  // currentConf?: any;
  // hasActive?: boolean;
  // customStyle?: { width?: string; margin?: string };
  // loading: boolean;
  // isPreview?: boolean;
  // ctx?: Function;
  hint: boolean;
  place: {
    el: HTMLElement;
    orientation: "after" | "before";
  };
}>();

const pageConfig = defineModel<any>("pageConfig");
const currentConf = defineModel<any | null>("current");
const emit = defineEmits<{
  (e: "update:pageConfig", value: Page): void;
  (e: "active", value: any): void;
  (e: "resize", width: number, height: number): void; // 新增 resize 事件
}>();

const iframeRef = ref<HTMLIFrameElement | null>(null);
const canvasRef = ref<InstanceType<typeof BasicCanvas> | null>(null);

const injectTailwindCSS = (doc: Document) => {
  const Script = doc.createElement("script");
  Script.src = new URL("../js/tailwind.js", import.meta.url).href;
  doc.head.appendChild(Script);
};
// 添加这些新的 ref
const history = ref<Page[]>([]);
const historyIndex = ref(-1);

// 添加一个新的函数来保存历史记录
const saveToHistory = (config: Page) => {
  // 如果当前不在历史记录的末尾，删除后面的记录
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

// 添加一个重做函数
const redo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++;
    pageConfig.value = JSON.parse(
      JSON.stringify(history.value[historyIndex.value])
    );
  }
};
// 粘贴板
const pasteIframe = ref<Col | null>(null);

const del = () => {
  if (currentConf.value) {
    currentConf.value.children = currentConf.value.children?.filter(
      (item) => item.id !== currentConf.value?.id
    );
  }
};
const copy = () => {
  pasteIframe.value = JSON.parse(JSON.stringify(currentConf.value));
};
const paste = () => {
  if (pasteIframe.value) {
    currentConf.value?.children?.push({
      ...pasteIframe.value,
      id: Date.now().toString().substring(8),
    });
  }
};
watch(
  () => props.pageConfig,
  (newValue) => {
    nextTick(() => {
      if (canvasRef.value) {
        canvasRef.value.init(props.pageConfig);
      }
      // 只有当新值与当前历史记录的最后一项不同时，才保存到历史记录
      if (
        JSON.stringify(newValue) !==
        JSON.stringify(history.value[historyIndex.value])
      ) {
        saveToHistory(newValue);
      }
    });
  },
  { deep: true }
);

const cardSchema = ref<any[]>([]);
const isDragging = ref(false);
const change = (e) => {
  e.item.classList.remove("w-[45%]");
  isDragging.value = true;
};
const list = computed<Record<string, any>>(() =>
  componentLibrary
    .map((_) => _.compList)
    .flat()
    .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.component }), {})
);
console.log(list.value);
const hint = ref();

watch(
  () => props.place,
  (item) => {
    nextTick(() => {
      console.log(hint);

      if (!item.el.parentNode) {
        item.el.appendChild(hint.value);
      } else {
        if (item.orientation == "before") {
          item.el.parentNode?.insertBefore(hint.value, item.el);
        } else {
          item.el.parentNode?.insertBefore(hint.value, item.el.nextSibling);
        }
      }
    });
  }
);
watch(()=>props.hint,(n)=>{
  if(n){
    hint.value.classList.remove('hint');
  }
})
</script>

<template>
  <div
    v-on="$attrs"
    class="bg-light-800 absolute w-[77vw] h-[93.5vh] left-4rem overflow-y-scroll"
    style="box-sizing: border-box"
    :style="{ width: 'calc(100vw - 24rem)' }"
  >
    <VueDraggable
      v-model="cardSchema"
      :animation="150"
      group="blocks"
      :class="{ '!ml-[0]': isDragging }"
      class="h-[100%] ml-[28rem]"
      @change="change"
    >
      <div class="hint" ref="hint">
        {{ "从左边拖拽组件放到此处" }}
      </div>
      <div v-for="card in cardSchema" :key="card.id">
        <!-- <component :is="card.Hint" v-if="hint"/> -->
        <component :is="list[card.component]" :height="card.height" />
      </div>
    </VueDraggable>
  </div>
</template>

<style scoped>
/* 添加响应式样式 */
@media (max-width: 1024px) {
  .iframe-container {
    margin: 10px;
  }
}
.hint {
  width: 100%;
  height: 90vh;
  display:flex;
  align-items: center;
}
.iframe-container {
  /* width: 100%; */
  height: 100%;
  overflow: hidden;
}
</style>
