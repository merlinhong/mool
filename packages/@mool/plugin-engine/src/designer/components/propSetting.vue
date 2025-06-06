<template>
  <div class="property-designer">
    <div class="card dark-card">
      <h2 class="title">属性设计器</h2>

      <Accordion :activeIndex="0">
        <!-- 基础属性组 -->
        <AccordionTab header="基础属性">
          <div class="property-group  h-[20vh] lg:h-[50vh]">
            <div
              class="property-item"
              v-for="prop in basicProps"
              :key="prop.name"
            >
              <label :for="prop.name">{{ prop.label }}</label>

              <!-- 文本输入 -->
              <InputText
                v-if="prop.type === 'text'"
                :id="prop.name"
                v-model="modelValues[prop.name]"
                :placeholder="prop.placeholder"
                class="dark-input"
              />

              <!-- 数字输入 -->
              <InputNumber
                v-else-if="prop.type === 'number'"
                :id="prop.name"
                v-model="modelValues[prop.name]"
                :min="prop.min"
                :max="prop.max"
                :step="prop.step"
                class="dark-input"
              />

              <!-- 下拉选择 -->
              <Dropdown
                v-else-if="prop.type === 'select'"
                :id="prop.name"
                v-model="modelValues[prop.name]"
                :options="prop.options"
                optionLabel="label"
                optionValue="value"
                placeholder="请选择"
                class="dark-dropdown w-full"
              />

              <!-- 颜色选择器 -->
              <ColorPicker
                v-else-if="prop.type === 'color'"
                :id="prop.name"
                v-model="modelValues[prop.name]"
                format="hex"
                class="dark-colorpicker"
              />

              <!-- 开关 -->
              <!-- <InputSwitch
                v-else-if="prop.type === 'boolean'"
                :id="prop.name"
                v-model="modelValues[prop.name]"
                class="dark-switch"
              /> -->
              <ToggleSwitch v-model="modelValues[prop.name]" />
            </div>
          </div>
        </AccordionTab>

        <!-- 样式属性组 -->
        <AccordionTab header="样式属性">
          <div class="property-group h-[20vh] lg:h-[50vh]">
            <div
              class="property-item"
              v-for="prop in styleProps"
              :key="prop.name"
            >
              <label :for="prop.name">{{ prop.label }}</label>

              <!-- 尺寸输入带单位选择 -->
              <div
                v-if="prop.type === 'dimension'"
                class="p-inputgroup dark-inputgroup"
              >
                <InputNumber
                  :id="prop.name"
                  v-model="dimensionValues[prop.name].value"
                  :min="prop.min"
                  :max="prop.max"
                  :step="prop.step"
                  class="dark-input"
                />
                <Dropdown
                  v-model="dimensionValues[prop.name].unit"
                  :options="dimensionUnits"
                  optionLabel="label"
                  optionValue="value"
                  class="dark-dropdown unit-dropdown"
                />
              </div>

              <!-- 字体选择 -->
              <Dropdown
                v-else-if="prop.type === 'font'"
                :id="prop.name"
                v-model="modelValues[prop.name]"
                :options="fontOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="选择字体"
                class="dark-dropdown w-full"
              />

              <!-- 颜色选择器 -->
              <ColorPicker
                v-else-if="prop.type === 'color'"
                :id="prop.name"
                v-model="modelValues[prop.name]"
                format="hex"
                class="dark-colorpicker"
              />

              <!-- 边框样式 -->
              <Dropdown
                v-else-if="prop.type === 'borderStyle'"
                :id="prop.name"
                v-model="modelValues[prop.name]"
                :options="borderStyleOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="选择边框样式"
                class="dark-dropdown w-full"
              />
            </div>
          </div>
        </AccordionTab>

        <!-- 布局属性组 -->
        <AccordionTab header="布局属性">
          <div class="property-group h-[20vh] lg:h-[50vh]">
            <div
              class="property-item"
              v-for="prop in layoutProps"
              :key="prop.name"
            >
              <label :for="prop.name">{{ prop.label }}</label>

              <!-- 下拉选择 -->
              <Dropdown
                v-if="prop.type === 'select'"
                :id="prop.name"
                v-model="modelValues[prop.name]"
                :options="prop.options"
                optionLabel="label"
                optionValue="value"
                placeholder="请选择"
                class="dark-dropdown w-full"
              />

              <!-- 数字输入 -->
              <InputNumber
                v-else-if="prop.type === 'number'"
                :id="prop.name"
                v-model="modelValues[prop.name]"
                :min="prop.min"
                :max="prop.max"
                :step="prop.step"
                class="dark-input"
              />

              <!-- 尺寸输入带单位选择 -->
              <div
                v-else-if="prop.type === 'dimension'"
                class="p-inputgroup dark-inputgroup"
              >
                <InputNumber
                  :id="prop.name"
                  v-model="dimensionValues[prop.name].value"
                  :min="prop.min"
                  :max="prop.max"
                  :step="prop.step"
                  class="dark-input"
                />
                <Dropdown
                  v-model="dimensionValues[prop.name].unit"
                  :options="dimensionUnits"
                  optionLabel="label"
                  optionValue="value"
                  class="dark-dropdown unit-dropdown"
                />
              </div>
            </div>
          </div>
        </AccordionTab>

        <!-- 高级属性组 -->
        <AccordionTab header="高级属性">
          <div class="property-group h-[20vh] lg:h-[50vh]">
            <div
              class="property-item"
              v-for="prop in advancedProps"
              :key="prop.name"
            >
              <label :for="prop.name">{{ prop.label }}</label>

              <!-- 文本区域 -->
              <Textarea
                v-if="prop.type === 'textarea'"
                :id="prop.name"
                v-model="modelValues[prop.name]"
                :rows="5"
                :placeholder="prop.placeholder"
                class="dark-textarea w-full"
              />

              <!-- JSON编辑器 -->
              <div v-else-if="prop.type === 'json'" class="json-editor">
                <Button
                  icon="pi pi-external-link"
                  label="编辑JSON"
                  @click="openJsonEditor(prop.name)"
                  class="p-button-sm dark-button"
                />
              </div>

              <!-- 事件编辑器 -->
              <div v-else-if="prop.type === 'event'" class="event-editor">
                <Button
                  icon="pi pi-code"
                  label="编辑事件"
                  @click="openEventEditor(prop.name)"
                  class="p-button-sm dark-button"
                />
              </div>
            </div>
          </div>
        </AccordionTab>
      </Accordion>

      

      <!-- JSON编辑对话框 -->
      <Dialog
        v-model:visible="jsonDialogVisible"
        header="编辑JSON"
        :style="{ width: '50vw' }"
        class="dark-dialog"
      >
        <Textarea
          v-model="jsonEditorContent"
          rows="10"
          class="w-full dark-textarea code-editor"
        />
        <template #footer>
          <Button
            label="取消"
            icon="pi pi-times"
            @click="closeJsonEditor"
            class="p-button-text dark-button"
          />
          <Button
            label="应用"
            icon="pi pi-check"
            @click="applyJsonChanges"
            class="dark-button"
          />
        </template>
      </Dialog>

      <!-- 事件编辑对话框 -->
      <Dialog
        v-model:visible="eventDialogVisible"
        header="编辑事件"
        :style="{ width: '50vw' }"
        class="dark-dialog"
      >
        <Textarea
          v-model="eventEditorContent"
          rows="10"
          class="w-full dark-textarea code-editor"
        />
        <template #footer>
          <Button
            label="取消"
            icon="pi pi-times"
            @click="closeEventEditor"
            class="p-button-text dark-button"
          />
          <Button
            label="应用"
            icon="pi pi-check"
            @click="applyEventChanges"
            class="dark-button"
          />
        </template>
      </Dialog>
    </div>
   
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";

