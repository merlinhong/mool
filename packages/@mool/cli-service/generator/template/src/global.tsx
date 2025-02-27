
export default function GlobalLayOut({ router,Root={} }) {
  
  router.beforeEach((to, from, next) => {
    document.title = (to.meta.title || "666") as string;
    next();
  });
  return ()=>(
    <div><Root/></div>
  )
}
