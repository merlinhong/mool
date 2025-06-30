
export const useInteract = (refEl, option: {
    drag?: {
        move: (e: MouseEvent, opt: { x: number; y: number }) => void,
        end: (e: MouseEvent, opt: { x: number; y: number }) => void,
    }, resize?: {
        move: (e: MouseEvent, opt: { scale: string, y: number, x: number }) => void,
        end: (e: MouseEvent, opt: { scale: number }) => void,
    }
}) => {
    let offsetX = 0,
        offsetY = 0,
        originx = 0,
        originy = 0,
        _top = 0,
        _right = 0,
        isDown = false;
    // 设置缩放的最小和最大值
    const minScale = 0.2;
    const maxScale = 2;
    const getScale = (scale: number) => {
        return Math.max(minScale, Math.min(maxScale, scale));
    }
    const resize = ref({
        'left top': false,
        'left bottom': false,
        'right top': false,
        'right bottom': false
    });
    const originMap = ref<Record<string, any>>({});
    const origin = ref('');
    const mousedown = (e) => {
        const { top, right, bottom, left, width, height } = refEl.value?.getBoundingClientRect();
        isDown = true;
        offsetX = e.clientX;
        offsetY = e.clientY;
        _top = top;
        _right = right;
        if (!origin.value) {
            originMap.value = {
                'left top': [left, top],
                'left bottom': [left, bottom],
                'right top': [right, top],
                'right bottom': [right, bottom],
                width,
                height
            };
        }
        e.preventDefault();

    };

    // const scaleElement = (x, y, key) => {
    //     const originalx = refEl.value.offsetWidth / 2;
    //     const originaly = refEl.value.offsetHeight / 2;

    //     const style = window.getComputedStyle(refEl.value);
    //     const matrix = new DOMMatrix(style.transform);
    //     const originXY = originMap.value[key];
    //     console.log(originXY);

    //     matrix.scaleSelf(1.1, 1.1, 1,originalx,originaly,0);
    //     console.log(matrix.toString());

    //     return matrix.toString()
    // }
    // let matrix = new DOMMatrix();


    let matrix: DOMMatrix | null = new DOMMatrix();
    function scaleElementByCurrentCenter(scale: number, key: string) {
        // 以 (100, 100) 为中心点，x、y 方向同时缩放 1.5 倍
        console.log(originMap.value);

        // 1. 计算顶点的变换后坐标
        let point: DOMPoint | null = null;
        // 1. 右上角本地坐标
        // 2. 变换前屏幕坐标
        if (key == 'right bottom') {
            point = new DOMPoint(originMap.value.width, originMap.value.height).matrixTransform(matrix!)
        } else {
            point = new DOMPoint(originMap.value.width, 0).matrixTransform(matrix!)
        }
        // 2. 构造缩放矩阵（以变换后顶点为基准点）
        const toOrigin = new DOMMatrix().translate(-point.x, -point.y);
        const scaleMatrix = new DOMMatrix().scale(scale, scale);
        const fromOrigin = new DOMMatrix().translate(point.x, point.y);

        // 3. 组合变换
        const step = fromOrigin.multiply(scaleMatrix).multiply(toOrigin);
        console.log(point);

        // 4. 应用变换
        const newMatrix = matrix?.multiply(step);
        let origin = {
            x: 0,
            y: 0
        };
        if (key == 'right bottom') {
            origin.x = originMap.value.width;
            origin.y = originMap.value.height;
        } else {
            origin.x = originMap.value.width;
            origin.y = 0;
        }
        // 缩放后，重新计算顶点坐标
        const afterTransform = new DOMPoint(origin.x, origin.y).matrixTransform(newMatrix);
        // 计算偏差
        const dx = point.x - afterTransform.x;
        const dy = point.y - afterTransform.y;

        // 校正矩阵
        const correction = new DOMMatrix().translate(dx, dy);
        const finalMatrix = correction.multiply(newMatrix);
        return finalMatrix?.toString();
    }
    const mousemove = (e) => {

        if (!isDown) {
            return setOrientation(e);
        }
        const dx = e.clientX - offsetX;
        const dy = e.clientY - offsetY;
        for (const [key, val] of Object.entries(resize.value)) {
            if (val) {
                // refEl.value.style.transformOrigin = key;
                origin.value = key;
                let scale = 1;
                // 这里以等比例缩放为例，也可以分开处理宽高

                if (key == 'left top' || key == 'left bottom') {
                    scale = getScale(1 + dy * 0.0015)
                }
                if (key == 'right top' || key == 'right bottom') {
                    scale = getScale(1 - dx * 0.0015)
                }

                const { top, right } = refEl.value?.getBoundingClientRect();

                option?.resize?.move(e, {
                    scale: scaleElementByCurrentCenter(scale, key),
                    origin: '0 0',
                    y: top - _top,
                    x: right - _right
                });
                return
            }
        }
        refEl.value.style.left = e.clientX - offsetX + +finalxy.value.refx + "px";
        refEl.value.style.top = e.clientY - offsetY + +finalxy.value.refy + "px";
        option?.drag?.move(e, {
            x: dx,
            y: dy
        });
    };
    const matchScale = () => {
        const finalScale = refEl.value.style.transform;
        const scaleRegex = /^scale\(([^)]+)\)$/;
        const match = finalScale.match(scaleRegex);
        if (match) {
            return +match[1]
        } else {
            return 1
        }
    };
    const finalxy = ref({
        refx: 0,
        refy: 0,
        scale: 1,
    });
    const mouseup = (e) => {
        if (!isDown) return;
        isDown = false;
        // 拖拽结束，获取最终位置
        const finalLeft = refEl.value.style.left;
        const finalTop = refEl.value.style.top;
        finalxy.value.refx = finalLeft.replace("px", "");
        finalxy.value.refy = finalTop.replace("px", "");
        finalxy.value.scale = matchScale();
        option?.drag?.end(e, {
            x: +finalxy.value.refx,
            y: +finalxy.value.refy
        });
        option?.resize?.end(e, {
            scale: finalxy.value.scale
        });

        if (origin.value) {
            const transform = getComputedStyle(refEl.value).transform;
            matrix = transform === "none"
                ? new DOMMatrix()
                : new DOMMatrix(transform);
        }

    };
    const setOrientation = (e) => {
        const { top, right, bottom, left, width, height } = refEl.value?.getBoundingClientRect();
        resize.value = {
            'left top': false,
            'left bottom': false,
            'right top': false,
            'right bottom': false
        };
        if (right - e.clientX >= 0 && right - e.clientX <= 20 && bottom - e.clientY >= 0 && bottom - e.clientY <= 20) {

            resize.value['left top'] = true;
            refEl.value.style.cursor = 'nw-resize';
            return
        }
        if (e.clientY - top >= 0 && e.clientY - top <= 20 && right - e.clientX >= 0 && right - e.clientX <= 20) {
            resize.value['left bottom'] = true;
            refEl.value.style.cursor = 'ne-resize';
            return
        }
        if (e.clientX - left >= 0 && e.clientX - left <= 20 && bottom - e.clientY >= 0 && bottom - e.clientY <= 20) {
            resize.value['right top'] = true;
            refEl.value.style.cursor = 'ne-resize';
            return
        }
        if (e.clientX - left >= 0 && e.clientX - left <= 20 && (e.clientY - top >= 0 && e.clientY - top <= 20)) {
            resize.value['right bottom'] = true;
            refEl.value.style.cursor = 'nw-resize';
            return
        }
        else {
            refEl.value.style.cursor = 'move';
        }
    }
    // refEl.value?.setAttribute("draggable", true);
    refEl.value.addEventListener("mousedown", mousedown);
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);
    // refEl.value.addEventListener("mousemove", mousemove);

    return {
        left: finalxy.value.refx,
        top: finalxy.value.refy,
    }
}