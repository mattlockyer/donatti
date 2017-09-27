

//app.js
import router from './router';
import Theme from './theme';
import utils from './web3-utils';

import Donatti from '../../build/contracts/Donatti';
import Don from '../../build/contracts/Don';

Vue.use(VueRouter);
Vue.use(VueMaterial);

Theme.init();

const APP = window.APP = {
  donMap: {},
  donParams: {},
  donList: [],
  //jshint ignore: start
  updateDons: async (cb) => {
    //might not have contract yet
    if (!APP.initialized) {
      setTimeout(() => APP.updateDons(cb), 250);
      return;
    }
    //get dons
    const dons = await APP.donatti.getDons.call();
    //grab each don instance
    for (let i in dons) {
      const addr = dons[i];
      const don = await utils.getContract(Don, addr);
      const params = await don.getParameters.call();
      if (!APP.donMap[addr]) {
        don.i = i;
        APP.donMap[addr] = don;
        APP.donParams[addr] = params;
        APP.donList.push(addr);
      }
    }
    //callback
    if (cb) cb();
  }
  //jshint ignore: end
};

const VueApp = new Vue({
  el: '#app',
  router,
  
  data: {
    router,
    menu: router.options.routes,
    snackbar: {
      message: 'message',
      duration: 3000
    }
  },
  
  watch: {
    $route() {
      this.closeNav();
    }
  },
  
  //jshint ignore: start
  async created() {
    utils.getWeb3();
    APP.account = (await utils.getAccounts())[0];
    APP.donatti = await utils.getContract(Donatti);
    APP.initialized = true;
    APP.updateDons();
  },
  //jshint ignore: end
  
  mounted() {
    this.$refs.loader.classList.add('hidden');
    this.$refs.content.classList.remove('hidden');
  },
  
  methods: {
    showLoader() {
      this.$refs.loader.classList.remove('hidden');
    },
    hideLoader() {
      this.$refs.loader.classList.add('hidden');
    },
    closeNav() {
      this.$refs.leftSidenav.close();
    },
    toggleNav() {
      this.$refs.leftSidenav.toggle();
    },
    snack(msg, dur = 3000) {
      this.snackbar.message = msg;
      this.snackbar.duration = dur;
      if (!this.$refs.snackbar.active) this.$refs.snackbar.open();
    },
  }
});