// 属性定义
const props = defineProps({
  // 要编辑的组件
  component: {
    type: Object,
    required: true,
  },
  // 初始属性值
  initialValues: {
    type: Object,
    default: () => ({}),
  },
});

// 事件
const emit = defineEmits(["update:values", "apply"]);
onMounted(() => {
});
// 基础属性
const basicProps = [
  { name: "id", label: "ID", type: "text", placeholder: "输入组件ID" },
  { name: "name", label: "名称", type: "text", placeholder: "输入组件名称" },
  { name: "visible", label: "可见性", type: "boolean" },
  { name: "disabled", label: "禁用", type: "boolean" },
  {
    name: "size",
    label: "尺寸",
    type: "select",
    options: [
      { label: "小", value: "small" },
      { label: "中", value: "medium" },
      { label: "大", value: "large" },
    ],
  },
];


// 样式属性
const styleProps = [
  {
    name: "width",
    label: "宽度",
    type: "dimension",
    min: 0,
    max: 1000,
    step: 1,
  },
  {
    name: "height",
    label: "高度",
    type: "dimension",
    min: 0,
    max: 1000,
    step: 1,
  },
  { name: "backgroundColor", label: "背景色", type: "color" },
  { name: "textColor", label: "文字颜色", type: "color" },
  { name: "borderColor", label: "边框颜色", type: "color" },
  {
    name: "borderWidth",
    label: "边框宽度",
    type: "dimension",
    min: 0,
    max: 20,
    step: 1,
  },
  { name: "borderStyle", label: "边框样式", type: "borderStyle" },
  {
    name: "borderRadius",
    label: "圆角",
    type: "dimension",
    min: 0,
    max: 100,
    step: 1,
  },
  { name: "fontFamily", label: "字体", type: "font" },
];

