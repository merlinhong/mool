<template>
  <div v-on="$attrs" style="box-sizing: border-box" class="h-full w-full">
    <component
      v-for="(card, ind) in pageSchema"
      :key="card.id"
      :class="['relative my-0.5', `${card.id}`]"
      style="position: relative"
      :is="list[card.template]"
      @click="onComponentClick(card, $event)"
      @mouseover="onComponentHover(card, $event)"
      @dragover="onComponentDragOver($event, card, pageSchema)"
    >
    </component>
  </div>
</template>
<script setup lang="tsx">
import { ref, inject, onMounted, createApp, nextTick, computed, h } from "vue";
import { componentLibrary } from "./schema";
import { useProcessDataEdit } from "./hooks/handleEdit";
const {
  handleAllEdit,
  onComponentHover,
  onComponentClick,
  onComponentDragOver,
} = useProcessDataEdit();
const pageSchema = ref<any[]>([]);
// iframe页面监听postMessage事件
const list = computed<Record<string, any>>(() =>
  componentLibrary
    .map((_) => _.compList)
    .flat()
    .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.component }), {})
);

onMounted(() => {
   window.parent?.postMessage(
      {
        status: "onload",
        type: "IFRAME_LOADED",
      },
      "*"
    );
  window.addEventListener("message", (event) => {
    console.log("Received message in iframe:", event);
    
    const { schema, currIndex } = event.data ?? {};
    if (schema) {
      pageSchema.value = event.data.schema;
      nextTick(async () => {
        await handleAllEdit(pageSchema,currIndex);
      });
    }
  });
});
</script>

<style>
/* 添加响应式样式 */
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
@media (max-width: 1024px) {
  .iframe-container {
    margin: 10px;
  }
}
.hint {
  width: 100%;
  margin: auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.place {
  background-color: rgb(19, 89, 241);
  width: 100%;
  text-align: center;
  color: white;

  font-style: italic;
  font-family: "Courier New", Courier, monospace;
}
.iframe-container {
  /* width: 100%; */
  height: 100%;
  overflow: hidden;
}
/* 
.sortable-chosen{
  border: none;
} */
</style>
