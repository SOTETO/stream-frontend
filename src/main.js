import Vue from 'vue'
import App from './App.vue'
import { WidgetTopNavigation, WidgetBottomNavigation } from 'vca-widget-navigation'
import router from './router'
import VueI18n from 'vue-i18n'
import en from '@/lang/en_US.json';
import de from '@/lang/de_DE.json';
import store from './store'

const dateTimeFormats = {
    'en-US': {
        short: {
            year: 'numeric', month: 'short', day: 'numeric'
        },
        long: {
            year: 'numeric', month: 'short', day: 'numeric',
            weekday: 'short', hour: 'numeric', minute: 'numeric'
        }
    },
    'de-DE': {
        short: {
            year: 'numeric', month: 'short', day: 'numeric'
        },
        long: {
            year: 'numeric', month: 'short', day: 'numeric',
            weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true
        }
    }
}

Vue.use(VueI18n);

const locale =  navigator.language;
const i18n = new VueI18n({
    locale: locale,
    dateTimeFormats,
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
  store,
  render: h => h(App)
}).$mount('#app')