// 布局属性
const layoutProps = [
  {
    name: "display",
    label: "显示类型",
    type: "select",
    options: [
      { label: "块级", value: "block" },
      { label: "行内块", value: "inline-block" },
      { label: "弹性布局", value: "flex" },
      { label: "网格布局", value: "grid" },
    ],
  },
  {
    name: "position",
    label: "定位",
    type: "select",
    options: [
      { label: "静态", value: "static" },
      { label: "相对", value: "relative" },
      { label: "绝对", value: "absolute" },
      { label: "固定", value: "fixed" },
    ],
  },
  {
    name: "margin",
    label: "外边距",
    type: "dimension",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    name: "padding",
    label: "内边距",
    type: "dimension",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    name: "flexDirection",
    label: "Flex方向",
    type: "select",
    options: [
      { label: "行", value: "row" },
      { label: "列", value: "column" },
    ],
  },
  {
    name: "justifyContent",
    label: "主轴对齐",
    type: "select",
    options: [
      { label: "起始", value: "flex-start" },
      { label: "居中", value: "center" },
      { label: "末尾", value: "flex-end" },
      { label: "两端对齐", value: "space-between" },
      { label: "均匀分布", value: "space-around" },
    ],
  },
];

// 高级属性
const advancedProps = [
  {
    name: "customClass",
    label: "自定义类名",
    type: "text",
    placeholder: "输入自定义CSS类名",
  },
  {
    name: "customStyle",
    label: "自定义样式",
    type: "textarea",
    placeholder: "输入自定义CSS样式",
  },
  { name: "customData", label: "自定义数据", type: "json" },
  { name: "onClick", label: "点击事件", type: "event" },
];

// 尺寸单位选项
const dimensionUnits = [
  { label: "px", value: "px" },
  { label: "%", value: "%" },
  { label: "em", value: "em" },
  { label: "rem", value: "rem" },
  { label: "vw", value: "vw" },
  { label: "vh", value: "vh" },
];

// 字体选项
const fontOptions = [
  { label: "默认", value: "inherit" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Helvetica", value: "Helvetica, sans-serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "Courier New", value: "Courier New, monospace" },
  { label: "微软雅黑", value: "Microsoft YaHei, sans-serif" },
  { label: "宋体", value: "SimSun, serif" },
  { label: "黑体", value: "SimHei, sans-serif" },
];

// 边框样式选项
const borderStyleOptions = [
  { label: "无", value: "none" },
  { label: "实线", value: "solid" },
  { label: "虚线", value: "dashed" },
  { label: "点线", value: "dotted" },
  { label: "双线", value: "double" },
];

// 模型值
const modelValues = reactive({ ...props.initialValues });

// 带单位的尺寸值
const dimensionValues = reactive({});

// 初始化带单位的尺寸值
const initDimensionValues = () => {
  const dimensionProps = [...styleProps, ...layoutProps].filter(
    (prop) => prop.type === "dimension"
  );

  dimensionProps.forEach((prop) => {
    const value = props.initialValues[prop.name];
    if (value) {
      // 尝试解析值和单位
      const match = String(value).match(/^([\d.]+)([a-z%]+)$/);
      if (match) {
        dimensionValues[prop.name] = {
          value: parseFloat(match[1]),
          unit: match[2],
        };
      } else {
        dimensionValues[prop.name] = {
          value: parseFloat(value) || 0,
          unit: "px",
        };
      }
    } else {
      dimensionValues[prop.name] = {
        value: 0,
        unit: "px",
      };
    }
  });
};

// 初始化
initDimensionValues();

