import { createRouter, createWebHashHistory,RouterView} from 'vue-router'
import routes from '~pages';
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router
export {RouterView,routes}