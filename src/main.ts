import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
import 'virtual:windi.css'
import router from './router'
import { Icon } from '@iconify/vue';
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'


let app = createApp(App);
app.use(router)
app.use(vm=>{
    vm.component('Icon',Icon)
})

app.mount("#app");
