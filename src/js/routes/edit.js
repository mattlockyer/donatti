

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
      const don = APP.currentDon = APP.donMap[id];
      if (!don) return;
      
      //get params
      this.params = APP.donParams[id];
      if (refetch) this.params = await APP.getParams(don);
      
      //force update
      this.$forceUpdate();
    },
    async submit(params) {
      this.$root.showLoader();
      const tx = await APP.currentDon.update(...params, { from: APP.account });
      this.$root.hideLoader();
      this.$root.snack('Donatti Updated');
      this.load(true);
    }
    //jshint ignore: end
  },
  
  template: `
    <div class="page">
      <md-layout md-align="center" :md-gutter="true">
        <md-layout md-flex="80" md-align="center">
            
          <md-layout md-flex="50" md-flex-xsmall="90" md-align="center">
            <md-whiteframe elevation="1" class="width-100 padding-16">
              <don-form :parent="this" :params="params" :id="$route.params.id"></don-form>
            </md-whiteframe>
          </md-layout>
        
        </md-layout>
      </md-layout>
    </div>
  `
};