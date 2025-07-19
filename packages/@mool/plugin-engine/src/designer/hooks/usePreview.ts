import { store, uuid } from "mooljs";
import { pageSchema } from "./useProvide";
export const usePreview = () => {
  const route = useRoute();

  // 获取当前页面的预览数据
  const getSchema = () => {
    return store.get(route.query.uid as string);
  };

  // 设置预览数据到 store
  const setSchema = (data: any) => {
    store.set(route.query.uid as string, data);
  };
  const preview = () => {
    // 预览功能
    // 可以在这里实现预览逻辑，比如打开一个新窗口显示当前页面
    const previewWindow = window.open(
      `#/designer/preview?uid=${getUserName()}`,
      "_blank"
    );

    window.addEventListener("message", (event) => {
      console.log("Received message from preview window:",pageSchema.value);

      if (event.data.type == "COMPONENT_LOADED") {
        if (previewWindow) {
          previewWindow.document.title = "页面预览";
          // postMessage to the preview window with the current schema
          previewWindow.postMessage(
            {
              schema: toRaw(pageSchema.value),
              type: "preview",
            },
            "*"
          );
          setSchema(toRaw(pageSchema.value));
        }
      }
    });
  };

  const setUserName = () => {
    if (!store.get("primevue-landing-user-name")) {
      store.set("primevue-landing-user-name", uuid({ len: 20 }));
    }
  };
  const getUserName = () => {
    return (
      store.get("primevue-landing-user-name") ??
      route.query.uuid ??
      uuid({ len: 20 })
    );
  };
  return {
    getSchema,
    setSchema,
    preview,
    setUserName,
    getUserName,
  };
};
