import { usePreview } from "./usePreview";

const isMobile = ref(false);
const editData = ref<any[]>([]);
const drawer = ref(false);
// 导出一个名为useProvide的函数
export const pageSchema = ref<any[]>([]);
export const useProvide = () => {
  const { getSchema } = usePreview();
  pageSchema.value = getSchema() ?? [];
  provide("editData", editData);
  provide("isMobile", isMobile);
  provide("drawer", drawer);
  provide("pageSchema", pageSchema);
  return {
    drawer,
  };
};
