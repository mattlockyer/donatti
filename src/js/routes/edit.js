

import DonForm from '../components/don-form';
import utils from '../web3-utils';

export default {
  
  components: {
    'don-form': DonForm
  },
  
  data() {
    return {
      params: []
    };
  },
  
  watch: {
    '$route.params.id'() { this.load(); }
  },
  
  created() {
    this.$root.title = 'Edit Don';
  },
  
  mounted() {
    APP.getDons(this.load);
  },
  
  methods: {
    //jshint ignore: start
    async load(refetch) {
      const { id } = this.$route.params;
      if (!id) return;
      
      let don = APP.donMap[id];
      if (!don) don = await APP.loadDon(id);
      APP.currentDon = don;
      
      //get params
      this.params = APP.donParams[id];
      if (refetch) this.params = await APP.getParams(don);
      
      //force update
      this.$forceUpdate();
    },
    async submit(params) {
      this.$root.snack('Estimating gas costs...');
      
      const gas = await utils.toUSD((await APP.currentDon.update.estimateGas(...params)) * 0.000000021);
      this.$root.prompt({
        title: 'Gas Estimate',
        content: `This will cost approximately \$${ gas } USD with a gas price of 21 gwei`,
        accept:() => this.edit(params),
        reject:() => this.$root.snack('Donatti update cancelled, please try again')
      });
    },
    async edit(params) {
      //check owner
      const owner = await APP.currentDon.owner.call();
      if (owner !== APP.account) {
        this.$root.snack('Sorry you are not the owner of this Don');
        setTimeout(() => this.$root.router.push('/'), 3000);
        return;
      }
      
      //show loader
      this.$root.showLoader();
      
      //explain to user what's going to happen
      this.$root.snack('Please accept the transaction to edit your Don');
      //assume they will accept
      setTimeout(() => this.$root.snack('Processing update'), 5000);
      //update the don
      let tx;
      try {
        tx = await APP.currentDon.update(...params, { from: APP.account });
      } catch(e) {
        this.$root.hideLoader();
        this.$root.snack('Transaction was rejected, please try again');
        return;
      }
      //transaction mined
      this.$root.snack('Waiting for confirmations');
      //waiting for confirmation
      await utils.waitFor(tx);
      //confirmed, redirect
      this.$root.snack('Donatti updated');
      this.$root.hideLoader();
      this.load(true);
    }
    //jshint ignore: end
  },
  
  template: `
    <md-layout md-flex="50" md-flex-small="70" md-flex-xsmall="100" md-align="center">
      <md-whiteframe elevation="1" class="width-100 padding-16">
        <don-form :parent="this" :params="params" :id="$route.params.id"></don-form>
      </md-whiteframe>
    </md-layout>
  `
};