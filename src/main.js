import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/base.css'
import './styles/motion.css'
import revealDirective from './directives/reveal'

createApp(App).use(router).directive('reveal', revealDirective).mount('#app')
