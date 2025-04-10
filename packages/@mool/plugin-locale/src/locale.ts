// src/libs/locale-manager.ts
import { createI18n, type I18n, type I18nOptions } from "vue-i18n";
import { inject, type App, type InjectionKey } from "vue";
// import { StoreManager } from './store-manager';

type LocaleModule = Record<string, any>;
type LocaleMessages = Record<string, LocaleModule>;
type LocaleConfig = {
    persistent?: boolean;
    fallbackLocale?: string;
    allowComposition?: boolean;
    legacy?: boolean;
};

const DEFAULT_LOCALE = "zh-CN";
const LOCALE_STORAGE_KEY = "mooljs-locale";

// 类型安全注入令牌
export const LOCALE_INJECTION_KEY: InjectionKey<I18n> = Symbol("i18n");

/**
 * 国际化管理器（工厂模式实现）
 */
export class LocaleManager {
    private static _instance: LocaleManager;
    private _i18n!: I18n;
    //   private _store: StoreManager;
    private _config: Required<LocaleConfig> = {
        persistent: true,
        fallbackLocale: "en-US",
        legacy: false,
        allowComposition: true,
    };
    private app: App;

    private constructor(app: App) {
        // this._store = StoreManager.create(app);
        this.app = app;
    }

    static create(app: App) {
        if (!this._instance) {
            this._instance = new LocaleManager(app);
        }
        return this._instance;
    }

    /**
     * 初始化国际化实例
     */
    async initialize(config: LocaleConfig = {}) {
        this._config = { ...this._config, ...config };

        const messages = await this.loadLocaleModules();
        this.setupI18n(messages);
        // this.setupDevTools();
    }

    /**
     * 动态加载语言模块
     */
    private async loadLocaleModules(): Promise<LocaleMessages> {
        const modules = import.meta.glob<{ default: LocaleModule }>(
            "/src/locale/*.ts",
            { eager: true },
        );

        return Object.entries(modules).reduce((acc, [path, module]) => {
            const lang = this.extractLanguageCode(path);
            if (lang) acc[lang] = module.default;
            return acc;
        }, {} as LocaleMessages);
    }

    /**
     * 创建 I18n 实例
     */
    private setupI18n(messages: LocaleMessages) {
        this._i18n = createI18n({
            locale: this.currentLocale,
            messages,
            ...this._config,
        });
        this.app.use(this._i18n);
        this.provideToApp();
    }

    /**
     * 向应用提供实例
     */
    private provideToApp() {
        this.app.provide(LOCALE_INJECTION_KEY, this._i18n);
    }

    /**
     * 开发工具集成
     */
    //   private setupDevTools() {
    //     if (import.meta.env.DEV) {
    //       this._store.register('@@i18n-debug', () => ({
    //         locales: this.availableLocales,
    //         current: this.currentLocale,
    //         messages: this._i18n.global.messages
    //       }));
    //     }
    //   }

    /**
     * 获取当前语言
     */
    get currentLocale(): string {
        return this._config.persistent
            ? localStorage.getItem(LOCALE_STORAGE_KEY) || DEFAULT_LOCALE
            : DEFAULT_LOCALE;
    }

    /**
     * 可用语言列表
     */
    get availableLocales(): string[] {
        return Object.keys(this._i18n.global.messages.value);
    }

    /**
     * 更新当前语言
     */
    updateLocale(lang: string) {
        this._i18n.global.locale.value = lang;
        if (this._config.persistent) {
            localStorage.setItem(LOCALE_STORAGE_KEY, lang);
        }
    }
    /**
     * 增加多语言
     */
    addLocale(lang: string, message: LocaleModule) {
        if (this._i18n.global.messages[lang]) {
            console.warn(`Locale ${lang} already exists.`);
            return;
        }

        this._i18n.global.setLocaleMessage(lang, message);

        if (this._config.persistent) {
            localStorage.setItem(LOCALE_STORAGE_KEY, lang);
        }
    }

    /**
     * 获取原生实例
     */
    static get instance(): LocaleManager {
        return this._instance;
    }

    private extractLanguageCode(path: string): string | null {
        return path.match(/([^/]+)\.ts$/)?.[1] || null;
    }
}

// 组合式 API 封装
export const useLocale = () => {
    const i18n = inject(LOCALE_INJECTION_KEY)!;
    return {
        t: i18n.global.t,
        getLocale: () => i18n.global.locale,
        addLocale: (lang: string, message: LocaleModule) => {
            const instance = LocaleManager.instance;
            instance.addLocale(lang, message);
        },
        getAllLocales: () => Object.keys(i18n.global.messages.value),
        setLocale: function (lang: string) {
            const instance = LocaleManager.instance;
            if(!instance.availableLocales.includes(lang))return 
            instance.updateLocale(lang);
        },
    };
};

// 初始化函数
export const setupLocale = (app: App, config?: LocaleConfig) => {
    const manager = LocaleManager.create(app);
    manager.initialize(config);
    return manager;
};
