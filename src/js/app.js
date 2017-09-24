

//app.js
import router from './router';
import Theme from './theme';
import utils from './web3-utils';

import Donatti from '../../build/contracts/Donatti';

Vue.use(VueRouter);
Vue.use(VueMaterial);

Theme.init();

const APP = window.APP = {
  
};

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
  
  //jshint ignore: start
  async created() {
    utils.getWeb3();
    APP.account = (await utils.getAccounts())[0];
    APP.donatti = await utils.getContract(Donatti);
  },
  //jshint ignore: end
  
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
