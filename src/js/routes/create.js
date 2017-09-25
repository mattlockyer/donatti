

import utils from '../web3-utils';
import Don from '../../../build/contracts/Don';
import DonForm from '../components/don-form';

export default {
  
  components: {
    'don-form': DonForm
  },
  
  
  created() {
    
  },
  
  methods: {
    //jshint ignore: start
    async submit(params) {
      
      const tx = await APP.donatti.create(...params, {
        from: APP.account,
        value: 0,
        gas: 4000000
      });
      
    },
    //jshint ignore: end
  },
  
  template: `
    <div class="page">
      <md-layout md-align="center" :md-gutter="true">
      
        <md-layout md-flex="100" md-align="center">
            
          <h2>Create a Donatti</h2>
          
        </md-layout>
          
        <md-layout md-flex="50" md-flex-xsmall="90" md-align="center">
          <md-whiteframe elevation="1" class="width-100 padding-16">
            <don-form :parent="this"></don-form>
          </md-whiteframe>
        </md-layout>
        
      </md-layout>
    </div>
  `
};