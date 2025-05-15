<template>
  <component :is="is" ref="childRef" @vue:mounted="childOnMounted"> </component>
</template>

<script setup lang="tsx">
import { DefineComponent } from "vue";
import EditorText from "./EditorText.vue";
import { h, render } from "vue";
import { PropType } from "vue";

const prop = defineProps({
  props: {
    type: Object as Record<string, any>,
    default: {},
  },
  is: {
    type: Object as PropType<DefineComponent>,
  },
});
const childRef = ref(null);
const activeIds = inject("activeIds", {});
// 是否是组件

const childOnMounted = (e) => {
  // 获取所有 data-replace="true" 的元素
  const elements = document.querySelectorAll("[data-edit]");
  // 遍历并替换每个元素
  elements.forEach(async (element) => {
    // 创建一个容器用于挂载组件
    const container = document.createElement("div");

    // 获取元素上的属性
    const type = element.getAttribute("data-edit") as string;
    // 创建一个 Vue 应用实例，用于设置 appContext
    const { loop, label } = prop.props[type];
    const Comp = () => (
      <div>
        {loop ? (
          loop.value?.map((item) => (
            <EditorText
              modelValue={item.label}
              tag={prop.props[type].type}
              {...prop.props[type].prop}
              onUpdate:modelValue={(e) => {
                app._instance!.props.modelValue = e;
                item.label = e;
              }}
            ></EditorText>
          ))
        ) : (
          <EditorText
            modelValue={label}
            tag={prop.props[type].type}
            {...prop.props[type].prop}
            onUpdate:modelValue={(e) => {
              app._instance!.props.modelValue = e;
              prop.props[type].label = e;
            }}
          ></EditorText>
        )}
      </div>
    );
    const app = createApp(Comp);
    // 设置 provide
    app.provide("activeIds", activeIds);
    const Module = (await import(`primevue/button`)).default;
    app.component("Button", Module);
    app.mount(container);
    // 替换当前元素
    element.parentNode?.replaceChild(container.firstChild!, element);
  });
};
</script>

<style></style>
