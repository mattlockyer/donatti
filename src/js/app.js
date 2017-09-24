

//app.js
import router from './router';
import Theme from './theme';
import utils from './web3-utils';

Vue.use(VueRouter);
Vue.use(VueMaterial);

Theme.init();


const VueApp = new Vue({
  el: '#app',
  router,
  
  data: {
    router,
    menu: router.options.routes,
    snackbarMessage: 'message'
  },
  
  watch: {
    $route: function() {
      
    }
  },
  
  created() {
    
  },
  
  mounted() {
    this.$refs.loader.classList.add('hidden');
    this.$refs.content.classList.remove('hidden');
  },
  
  methods: {
    toggleLeftSidenav() {
      this.$refs.leftSidenav.toggle();
    },
  }
});