// 监听尺寸值变化
watch(
  dimensionValues,
  () => {
    // 更新模型值中的尺寸属性
    Object.keys(dimensionValues).forEach((key) => {
      const { value, unit } = dimensionValues[key];
      modelValues[key] = `${value}${unit}`;
    });
  },
  { deep: true }
);

// JSON编辑器状态
const jsonDialogVisible = ref(false);
const jsonEditorContent = ref("");
const currentJsonProp = ref("");

// 事件编辑器状态
const eventDialogVisible = ref(false);
const eventEditorContent = ref("");
const currentEventProp = ref("");

// 打开JSON编辑器
const openJsonEditor = (propName) => {
  currentJsonProp.value = propName;
  try {
    jsonEditorContent.value = JSON.stringify(
      modelValues[propName] || {},
      null,
      2
    );
  } catch (e) {
    jsonEditorContent.value = "{}";
  }
  jsonDialogVisible.value = true;
};

// 关闭JSON编辑器
const closeJsonEditor = () => {
  jsonDialogVisible.value = false;
};

// 应用JSON更改
const applyJsonChanges = () => {
  try {
    modelValues[currentJsonProp.value] = JSON.parse(jsonEditorContent.value);
    jsonDialogVisible.value = false;
  } catch (e) {
    alert("JSON格式错误，请检查后重试");
  }
};

// 打开事件编辑器
const openEventEditor = (propName) => {
  currentEventProp.value = propName;
  eventEditorContent.value =
    modelValues[propName] ||
    "function(event) {\n  // 在此处编写事件处理代码\n  console.log(event);\n}";
  eventDialogVisible.value = true;
};

// 关闭事件编辑器
const closeEventEditor = () => {
  eventDialogVisible.value = false;
};

// 应用事件更改
const applyEventChanges = () => {
  modelValues[currentEventProp.value] = eventEditorContent.value;
  eventDialogVisible.value = false;
};

// 应用所有更改
const applyChanges = () => {
  emit("update:values", { ...modelValues });
  emit("apply", { ...modelValues });
  
};

// 重置更改
const resetChanges = () => {
  Object.keys(props.initialValues).forEach((key) => {
    modelValues[key] = props.initialValues[key];
  });

  // 重置尺寸值
  initDimensionValues();
};

// 预览组件
const previewComponent = computed(() => props.component);

// 预览样式
const previewStyles = computed(() => {
  const styles = {};

  // 添加样式属性
  styleProps.forEach((prop) => {
    if (modelValues[prop.name]) {
      // 转换属性名称为驼峰式
      const cssName = prop.name.replace(/([A-Z])/g, "-$1").toLowerCase();
      styles[cssName] = modelValues[prop.name];
    }
  });

  return styles;
});
</script>

<style scoped>
.property-designer {
  display: flex;
  gap: 1rem;
  color: #e1e1e1;
  height: calc(100vh - 4rem);
  overflow-y: hidden;
}

.card {
  border-radius: 8px;
  padding: 1rem;
  flex: 1;
}

.dark-card {
  /* background: #1e1e1e; */
  /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); */
  /* border: 1px solid #333; */
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #7289da; /* 使用紫蓝色调作为主题色 */
}

.property-group {
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scrollbar-width: none; /* 隐藏滚动条 */
}

.property-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.property-item label {
  font-size: 0.875rem;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: flex-end;
}

.preview-container {
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.preview-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #444;
  border-radius: 4px;
  padding: 1rem;
  margin-top: 1rem;
  background-color: #2a2a2a;
}

.unit-dropdown {
  width: 5rem;
}

.json-editor,
.event-editor {
  display: flex;
  justify-content: flex-start;
}

/* 暗色主题特定样式 */
:deep(.dark-accordion) .p-accordion-header-link {
  background-color: #2a2a2a !important;
  color: #e1e1e1 !important;
  border-color: #444 !important;
}

:deep(.dark-accordion) .p-accordion-content {
  background-color: #1e1e1e !important;
  color: #e1e1e1 !important;
  border-color: #444 !important;
}

:deep(.dark-accordion)
  .p-accordion-header:not(.p-disabled).p-highlight
  .p-accordion-header-link {
  background-color: #2a2a2a !important;
  border-color: #7289da !important;
  color: #e1e1e1 !important;
}

:deep(.dark-accordion)
  .p-accordion-header:not(.p-disabled).p-highlight:hover
  .p-accordion-header-link {
  background-color: #333 !important;
}

