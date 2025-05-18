<template>
  <component
    :is="is"
    ref="childRef"
    @vue:mounted="childOnMounted"
    :key="renderKey"
  >
  </component>
</template>

<script setup lang="tsx">
import { DefineComponent } from "vue";
import EditorText from "./EditorText.vue";
import { h, render } from "vue";
import { PropType } from "vue";
import * as primevue from "primevue";

const prop = defineProps({
  props: {
    type: Object as Record<string, any>,
    default: {},
  },
  is: {
    type: Object as PropType<DefineComponent>,
  },
});
console.log(prop.is);

const childRef = ref(null);
const activeIds = inject("activeIds", {});
const renderKey = ref(0);
const isreload = ref(false);
// 是否是组件

// 工具函数：将字符串首字母转换为小写
function toLowerCaseFirst(str) {
  if (!str) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
}
const childOnMounted = (e) => {
  // if (isreload.value) return;
  // 获取所有 data-replace="true" 的元素
  const elements = document.querySelectorAll("[data-edit]");
  // 遍历并替换每个元素
  elements.forEach(async (element) => {
    // 创建一个容器用于挂载组件
    const container = document.createElement("div");

    // 获取元素上的属性
    const type = element.getAttribute("data-edit") as string;

    // 创建一个 Vue 应用实例，用于设置 appContext
    const { loop, events, label } = toRefs(prop.props[type]);
    const Comp = () => (
      <div>
        {loop ? (
          loop.value.data?.map((item) => (
            <EditorText
              value={item.value}
              key={item.value}
              modelValue={item.label}
              tag={prop.props[type].type}
              {...prop.props[type].props}
              onUpdate:modelValue={(e) => {
                item.label = e;
              }}
            >
            </EditorText>
          ))
        ) : (
          <EditorText
            modelValue={label.value}
            tag={prop.props[type].type}
            {...prop.props[type].props}
            onUpdate:modelValue={(e) => {
              label.value = e;
            }}
          >
          </EditorText>
        )}
      </div>
    );
    // ${toLowerCaseFirst(prop.props[type].type)}
    const app = createApp(Comp);
    // 设置 provide
    app.provide("activeIds", activeIds);

    for (const [key, component] of Object.entries(primevue)) {
      app.component(key, component);
    }
    // const Module = (await import(`primevue/tab`)).default;
    // app.component(prop.props[type].type, Module);
    app.mount(container);
    // 替换当前元素
    // element.parentNode?.replaceChild(container.firstChild!, element);
    // 替换旧节点
    if (element) {
      // 移除旧节点
      // 将多个新节点插入到旧节点的位置
      [...container.firstChild?.children].forEach((newNode, index) => {
        if (childRef.value && events) {
          events.value?.forEach((name, ind) => {
            newNode.addEventListener(name, () => {
              childRef.value[type][ind](newNode, index);
            });
          });
        }
        element.parentNode?.insertBefore(newNode, element);
      });
      element.parentNode?.removeChild(element);
    } else {
      console.error("旧节点不存在");
    }
    // renderKey.value++;
    // isreload.value = true;
    console.log(renderKey.value);
  });
};
</script>

<style></style>
