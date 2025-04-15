<script setup lang="tsx">
// import type { ComponentType, Render, Col, RowScope } from "@/mool/types/BasicForm";
// import { omit } from "@/mool/utils";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import * as vue from "vue";
import { VueDraggable } from "vue-draggable-plus";

defineOptions({
  inheritAttrs: true,
});

const props = defineProps({
  // 页面区块的配置json schema
  schema: {
    type: Object as PropType<any>,
    default: () => [],
  },
});

const FooterBar = function () {
  return (
    <div
      class="mllowcode_footerBar"
      style={{
        position: "absolute",
        bottom: "-25px",
        right: 0,
        width: "3rem",
        height: "25px",
        backgroundColor: "#32adf7",
        borderTop: "1px solid #f1f1f1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <i-ep-document-copy
        style={{ color: "#fff", fontSize: "1rem", cursor: "pointer" }}
        onClick={() => {
          emit("copy", currAEl.value.clickId);
        }}
      />
      <i-ep-delete
        style={{ color: "#fff", fontSize: "1rem", cursor: "pointer" }}
        onClick={() => {
          emit("delete", currAEl.value.clickId);
        }}
      />
    </div>
  );
};
const HeaderBar = function (props: { name?: string }) {
  return (
    <div class="mllowcode_footerBar absolute -top-[30px] -left-[2px] px-[5px] py-[2px] w-fit h-[25px] bg-[#32adf7] border-t border-[#f1f1f1] flex justify-center items-center z-[999]">
      <span style={{ color: "#fff", fontSize: "16px" }}>{props.name}</span>
      <i-ep-setting
        style={{ color: "#fff", fontSize: "0.8rem", cursor: "pointer" }}
        onClick={() => {
          // 打开设置弹窗
        }}
      />
    </div>
  );
};
const list = {
  CardBlock: defineAsyncComponent(() => import("../blocks/card.vue")),
};
const cardSchema = ref(props.schema);
const drawer = inject<Ref<boolean>>("drawer");
</script>

<template>
  <section
    v-on="$attrs"
    class="h-[80vh] bg-light-800 iframe-container"
    style="box-sizing: border-box"
  >
    <VueDraggable
      v-model="cardSchema"
      :animation="150"
      group="blocks"
      class="h-[100%]"
    >
      <div v-for="card in cardSchema">
        <component :is="list[card.component]" :schema="card" />
      </div>
    </VueDraggable>
  </section>
</template>

<style lang="less" scoped>
.iframe-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

:deep(.hover-effect) {
  &:hover {
    background-color: #f1f1f1 !important;
  }
}

:deep(.el-col) {
  position: relative;
}

:deep(.el-form-item__content) {
  align-items: start;
  position: static;
}

.box {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 10px;
  padding: 3px 0;
  height: 50px;
  font-size: 13px;
  background-color: #f1f1f1;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nonEmpty {
  height: fit-content;
  padding: 5px;
  background-color: #fff;
}

.canvascomp {
  position: relative;
  cursor: move;
  box-sizing: border-box;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.insertTop {
  border-top: 3px solid #32adf7 !important;
}

.insertBottom {
  border-bottom: 3px solid #32adf7 !important;
}

.hover_child {
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px dashed #32adf7;
    pointer-events: none;
  }

  &::before {
    display: block;
    content: attr(data-tag);
    position: absolute;
    top: -20px;
    left: 0;
    width: fit-content;
    color: #32adf7;
    z-index: 999;
  }

  // 新增：为表格组件添加特殊处理
  &[data-tag="ElTable"] {
    &::after {
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      pointer-events: none;
    }
  }
}

.active {
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid #32adf7;
    pointer-events: none;
  }

  // 新增：为表格组件添加特殊处理
  &[data-tag="ElTable"] {
    &::after {
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      pointer-events: none;
    }
  }
}

.dragover {
  position: relative;
  background-color: rgb(233, 250, 250) !important;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px dashed #32adf7;
    pointer-events: none;
  }

  &::before {
    display: block;
    content: attr(data-tag);
    position: absolute;
    top: -20px;
    left: 0;
    width: fit-content;
    color: #32adf7;
  }
}

.editBtn {
  //绝对定位布局

  position: absolute;

  right: 10px;

  bottom: 3px;

  font-size: 20px;

  color: #ccc;

  cursor: pointer;

  color: #838383;

  border-radius: 20px;

  border: 1px solid #ccc;

  background-color: #fff;

  padding: 4px 0;

  width: 55px;

  font-size: 12px;

  height: 13px;

  display: flex;

  justify-content: space-evenly;
}

.page_search {
  background-color: #f1f1f1;

  height: auto;

  border-radius: 5px;

  padding: 10px 20px;

  :deep(.linebreak) {
    .el-form-item__label {
      width: 80px;

      height: auto !important;

      line-height: 20px;

      text-align: right;
    }
  }

  .form6-inline {
    padding: 10px 0 0 30px;
  }
}

:deep(.el-form-item__label-wrap) {
  margin-left: 0px !important;
}

:deep(.el-radio:last-child) {
  margin-right: 32px;
}

:deep(.el-radio-group) {
  align-items: start;
}

.demo-tabs > .el-tabs__content {
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
  height: 88%;
}

:deep(.el-tabs__content) {
  padding: 22px;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.el-menu {
  border: none;
}
</style>