:deep(.dark-accordion)
  .p-accordion-header:not(.p-highlight):not(.p-disabled):hover
  .p-accordion-header-link {
  background-color: #333 !important;
  border-color: #444 !important;
  color: #e1e1e1 !important;
}

:deep(.dark-accordion) .p-accordion-tab {
  margin-bottom: 2px;
}

:deep(.dark-accordion) .p-accordion-toggle-icon {
  color: #e1e1e1 !important;
}

:deep(.p-accordion .p-accordion-header .p-accordion-header-link) {
  background-color: #2a2a2a !important;
  color: #e1e1e1 !important;
  border-color: #444 !important;
}

:deep(.p-accordion .p-accordion-content) {
  background-color: #1e1e1e !important;
  color: #e1e1e1 !important;
  border-color: #444 !important;
  padding: 1rem;
}

:deep(
    .p-accordion
      .p-accordion-header:not(.p-disabled).p-highlight
      .p-accordion-header-link
  ) {
  background-color: #2a2a2a !important;
  border-color: #7289da !important;
  color: #e1e1e1 !important;
}

:deep(
    .p-accordion
      .p-accordion-header:not(.p-disabled).p-highlight:hover
      .p-accordion-header-link
  ) {
  background-color: #333 !important;
}

/* :deep(
    .p-accordion
      .p-accordion-header:not(.p-highlight):not(.p-disabled):hover
      .p-accordion-header-link
  ) {
  background-color: #333 !important;
  border-color: #444 !important;
  color: #e1e1e1 !important;
} */

/* :deep(.dark-input) {
  background-color: #2a2a2a !important;
  color: #e1e1e1 !important;
  border-color: #444 !important;
}

:deep(.dark-input):focus {
  border-color: #7289da !important;
  box-shadow: 0 0 0 1px #7289da40 !important;
} */

:deep(.dark-dropdown) .p-dropdown-label,
:deep(.dark-dropdown) .p-dropdown-trigger {
  background-color: #2a2a2a !important;
  color: #e1e1e1 !important;
  border-color: #444 !important;
}

:deep(.dark-dropdown) .p-dropdown-panel {
  background-color: #2a2a2a !important;
  color: #e1e1e1 !important;
  border-color: #444 !important;
}

:deep(.dark-dropdown) .p-dropdown-item {
  color: #e1e1e1 !important;
}

:deep(.dark-dropdown) .p-dropdown-item:hover {
  background-color: #3a3a3a !important;
}

:deep(.dark-dropdown) .p-dropdown-item.p-highlight {
  background-color: #7289da !important;
  color: #fff !important;
}

:deep(.dark-textarea) {
  background-color: #2a2a2a !important;
  color: #e1e1e1 !important;
  border-color: #444 !important;
}

:deep(.dark-textarea):focus {
  border-color: #7289da !important;
  box-shadow: 0 0 0 1px #7289da40 !important;
}

:deep(.dark-button) {
  background-color: #7289da !important;
  border-color: #7289da !important;
}

:deep(.dark-button).p-button-outlined {
  background-color: transparent !important;
  color: #7289da !important;
  border-color: #7289da !important;
}

:deep(.dark-button).p-button-text {
  background-color: transparent !important;
  color: #7289da !important;
  border-color: transparent !important;
}

:deep(.dark-switch) .p-inputswitch-slider {
  background-color: #444 !important;
}

:deep(.dark-switch).p-inputswitch.p-inputswitch-checked .p-inputswitch-slider {
  background-color: #7289da !important;
}

:deep(.dark-dialog) .p-dialog-header,
:deep(.dark-dialog) .p-dialog-content,
:deep(.dark-dialog) .p-dialog-footer {
  background-color: #1e1e1e !important;
  color: #e1e1e1 !important;
  border-color: #444 !important;
}

:deep(.dark-dialog) .p-dialog-header-icon {
  color: #e1e1e1 !important;
}

:deep(.dark-inputgroup) .p-inputgroup-addon {
  background-color: #2a2a2a !important;
  color: #e1e1e1 !important;
  border-color: #444 !important;
}

:deep(.code-editor) {
  font-family: "Courier New", monospace !important;
  background-color: #2a2a2a !important;
  color: #e1e1e1 !important;
  border-color: #444 !important;
}

@media (max-width: 768px) {
  .property-designer {
    flex-direction: column;
  }
}

</style>
