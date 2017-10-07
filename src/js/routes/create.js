

import Don from '../../../build/contracts/Don';
import DonForm from '../components/don-form';
import utils from '../web3-utils';

export default {
  
  components: {
    'don-form': DonForm
  },
  
  created() {
    this.$root.title = 'Create a Donatti';
  },
  
  methods: {
    //jshint ignore: start
    async submit(params) {
      //show loader
      this.$root.showLoader();
      //explain to user what's going to happen
      this.$root.snack('Please accept the transaction to create your Don');
      //assume they will accept
      setTimeout(() => this.$root.snack('Processing Donatti'), 5000);
      //create the don from the form params
      let tx;
      try {
        tx = await APP.donatti.create(...params, { from: APP.account, value: 0, gas: 2000000 });
      } catch(e) {
        this.$root.snack('Transaction was rejected, please try again');
        return;
      }
      //transaction mined
      this.$root.snack('Waiting for confirmations');
      //waiting for confirmation
      await utils.waitFor(tx);
      //confirmed, redirect
      this.$root.snack('Donatti created');
      APP.getUserDons();
      this.$root.hideLoader();
      this.$root.router.push('/dons');
    },
    //jshint ignore: end
  },
  
  template: `
    <md-layout md-flex="50" md-flex-small="70" md-flex-xsmall="100" md-align="center">
      <md-whiteframe elevation="1" class="width-100 padding-16">
        <don-form :parent="this"></don-form>
      </md-whiteframe>
    </md-layout>
  `
};