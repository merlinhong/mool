export default defineComponent({
  setup(props, ctx) {
    return () => (
      <>
        <div
          style="
            display: flex;
            flex-direction: column;
            margin: auto;
            text-align: center;
            width:100vw;
            height:100vh
          "
        >
          <span>抱歉，您没有权限访问!</span>
        </div>
      </>
    );
  },
});
