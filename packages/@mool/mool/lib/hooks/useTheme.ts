import { ref, computed } from "vue";

/**
 * @param darkModeSelector 默认值是app-dark
 * @returns 
 */
export function useTheme(darkModeSelector = 'app-dark') {
    const darkTheme = ref(false);
    const setTheme = (value: boolean) => {
        if (!document.startViewTransition) {
            executeDarkModeToggle();

            return;
        }

        document.startViewTransition(() => executeDarkModeToggle(event));
    };
    const theme = computed(() => {
        return darkTheme.value ? 'dark' : 'light';
    })
    const isDarkTheme = computed(() => darkTheme.value);
    const executeDarkModeToggle = () => {
        darkTheme.value = !darkTheme.value;
        document.documentElement.classList.toggle(darkModeSelector);
        document.documentElement.style.colorScheme = theme.value;
    };
    return {
        setTheme,
        theme,
        isDarkTheme
    };
}