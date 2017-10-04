

import DonForm from '../components/don-form';
import utils from '../web3-utils';

export default {
  
  components: {
    'don-form': DonForm
  },
  
  data() {
    return {
      params: [],
      balance: 0,
      percent: 0,
      value: '',
    };
  },
  
  watch: {
    '$route.params.id'() { this.load(); }
  },
  
  created() {
    this.$root.title = 'Contribute';
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
      this.params = APP.getParamObject(this.params);
      
      
      this.updateBalance();
      
      //force update
      this.$forceUpdate();
    },
    async contribute() {
      if (this.value === '') {
        this.$root.snack('Please enter a value to contribute');
        return;
      }
      const value = utils.toWei(this.value);
      const tx = await APP.currentDon.sendTransaction({
        value,
        from: APP.account
      });
      this.$root.snack('Contribution Made');
      this.updateBalance();
    },
    async updateBalance() {
      this.balance = await APP.getBalance(APP.currentDon);
      this.percent = this.balance / this.params.goal * 100;
    }
    //jshint ignore: end
  },
  
  template: `
    <div class="page">
      <md-layout md-align="center" :md-gutter="true">
        <md-layout md-flex="80" md-align="center">
            
          <md-layout md-flex="50" md-flex-xsmall="90" md-align="center">
          
            <h2>{{ params.name }}</h2>
          
            <md-whiteframe elevation="1" class="width-100 padding-16">
              <md-progress v-if="params.goal !== 0" md-theme="second" :md-progress="percent">
              </md-progress>
              <h4>
                Contributions: {{ balance }} <span v-if="params.goal !== 0">/ {{ params.goal }}</span>
              </h4>
              <p v-if="params.start && params.start.length !== 0" >Start {{ params.start }}</p>
              <p v-if="params.end && params.end.length !== 0" >End {{ params.end }}</p>
            </md-whiteframe>
            
            <div class="margin-16 padding-16">
            
               <form novalidate @submit.stop.prevent="submit">
              
                <md-input-container md-theme="second">
                  <label>Contribution Amount</label>
                  <md-input v-model="value" placeholder="Amount"></md-input>
                </md-input-container>
              
              </form>
              
              <md-button class="md-raised" v-on:click="contribute">Contribute</md-button>
              
            </div>
            
          </md-layout>
        
        </md-layout>
      </md-layout>
    </div>
  `
};