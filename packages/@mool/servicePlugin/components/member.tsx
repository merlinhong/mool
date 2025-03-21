import {
    h,
    defineComponent,
    FunctionalComponent,
    DefineComponent,
    Component,
    ref,
    onMounted,
    onUnmounted,
    VNode,
    ComponentPublicInstance
} from 'vue'
import { useStore } from "mooljs";
const { vipStatu, checkVip } = useStore("vip");

// 类型定义
type vipStatu = {
    isVip: boolean
    level?: number
    expires?: Date
}

type GuardOptions<T> = {
    // 加载状态组件
    loading?: Component | VNode
    // 错误状态渲染函数
    error?: (retry: () => void) => VNode
    // 非会员提示内容
    update?: (args: vipStatu) => void;
    // 自定义权限验证逻辑
    validate?: (status: vipStatu) => boolean
    // 自动刷新间隔（毫秒）
    refreshInterval?: number
    // 触发去开通会员的方法
    go?:(args?:any)=>void
}

// 高阶组件工厂函数
export function createVIPGuard<T extends Component>(
    options: GuardOptions<T> = {}
): DefineComponent {
    return defineComponent({
        name: 'VIPGuard',
        inheritAttrs: false,
        setup(_, { attrs, slots, emit }) {
            const loading = ref(true)
            const error = ref<Error | null>(null)
            let refreshTimer: number | null = null

            const fetchData = async () => {
                try {
                    error.value = null
                    loading.value = true
                    await checkVip();
                    options.update?.(vipStatu.value)
                } catch (err) {
                    error.value = err as Error
                    emit('error', err)
                } finally {
                    loading.value = false
                }
            }

            onMounted(() => {
                fetchData()
                if (options.refreshInterval) {
                    refreshTimer = window.setInterval(fetchData, options.refreshInterval)
                }
            })

            onUnmounted(() => {
                if (refreshTimer) {
                    window.clearInterval(refreshTimer)
                }
            })

            const renderContent = (): VNode => {
                if (error.value) {
                    return options.error?.(fetchData) || h('div', [
                        h('p', '会员状态加载失败'),
                        h('button', { onClick: fetchData }, '重试')
                    ])
                }

                if (loading.value) {
                    return options.loading
                        ? h(options.loading)
                        : h('div', { class: 'vip-loading' }, '加载会员信息...')
                }
                if (vipStatu.value.isVip) {
                    ElMessage.success('您现在是vip了，可以畅享所有书籍的阅读')
                } else {
                    ElMessageBox.confirm('您还不是vip,请先开通vip', {
                        type: 'warning',
                        confirmButtonText: '去开通',
                    }).then(()=>{
                        options.go?.();
                    }).catch(()=>{
                        
                    })
                }
                return h('div', attrs, slots.default?.())
            }

            return () => h(
                'div',
                { class: 'vip-guard-container' },
                [renderContent()]
            )
        }
    })
}