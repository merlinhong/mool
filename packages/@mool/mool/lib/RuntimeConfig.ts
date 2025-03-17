import { Router } from 'vue-router';
import { DefineComponent } from "vue";
export namespace RuntimeConfig{
    export type App = DefineComponent;
    export type router = Router
}
