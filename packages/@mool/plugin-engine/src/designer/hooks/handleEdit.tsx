import { nextTick, ref, createApp } from "vue";
import * as primevue from "primevue";

/**
 * 处理具有data-edit属性的元素
 */
export function useProcessDataEdit() {
  const currId = ref('');
  const RECT_OPT: Record<string, any> = {};
  let container: null | Element = null;

  // 辅助函数
  function updateElementClass(element: Element, classValue: string) {
    const currentClass = element.getAttribute("class") || "";
    element.setAttribute("class", `${currentClass} ${classValue}`.trim());
  }

  async function replaceWithComponent(
    element: Element,
    { type = "", props = {}, label = "", editType = "" }
  ) {
    return new Promise((resolve) => {
      const container = document.createElement("div");

      try {
        const Comp = primevue[type];
        const app = createApp(
          <Comp {...props} data-edit={editType}>
            {label}
          </Comp>
        );

        app.mount(container);

        if (element.parentNode) {
          console.log(container);

          element.parentNode.insertBefore(container.firstChild, element);
          element.parentNode.removeChild(element);
        }

        // 确保DOM已更新
        requestAnimationFrame(() => resolve(void 0));
      } catch (error) {
        console.error(`组件 ${type} 创建失败:`, error);
        resolve(void 0);
      }
    });
  }
  function captureElementRect(
    schemaId: string
  ) {
    if (schemaId !== currId.value) {
      container = document.querySelector(`.${schemaId}`) as Element;
    }
    try {
      // 如果是替换后的组件，查找新元素
      const newElement = container?.querySelectorAll(
        `[data-edit]`
      );
      newElement?.forEach(el => {
        const type = el.getAttribute('data-edit') ?? '';
        const { width = 0, height = 0, top = 0, left = 0 } = el?.getBoundingClientRect() ?? {};
        RECT_OPT[schemaId][type] = {
          width,
          height,
          top: top + window.scrollY,
          left: left + window.scrollX
        };
      })
    } catch (error) {
      console.warn(`获取元素位置失败`, error);
    }
    console.log(RECT_OPT);

    currId.value = schemaId
  }
  const handleAllEdit = async (
    pageSchema: Ref<Record<string, any>[]>, currIndex?: number) => {
    // 创建观察器
    for (const [index, schema] of pageSchema.value.entries()) {
      const el = document.querySelector(`.${schema.id}`);
      if (!el || !schema?.config || !schema?.id) {
        console.error("无效的参数", { el, schema });
        return;
      }
      if (el) {
        try {
          // 获取所有需要处理的元素
          const elements = Array.from(el.querySelectorAll("[data-edit]"));

          // 处理每个元素
          for (const item of elements) {
            const editType = item.getAttribute("data-edit") ?? '';

            // 跳过无效配置
            if (!schema.config[editType ?? '']) {
              console.warn(`配置不存在: ${editType}`);
              continue;
            }

            const { props, label, type } = schema.config[editType ?? ''];

            // 处理类名
            if (props?.class) {
              updateElementClass(item, props.class);
            }

            // 处理内容
            if (!editType?.includes("wrapper")) {
              item.textContent = label ?? "";
            }

            // 处理组件替换
            if (type && primevue[type]) {
              await replaceWithComponent(item, {
                type,
                props,
                label,
                editType,
              });
            }

            // 等待DOM更新
            await nextTick();
            // 确保RECT_OPT数据结构已初始化
            if (!RECT_OPT[schema.id]) {
              RECT_OPT[schema.id] = {
                template: el?.getBoundingClientRect()
              };
            } else {
              // 如果已经存在，清空之前的配置
              const { top, left, width, height } = el?.getBoundingClientRect();
              RECT_OPT[schema.id].template = {
                top: top + window.scrollY,
                left: left + window.scrollX,
                width,
                height
              }
            }
          }
        } catch (error) {
          console.error("处理data-edit元素时出错:", error);
        }
        if (index === currIndex) {
          editData.value = [
            {
              event: "select",
              type: null,
              id: schema.id,
              template: schema.template,
              rect:
                RECT_OPT[schema.id].template ?? el.getBoundingClientRect(),
            },
          ];

        } else {
          editData.value = [
            {
              event: "select",
              type: null,
              id: schema.id,
              template: schema.template,
              rect: {
                height: 0
              },
            },
          ];
        }
        window.parent.postMessage(
          { schema: toRaw(editData.value), event: "hover" },
          "*"
        );
      }
    }




  }
  const editData = ref<any[]>([]);

  function onComponentClick(card: any, event: MouseEvent) {

    const target = event.target as HTMLElement;
    captureElementRect(card.id);
    if (editData.value.length) {
      const type = target?.getAttribute("data-edit");
      const newEditData = toRaw(editData.value)
        .map((data) => {
          if (data.type == type) {
            return {
              ...data,
              event: "click",
              rect: type
                ? RECT_OPT[card.id][type] ?? {}
                : RECT_OPT[card.id].template ?? {},
            };
          }
          if (data.event === "click" && !data.type) {
            return { ...data, event: "select" };
          }
          if (data.event === "click" && data.type) {
            return undefined;
          }
          return data;
        })
        .filter(Boolean);
      editData.value = newEditData;
      window.parent.postMessage({ schema: newEditData, event: "click" }, "*");
    }
  }

  function onComponentHover(card, event) {
    console.log(333);

    const target = event.target as HTMLElement;
    const type = target?.getAttribute("data-edit");
    const hasSelected = editData.value.some(
      (item) => item.event == "click" && item.type
    );
    const data = {
      event: "hover",
      type,
      id: card.id,
      template: card.template,
      rect: target?.getBoundingClientRect(),
    };
    if (!type) {
      const { id } = editData.value[0];
      if (editData.value[0].event != 'click') {
        editData.value[0].event = 'hover';
      }

      if (!hasSelected) {
        if (card.id == id) {
          editData.value.splice(1, 1);
        } else {
          editData.value[0].event = 'hover';
        }
      } else {
        editData.value.splice(2, 1);

      }
    } else {
      if (editData.value[0].event != 'click') {
        editData.value[0].event = 'select';
      }

      if (!hasSelected) {
        editData.value.splice(1, 1, data);
      } else {
        editData.value.splice(2, 1, data);
      }
    }
    editData.value.forEach((item) => {
      if (!item.type) {
        item.id = card.id;
        item.rect = RECT_OPT[card.id].template ?? {};
        item.template = card.template;
      }
    });
    console.log(editData.value);

    window.parent.postMessage(
      { schema: toRaw(editData.value), event: "hover" },
      "*"
    );
  };

  const place = {
    top: 0,
    ind: 0,
  };
  const onComponentDragOver = (e: DragEvent, card: Record<string, any>, pageSchema: any[]) => {
    // 判断clientY和rect.top
    const target = document.querySelector(`.${card.id}`) as HTMLElement;
    const currIndex = pageSchema.findIndex((item) => item.id === card.id);
    // console.log(e);
    const { top, height, bottom } = target.getBoundingClientRect();

    if (e.clientY - top < height / 2) {
      // 在上半部分
      place.top = top;
      place.ind = currIndex > 0 ? currIndex - 1 : 0;
    }
    if (e.clientY - top >= height / 2) {
      place.top = bottom;
      place.ind = currIndex + 1;
    }

    window.parent.postMessage({ type: "place", place }, "*");
  };
  return {
    RECT_OPT,
    handleAllEdit,
    editData,
    captureElementRect,
    onComponentHover,
    onComponentClick,
    onComponentDragOver,
  }
}





