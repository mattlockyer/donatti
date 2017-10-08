

//app.js
import donatti from './donatti';
import router from './router';
import Theme from './theme';

Vue.use(VueRouter);
Vue.use(VueMaterial);

Theme.init();

/**************************************
* VUE APP
**************************************/

const VueApp = new Vue({
  el: '#app',
  router,
  
  data: {
    title: 'Donatti',
    router,
    routeLoader: false,
    menu: router.options.routes,
    snackbar: {
      message: 'message',
      duration: 3000
    },
    dialog: {
      title: 'Dialog',
      content: 'Hello I am a dialog',
      acceptLabel: 'Ok',
      rejectLabel: 'Cancel',
      accept: null,
      reject: null
    },
  },
  
  watch: {
    $route() {
      this.closeNav();
    }
  },
  
  mounted() {
    setTimeout(() => APP.init(), 500);
    this.$refs.snackWrap.classList.remove('hidden');
    this.$refs.dialogWrap.classList.remove('hidden');
    this.hideLoader();
  },
  
  methods: {
    showLoader(routeLoader = false) {
      this.routeLoader = routeLoader;
      this.$refs.loader.classList.remove('hidden');
      this.$refs.content.classList.add('hidden');
    },
    hideLoader(routeLoader = false) {
      if (this.routeLoader && !routeLoader) return;
      this.routeLoader = false;
      this.$refs.loader.classList.add('hidden');
      this.$refs.content.classList.remove('hidden');
    },
    closeNav() {
      this.$refs.leftSidenav.close();
    },
    toggleNav() {
      this.$refs.leftSidenav.toggle();
    },
    snack(msg, dur = 3000) {
      setTimeout(() => {
        if (this.$refs.snackbar.active) return;
        this.snackbar.message = msg;
        this.snackbar.duration = dur;
        this.$refs.snackbar.open();
      }, 100);
    },
    //dialog
    prompt(args) {
      Object.assign(this.dialog, args);
      this.$refs.dialog.open();
    },
    acceptPrompt() {
      if (this.dialog.accept) this.dialog.accept();
      this.$refs.dialog.close();
    },
    rejectPrompt() {
      if (this.dialog.reject) this.dialog.reject();
      this.$refs.dialog.close();
    },
  }
});
