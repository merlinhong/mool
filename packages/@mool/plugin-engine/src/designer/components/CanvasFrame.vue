<script setup lang="tsx">
import { ref, onMounted, watch, nextTick, onUnmounted, Ref } from "vue";
// import BasicCanvas from "./BasicCanvas.vue";
import { useMagicKeys, useEventListener } from "@vueuse/core";
import BasicPage from "./canvasContainer.vue";
defineOptions({
  inheritAttrs:true
})
const props = defineProps<{
  // pageConfig: any;
  // currentConf?: any;
  // hasActive?: boolean;
  // customStyle?: { width?: string; margin?: string };
  // loading: boolean;
  // isPreview?: boolean;
  // ctx?: Function;
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
    pageConfig.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]));
  }
};

// 添加一个重做函数
const redo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++;
    pageConfig.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]));
  }
};
// 粘贴板
const pasteIframe = ref<Col | null>(null);
onMounted(() => {
  if (iframeRef.value) {
    const iframeDoc = iframeRef.value.contentDocument;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                margin: 0; 
                padding: 0; 
                overflow: hidden; 
              }
              #canvas-container { 
                width: 100%; 
                height: 100%; 
                overflow-y: auto;
                scrollbar-width: none;
                -ms-overflow-style: none;
              }
              #canvas-container::-webkit-scrollbar {
                display: none;
              }
              .canvas-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
              }
                
            </style>
          </head>
          <body>
            <div id="canvas-container"></div>
          </body>
        </html>
      `);
      iframeDoc.close();

      // 注入 Tailwind CSS
      injectTailwindCSS(iframeDoc);

      // 复制主文档的样式到 iframe
      const styles = Array.from(document.styleSheets);
      styles.forEach((styleSheet) => {
        if (styleSheet.href) {
          const linkElem = iframeDoc.createElement("link");
          linkElem.rel = "stylesheet";
          linkElem.href = styleSheet.href;
          iframeDoc.head.appendChild(linkElem);
        } else {
          const styleElem = iframeDoc.createElement("style");
          Array.from(styleSheet.cssRules).forEach((rule) => {
            styleElem.appendChild(iframeDoc.createTextNode(rule.cssText));
          });
          iframeDoc.head.appendChild(styleElem);
        }
      });
    }
  }
  const { ctrl_z, ctrl_y, ctrl_c, ctrl_v, meta_z, meta_y, meta_c, meta_v, ctrl_x, meta_x } = useMagicKeys({
    target: iframeRef.value?.contentDocument as EventTarget,
  });
  watch(
    [ctrl_z, meta_z, ctrl_y, meta_y, ctrl_c, meta_c, ctrl_v, meta_v, ctrl_x, meta_x],
    ([ctrlZ, metaZ, ctrlY, metaY, ctrlC, metaC, ctrlV, metaV, ctrlX, metaX]) => {
      if (ctrlZ || metaZ) {
        // 撤销
        undo();
      } else if (ctrlY || metaY) {
        // 重做
        redo();
      } else if (ctrlC || metaC) {
        // 复制
        copy();
      } else if (ctrlV || metaV) {
        // 粘贴
        paste();
      } else if (ctrlX || metaX) {
        // 删除
        canvasRef.value?.del(currentConf.value?.id as string);
      }
    },
  );
});
const del = () => {
  if (currentConf.value) {
    currentConf.value.children = currentConf.value.children?.filter((item) => item.id !== currentConf.value?.id);
  }
};
const copy = () => {
  pasteIframe.value = JSON.parse(JSON.stringify(currentConf.value));
};
const paste = () => {
  if (pasteIframe.value) {
    currentConf.value?.children?.push({ ...pasteIframe.value, id: Date.now().toString().substring(8) });
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
      if (JSON.stringify(newValue) !== JSON.stringify(history.value[historyIndex.value])) {
        saveToHistory(newValue);
      }
    });
  },
  { deep: true },
);

console.log(props.isPreview);

</script>

<template>
  <!-- <div v-on="$attrs"> -->
    <BasicPage/>
  <!-- </div> -->
</template>

<style scoped>

/* 添加响应式样式 */
@media (max-width: 1024px) {
  .iframe-container {
    margin: 10px;
  }
}
</style>
