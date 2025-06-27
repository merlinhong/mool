export const useInteract = (ref, option: { move: Function, resize: Function }) => {
    let offsetX = 0,
        offsetY = 0,
        isDown = false;
    const dragstart = (e) => {
        // 创建一个透明的图片
        const img = document.createElement("img");
        img.src = "";
        img.width = img.height = 0;
        e.dataTransfer.setDragImage(img, 0, 0);
        isDown = true;
        offsetX = e.clientX;
        offsetY = e.clientY;
    };
    const dragover = (e) => {
        if (!isDown) return;
        ref.value.style.left = e.clientX - offsetX + +finalxy.refx + "px";
        ref.value.style.top = e.clientY - offsetY + +finalxy.refy + "px";
        option?.move(e);
    };
    const finalxy = {
        refx: 0,
        refy: 0,
    };
    const dragend = (e) => {
        if (!isDown) return;
        isDown = false;
        // 拖拽结束，获取最终位置
        const finalLeft = ref.value.style.left;
        const finalTop = ref.value.style.top;
        // 应用到 CSS（此时已经应用，无需额外操作，如果需要保存可以在这里处理）
        console.log("最终位置:", finalLeft, finalTop);
        finalxy.refx = finalLeft.replace("px", "");
        finalxy.refx = finalTop.replace("px", "");

    };
    ref.value?.setAttribute("draggable", true);
    ref.value.addEventListener("dragstart", dragstart);
    ref.value.addEventListener("dragover", dragover);
    ref.value.addEventListener("dragend", dragend);
    return {
        left: finalxy.refx,
        top: finalxy.refy,
    }
}