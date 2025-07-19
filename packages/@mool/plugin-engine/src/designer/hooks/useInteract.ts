export const useInteract = (
  refEl,
  option: {
    drag?: {
      move: (e: MouseEvent, opt: { matrix: string }) => void;
      end: (e: MouseEvent, opt: { x: number; y: number }) => void;
    };
    resize?: {
      move: (e: MouseEvent, opt: { origin: string; matrix: string }) => void;
      end: (e: MouseEvent, opt: { scale: number }) => void;
    };
  },
  w: Window | null = window
) => {
  let dx = 0,
    dy = 0,
    offsetX = 0,
    offsetY = 0,
    scalex = 1,
    scaley = 1,
    isDown = false;

  const finalxy = ref({
    refx: 0,
    refy: 0,
    scale: 1,
  });
  const origin = ref("");
  const originMap = ref<Record<string, any>>({});

  let matrix: DOMMatrix | null = new DOMMatrix();
  // 设置缩放的最小和最大值
  const resize = ref({
    "left top": false,
    "left bottom": false,
    "right top": false,
    "right bottom": false,
  });
  const minScale = 0.2;
  const maxScale = 2;

  const translateElementByDrag = (x: number, y: number) => {
    return matrix?.translate(x, y).toString();
  };
  const scaleElementByCurrentCenter = (
    scalex: number,
    scaley: number,
    key: string
  ) => {
    // 1. 计算顶点的变换后坐标
    let point: DOMPoint | null = null;
    // 1. 右上角本地坐标
    // 2. 变换前屏幕坐标
    const { x, y } = originMap.value[key];
    point = new DOMPoint(x, y).matrixTransform(matrix!);

    // 2. 构造缩放矩阵（以变换后顶点为基准点）
    const toOrigin = new DOMMatrix().translate(-point.x, -point.y);
    const scaleMatrix = new DOMMatrix().scale(scalex, scaley);
    const fromOrigin = new DOMMatrix().translate(point.x, point.y);

    // 3. 组合变换
    const step = fromOrigin.multiply(scaleMatrix).multiply(toOrigin);

    // 4. 应用变换
    const newMatrix = matrix?.multiply(step);
    let origin = {
      x: originMap.value[key].x,
      y: originMap.value[key].y,
    };
    // 缩放后，重新计算顶点坐标
    const afterTransform = new DOMPoint(origin.x, origin.y).matrixTransform(
      newMatrix
    );
    // 计算偏差
    const dx = point.x - afterTransform.x;
    const dy = point.y - afterTransform.y;

    // 校正矩阵
    const correction = new DOMMatrix().translate(dx, dy);
    const finalMatrix = correction.multiply(newMatrix);
    return finalMatrix?.toString();
  };
  const getScale = (scale: number) => {
    return Math.max(minScale, Math.min(maxScale, scale));
  };

  const mousedown = (e) => {
    const { width, height } = refEl.value?.getBoundingClientRect();
    isDown = true;
    offsetX = e.clientX;
    offsetY = e.clientY;
    e.preventDefault();
    if (!origin.value) {
      originMap.value = {
        "left top": { x: 0, y: 0 },
        "left bottom": {
          x: 0,
          y: height,
        },
        "right top": {
          x: width,
          y: 0,
        },
        "right bottom": {
          x: width,
          y: height,
        },
      };
    }
  };
  const mousemove = (e) => {
    if (!isDown) {
      return setOrientation(e);
    }
    const dx = e.clientX - offsetX;
    const dy = e.clientY - offsetY;

    for (const [key, val] of Object.entries(resize.value)) {
      if (val) {
        origin.value = key;
        // 这里以等比例缩放为例，也可以分开处理宽高
        switch (key) {
          case "left top":
            scalex = getScale(1 + dx * 0.0015);
            scaley = getScale(1 + dy * 0.0015);
            break;
          case "left bottom":
            scalex = getScale(1 + dx * 0.0015);
            scaley = getScale(1 - dy * 0.0015);
            break;
          case "right top":
            scalex = getScale(1 - dx * 0.0015);
            scaley = getScale(1 + dy * 0.0015);
            break;
          case "right bottom":
            scalex = getScale(1 - dx * 0.0015);
            scaley = getScale(1 - dy * 0.0015);
            break;
          default:
            break;
        }
        option?.resize?.move(e, {
          matrix: scaleElementByCurrentCenter(scalex, scaley, key),
          origin: "0 0",
        });
        return;
      }
    }
    option?.drag?.move(e, {
      matrix: translateElementByDrag(dx, dy) ?? "",
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
    } else {
    }
    const transform = getComputedStyle(refEl.value).transform;
    matrix = transform === "none" ? new DOMMatrix() : new DOMMatrix(transform);
    option?.resize?.end(e, {
      scale: finalxy.value.scale,
    });
  };
  const setOrientation = (e) => {
    const { top, right, bottom, left } = refEl.value?.getBoundingClientRect();
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
  const start = () => {
    refEl.value.addEventListener("mousedown", mousedown);
    w?.addEventListener("mousemove", mousemove);
    w?.addEventListener("mouseup", mouseup);
  };
  const clear = () => {
    refEl.value?.removeEventListener("mousedown", mousedown);
    w?.removeEventListener("mousemove", mousemove);
    w?.removeEventListener("mouseup", mouseup);
    refEl.value.style.cursor = "auto";
  };
  return {
    clear,
    start,
  };
};
