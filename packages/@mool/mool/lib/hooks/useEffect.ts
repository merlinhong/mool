import { ref, watchEffect, watch, onMounted, onUnmounted } from "vue";
export const useEffect = (effect, deps) => {
  let cleanup;
  const isMounted = ref(false);

  // 处理清理函数
  const runCleanup = () => {
    if (cleanup && typeof cleanup === "function") {
      cleanup();
    }
  };

  // 主执行逻辑
  const execute = () => {
    runCleanup();
    cleanup = effect();
  };

  if (!deps) {
    // 无依赖项 - 每次更新都运行
    watchEffect((onInvalidate) => {
      if (!isMounted.value) {
        isMounted.value = true;
        return;
      }
      execute();
      onInvalidate(runCleanup);
    });
  } else if (deps.length === 0) {
    // 空依赖数组 - 仅挂载时运行
    onMounted(() => {
      execute();
    });
  } else {
    // 有依赖项 - 依赖变化时运行
    watch(
      deps,
      (newVal, oldVal, onInvalidate) => {
        execute();
        onInvalidate(runCleanup);
      },
      { immediate: true },
    );
  }

  // 组件卸载时清理
  onUnmounted(() => {
    runCleanup();
  });
};
