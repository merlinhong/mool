<template>
  <component
    v-bind="$attrs"
    :is="Node"
    @click.stop="clickWrapper"
    :class="[
      {
        '!outline-1 !outline-black !outline-dashed':
          isSelectWrapper.currHover == id,
        '!outline-2 !outline-blue-600 ': isSelectWrapper.currWrapper == id,
      },
      'w-auto p-2 relative z-1000 ',
      className,
    ]"
    @mouseleave="isSelectWrapper.currHover = null"
    ref="wrapper"
  >
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { uuid } from "mooljs";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "div",
  },
  className: {
    type: String,
    default: "",
  },
});
const id = uuid({});

const Node =
  typeof resolveComponent(props.tag) == "string"
    ? props.tag
    : resolveComponent(props.tag);
const isSelectWrapper = inject<{
  value: { currWrapper: null | string; currHover: null | string };
}>("activeIds", { value: { currWrapper: null, currHover: null } }).value;
const clickWrapper = (e) => {
  isSelectWrapper.currWrapper = id;
  isSelectWrapper.currHover = null;
};
const wrapper = ref();
onMounted(()=>{
    wrapper.value?.addEventListener('mousemove',function(e){
    if(e.target===wrapper.value){
        isSelectWrapper.currHover = id
    }
})
})
</script>

<style></style>
