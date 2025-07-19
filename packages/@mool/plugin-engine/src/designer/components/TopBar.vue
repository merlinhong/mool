<template>
  <div
    class="toolbar shadow-xl flex justify-between items-center py-2.5 px-5 sticky inset-0 z-9999 rounded-tl-md ml-[1px] h-[6vh]"
    style="background-color: var(--surface-ground)"
  >
    <span class="text-xs text-blue-400 font-bold">查看新手引导</span>

    <!--PC/移动端切换图标-->
    <div class="flex items-center cursor-pointer">
      <i
        class="pi pi-desktop mr-4"
        @click="switchToPC(0)"
        :class="{ 'icon-active': !isMobile }"
      ></i>
      <i
        class="pi pi-mobile"
        @click="switchToMobile(0)"
        :class="{ 'icon-active': isMobile }"
      ></i>
    </div>

    <div class="flex items-center space-x-1">
      <i
        @click="toggleDarkMode"
        :class="['pi mr-4', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"
      ></i>

      <!-- 创建页面 -->
      <i v-tooltip.bottom="'近期所建'" class="pi pi-file pi-file-plus"></i>
      <Popover> ff </Popover>

      <span class="mx-2 text-gray-400">|</span>

      <i v-tooltip.bottom="'回退'" class="pi-arrow-left pi !mr-4"></i>
      <i v-tooltip.bottom="'下一步'" class="pi-arrow-right pi !mr-4"></i>
      <i v-tooltip.bottom="'重置'" class="pi-refresh pi !mr-4"></i>
      <i v-tooltip.bottom="'预览'" class="pi-eye pi !mr-4" @click="preview"></i>
      <i v-tooltip.bottom="'保存'" class="pi-save pi !mr-4"></i>
      <i v-tooltip.bottom="'下载'" class="pi-download pi" @click="genCode"></i>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, Ref, PropType, watch } from "vue";
import { useLayout } from "@/layouts/layout";
import {usePreview} from '../hooks/usePreview';
const {preview} = usePreview();

const { toggleDarkMode, isDarkTheme } = useLayout();
const route = useRoute();
const PageSchema = inject<Ref<any[]>>("pageSchema", ref([]));
const statuIcon = ref<"info" | "success" | "warning" | "error">("info");

const statuTitle = ref("正在出码，请稍等....");
const generateCoding = ref(false);
const isMobile = inject<Ref<boolean>>("isMobile", ref(false));
onMounted(() => {
  toggleDarkMode();
});


const genCode = async () => {
  try {
    // 请求文件夹选择

    const folderHandle = await self.showDirectoryPicker();

    // generateCoding.value = true;
    const schema = {
      modules: Object.entries(toRaw(PageSchema.value)).reduce(
        (acc, [key, value]) => {
          acc[value.template] = toRaw(value.config);
          return acc;
        },
        {} as Record<string, any>
      ),
    };

    fetch(
      "/api/generate-code",

      {
        method: "POST", // 或 'GET', 'PUT', 'DELETE', 等

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(schema),
      }
    )
      .then((response) => {
        return response.json();
      })
      .then(async (res) => {
        const pageCode = res.data[0].panelValue

          .replace(/\n\r/, "")

          .replace(/&quot;/g, "'");

        const tsCode = res.data[0].panelTsCode

          .replace(/\n\r/, "")

          .replace(/&quot;/g, "'");

        const requestCode = res.data[0].panelRqCode

          .replace(/\n\r/, "")

          .replace(/&quot;/g, "'");

        // 创建文件

        [
          {
            name: "type.ts",

            code: tsCode,
          },

          {
            name: "page.vue",

            code: pageCode,
          },

          {
            name: "utils/request.ts",

            code: requestCode,
          },
        ].map(async (item) => {
          async function write(file: any, code: any) {
            const writable = await file.createWritable();

            await writable.write(code.replace(/^`|`$/g, ""));

            await writable.close();
          }

          if (item.name.indexOf("/") != -1) {
            // 创建一个新的文件夹

            const newFolderHandle = await folderHandle.getDirectoryHandle(
              item.name.split("/")[0],

              { create: true }
            );

            const writeFile = await newFolderHandle.getFileHandle(
              item.name.split("/")[1],

              { create: true }
            );

            write(writeFile, item.code);
          } else {
            const writeFile = await folderHandle.getFileHandle(item.name, {
              create: true,
            });

            write(writeFile, item.code);
          }

          // 写入内容

          setTimeout(() => {
            statuIcon.value = "success";

            statuTitle.value = "下载成功!";
          }, 2000);
        });
      });
  } catch (error) {
    console.error("错误:", error);
  }
};

const saveSchema = () => {
  fetch("/api/save-schema", {
    method: "post", // 或 'GET', 'PUT', 'DELETE', 等

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      id: PageSchema.value.id,
      schema: {
        pageInfo: {
          name: PageSchema.value.componentName,

          schema: PageSchema.value,
        },

        blocksData: [],
      },
    }),
  }).then((res) => {
    ElMessage.success("保存成功");
  });
};

const switchToPC = (type?: number) => {
  isMobile.value = false;
};

const switchToMobile = (type?: number) => {
  isMobile.value = true;
};

const redo = () => {
  console.log("重做");
  PageSchema.value.children = [];
};

// 其他脚本代码保持不变
</script>

<style scoped>
.el-button.text-blue-500 {
  color: #409eff;
}

.custom-icon {
  font-size: 20px;
  /* 调整图标大小 */
  color: #333;
  /* 图标颜色 */
}

.el-button {
  padding: 8px;
  /* 保持按钮内边距 */
}

.el-button:hover .custom-icon {
  color: #409eff;
  /* 鼠标悬停时的颜色 */
}

.icon-active {
  color: #409eff;
  /* 选中时的颜色 */
}

.icon-active .custom-icon {
  color: #409eff;
  /* 确保选中时图标也变色 */
}
</style>
