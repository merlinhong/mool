import {ElButton} from 'element-plus';
export default defineComponent({
        setup(props, ctx) {
                const router = useRouter();
                return ()=>(
                        <>
                        <ElButton onClick={()=>router.push('/')}>欢迎页</ElButton>
                        <ElButton>管理页</ElButton>
                        <ElButton onClick={()=>router.push('/admin')}>菜单页</ElButton>
                        </>
                )
        },
})