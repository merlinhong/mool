import { ref, reactive, getCurrentInstance, type Ref } from "vue";
export const useRef = <T extends abstract new (...args: any[]) => any>(
  _c: T,
) => {
  return ref<InstanceType<T>>();
};
export function useRefs() {
  const refs = reactive<{ [key: string]: any }>({});

  function setRefs(name: string) {
    return (el: any) => {
      refs[name] = el;
      return () => refs[name];
    };
  }

  return { refs, setRefs };
}
export function useParent(name: string, r: Ref) {
  const d = getCurrentInstance();

  if (d) {
    let parent = d.proxy?.$.parent;

    if (parent) {
      while (parent && parent.type?.name != name) {
        parent = parent?.parent;
      }

      if (parent) {
        if (parent.type.name == name) {
          r.value = parent.exposed;
        }
      }
    }
  }

  return r;
}
export * from "./useEffect";
export * from "./useBrowser";
export * from "./useLoading";
