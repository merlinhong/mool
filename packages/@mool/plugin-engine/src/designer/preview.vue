<template>
  <div v-on="$attrs" style="box-sizing: border-box" class="h-full w-full">
    <component
      v-for="(card, ind) in pageSchema"
      :key="card.id"
      :class="['relative my-0.5', `${card.id}`]"
      style="position: relative"
      :is="list[card.template]"
    >
    </component>
  </div>
</template>

<script setup lang="ts">
import { componentLibrary } from "./schema";
import { useProcessDataEdit } from "./hooks/handleEdit";
import { usePreview } from "./hooks/usePreview";
const { getSchema } = usePreview();
const { handleAllEdit } = useProcessDataEdit();
const pageSchema = ref<any[]>([]);
// iframe页面监听postMessage事件
const list = computed<Record<string, any>>(() =>
  componentLibrary
    .map((_) => _.compList)
    .flat()
    .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.component }), {})
);

// const
onMounted(() => {
  console.log("Preview component mounted");
  console.log(window.opener);
  if (!window.opener) {
    pageSchema.value = getSchema();
    nextTick(async () => {
      handleAllEdit(pageSchema);
    });
  } else {
    
    window.opener?.postMessage(
      {
        status: "onload",
        type: "COMPONENT_LOADED",
      },
      "*"
    );
    window.addEventListener("message", (event) => {
      console.log(event);
      const { schema, type } = event.data ?? {};
      if (type == "preview") {
        pageSchema.value = schema;
        nextTick(async () => {
          handleAllEdit(pageSchema);
        });
      }
    });
  }
});
</script>

<style lang="scss" scoped></style>
