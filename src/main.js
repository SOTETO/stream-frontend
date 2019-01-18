import Vue from 'vue'
import App from './App.vue'
import { WidgetTopNavigation, WidgetBottomNavigation } from 'vca-widget-navigation'
import router from './router'
import VueI18n from 'vue-i18n'
import en from '@/lang/en_US.json';
import de from '@/lang/de_DE.json';

Vue.use(VueI18n);

const locale =  navigator.language;
const i18n = new VueI18n({
    locale: locale,
    messages: {
        'en-US': en,
        'de-DE': de,
        'de': de,
        'en': en
    }
});

Vue.use(WidgetBottomNavigation, { 'i18n': i18n })
Vue.use(WidgetTopNavigation, { 'i18n': i18n })

Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
