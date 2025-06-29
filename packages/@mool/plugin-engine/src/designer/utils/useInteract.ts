const finalxy = ref({
  refx: 0,
  refy: 0,
  scale: 1,
});
export const useInteract = (
  refEl,
  option: {
    drag?: {
      move: (
        e: MouseEvent,
        opt: { x: number; y: number; scale: number }
      ) => void;
      end: (e: MouseEvent, opt: { x: number; y: number }) => void;
    };
    resize?: {
      move: (
        e: MouseEvent,
        opt: { scale: number; origin: string; x: number; y: number }
      ) => void;
      end: (e: MouseEvent, opt: { scale: number }) => void;
    };
  }
) => {
  let dx = 0,
    dy = 0,
    offsetX = 0,
    offsetY = 0,
    scalex = 1,
    scaley = 1,
    hasScale = false,
    isDown = false;
  // 设置缩放的最小和最大值
  const minScale = 0.2;
  const maxScale = 2;
  const origin = ref("");
  const getScale = (scale: number) => {
    return Math.max(minScale, Math.min(maxScale, scale));
  };

  const resize = ref({
    "left top": false,
    "left bottom": false,
    "right top": false,
    "right bottom": false,
  });

  const getOriginMap = ref<Record<string, any>>({});
  const mousedown = (e) => {
    const { top, right, bottom, left } = refEl.value?.getBoundingClientRect();
    isDown = true;
    offsetX = e.clientX;
    offsetY = e.clientY;
    e.preventDefault();
    getOriginMap.value = {
      "left top": `${left}px ${top}px`,
      "left bottom": `${left}px ${bottom}px`,
      "right top": `${right}px ${top}px`,
      "right bottom": `${right}px ${bottom}px`,
    };
  };
  const mousemove = (e) => {
    if (!isDown) {
      return setOrientation(e);
    }

    // console.log(scale);

    for (const [key, val] of Object.entries(resize.value)) {
      if (val) {
        const _dx = e.clientX - offsetX;
        const _dy = e.clientY - offsetY;
        origin.value = key;
        // 这里以等比例缩放为例，也可以分开处理宽高

        if (key == "left top" || key == "left bottom") {
        //   scale = getScale(finalxy.value.scale + _dy * 0.0015);
        }
        if (key == "right top" || key == "right bottom") {
          scalex = getScale(finalxy.value.scale - _dx * 0.0015);
          scaley = getScale(finalxy.value.scale - _dy * 0.0015);
        }
        console.log(getOriginMap.value[key]);
        
        option?.resize?.move(e, {
          scalex,
          scaley,
          x: finalxy.value.refx,
          y: finalxy.value.refy,
          origin: key,
        });
        return;
      }
    }
    dx = e.clientX - offsetX;
    dy = e.clientY - offsetY;
    option?.drag?.move(e, {
      scale: finalxy.value.scale,
      x: dx + finalxy.value.refx,
      y: dy + finalxy.value.refy,
    });
  };

  const mouseup = (e) => {
    if (!isDown) return;
    isDown = false;
    // 拖拽结束，获取最终位置
    if (!origin.value) {
      finalxy.value.refx += dx;
      finalxy.value.refy += dy;
      option?.drag?.end(e, {
        x: finalxy.value.refx,
        y: finalxy.value.refy,
      });
    }else{
        hasScale = true;
    }
    // finalxy.value.scale = scale;

    option?.resize?.end(e, {
      scale: finalxy.value.scale,
    });
  };
  const setOrientation = (e) => {
    const { top, right, bottom, left, width, height } =
      refEl.value?.getBoundingClientRect();
    resize.value = {
      "left top": false,
      "left bottom": false,
      "right top": false,
      "right bottom": false,
    };
    if (
      right - e.clientX >= 0 &&
      right - e.clientX <= 20 &&
      bottom - e.clientY >= 0 &&
      bottom - e.clientY <= 20
    ) {
      resize.value["left top"] = true;
      refEl.value.style.cursor = "nw-resize";
      return;
    }
    if (
      e.clientY - top >= 0 &&
      e.clientY - top <= 20 &&
      right - e.clientX >= 0 &&
      right - e.clientX <= 20
    ) {
      resize.value["left bottom"] = true;
      refEl.value.style.cursor = "ne-resize";
      return;
    }
    if (
      e.clientX - left >= 0 &&
      e.clientX - left <= 20 &&
      bottom - e.clientY >= 0 &&
      bottom - e.clientY <= 20
    ) {
      resize.value["right top"] = true;
      refEl.value.style.cursor = "ne-resize";
      return;
    }
    if (
      e.clientX - left >= 0 &&
      e.clientX - left <= 20 &&
      e.clientY - top >= 0 &&
      e.clientY - top <= 20
    ) {
      resize.value["right bottom"] = true;
      refEl.value.style.cursor = "nw-resize";
      return;
    } else {
      refEl.value.style.cursor = "move";
    }
  };
  // refEl.value?.setAttribute("draggable", true);
  refEl.value.addEventListener("mousedown", mousedown);
  window.addEventListener("mousemove", mousemove);
  window.addEventListener("mouseup", mouseup);
  // refEl.value.addEventListener("mousemove", mousemove);

  const clear = () => {
    refEl.value?.removeEventListener("mousedown", mousedown);
    window.removeEventListener("mousemove", mousemove);
    window.removeEventListener("mouseup", mouseup);
    refEl.value.style.cursor = "auto";

    // refEl.value?.removeEventListener("mousemove", mousemove);
  };
  return {
    clear,
  };
};
