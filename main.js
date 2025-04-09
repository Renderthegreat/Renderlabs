import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/global.css';
import ErrorComponent from './layout/error.vue';

const app = createApp(App);
app.use(router);

app.config.errorHandler = (err, vm, info) => {
    app.config.globalProperties.$error = err;
    app.config.globalProperties.$info = info;

    app.component('ErrorComponent', ErrorComponent);
};

app.mount('#app');
