

import utils from '../web3-utils';
import Don from '../../../build/contracts/Don';
import DonForm from '../components/don-form';

export default {
  
  components: {
    'don-form': DonForm
  },
  
  created() {
    this.$root.title = 'Create a Donatti'
  },
  
  methods: {
    //jshint ignore: start
    async submit(params) {
      
      //show loader
      this.$root.showLoader();
      //explain to user what's going to happen
      this.$root.snack('Please accept the transaction and we will redirect you when your Don is created', 4000);
      //create the don from the form params
      const tx = await APP.donatti.create(...params, {
        from: APP.account,
        value: 0,
        gas: 2000000 //2 million gas should be plenty
      });
      
      
      /**************************************
      * TODO WAIT FOR CONFIRMATION
      **************************************/
      
      APP.updateDons();
      
      //should wait for tx to return from Kovan
      this.$root.hideLoader();
      this.$root.router.push('/dons');
      
      //debug simulate blockchain delay
      // setTimeout(() => {
      //   this.$root.hideLoader();
      //   this.$root.router.push('/dons');
      // }, 5000);
      
    },
    //jshint ignore: end
  },
  
  template: `
    <div class="page">
      <md-layout md-align="center" :md-gutter="true">
          
        <md-layout md-flex="50" md-flex-xsmall="90" md-align="center">
          <md-whiteframe elevation="1" class="width-100 padding-16">
            <don-form :parent="this"></don-form>
          </md-whiteframe>
        </md-layout>
        
      </md-layout>
    </div>
  `
};