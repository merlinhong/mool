import { inject } from "vue";
const ACCESS_KEY = Symbol('use-access');
export const useAccess = ()=>{
    return inject(ACCESS_KEY) as Record<string,any>;
}