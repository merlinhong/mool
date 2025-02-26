declare namespace JSX {
  interface IntrinsicElements{
    [elemName:string]:any;
    ["el-upload"]: InstanceType<(typeof import("element-plus/es"))["ElUpload"]>["$props"];
    ["el-aside"]: InstanceType<(typeof import("element-plus/es"))["ElAside"]>["$props"];
    ["el-button"]: InstanceType<(typeof import("element-plus/es"))["ElButton"]>["$props"];
    ["el-card"]: InstanceType<(typeof import("element-plus/es"))["ElCard"]>["$props"];
    ["el-col"]: InstanceType<(typeof import("element-plus/es"))["ElCol"]>["$props"];
    ["el-color-picker"]: InstanceType<(typeof import("element-plus/es"))["ElColorPicker"]>["$props"];
    ["el-container"]: InstanceType<(typeof import("element-plus/es"))["ElContainer"]>;
    ["el-date-picker"]: InstanceType<(typeof import("element-plus/es"))["ElDatePicker"]>["$props"];
    ["el-descriptions"]: InstanceType<(typeof import("element-plus/es"))["ElDescriptions"]>["$props"];
    ["el-descriptions-items"]: InstanceType<(typeof import("element-plus/es"))["ElDescriptionsItem"]>["$props"];
    ["el-dialog"]: InstanceType<(typeof import("element-plus/es"))["ElDialog"]>["$props"];
    ["el-form"]: InstanceType<(typeof import("element-plus/es"))["ElForm"]>["$props"];
    ["el-form-item"]: InstanceType<(typeof import("element-plus/es"))["ElFormItem"]>["$props"];
    ["el-icon"]: InstanceType<(typeof import("element-plus/es"))["ElIcon"]>["$props"];
    ["el-image"]: InstanceType<(typeof import("element-plus/es"))["ElImage"]>["$props"];
    ["el-input"]: InstanceType<(typeof import("element-plus/es"))["ElInput"]>["$props"];
    ["el-main"]: InstanceType<(typeof import("element-plus/es"))["ElMain"]>["$props"];
    ["el-menu"]: InstanceType<(typeof import("element-plus/es"))["ElMenu"]>["$props"];
    ["el-menu-item"]: InstanceType<(typeof import("element-plus/es"))["ElMenuItem"]>["$props"];
    ["el-option"]: InstanceType<(typeof import("element-plus/es"))["ElOption"]>["$props"];
    ["el-pagination"]: InstanceType<(typeof import("element-plus/es"))["ElPagination"]>["$props"];
    ["el-popconfirm"]: InstanceType<(typeof import("element-plus/es"))["ElPopconfirm"]>["$props"];
    ["el-radio"]: InstanceType<(typeof import("element-plus/es"))["ElRadio"]>["$props"];
    ["el-radio-group"]: InstanceType<(typeof import("element-plus/es"))["ElRadioGroup"]>["$props"];
    ["el-row"]: InstanceType<(typeof import("element-plus/es"))["ElRow"]>["$props"];
    ["el-select"]: InstanceType<(typeof import("element-plus/es"))["ElSelect"]>["$props"];
    ["el-sub-menu"]: InstanceType<(typeof import("element-plus/es"))["ElSubMenu"]>["$props"];
    ["el-table"]: InstanceType<(typeof import("element-plus/es"))["ElTable"]>["$props"];
    ["el-table-column"]: InstanceType<(typeof import("element-plus/es"))["ElTableColumn"]>["$props"];
  }
}