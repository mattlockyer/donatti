

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
      goal: 0,
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
      const don = APP.currentDon = APP.donMap[id];
      if (!don) return;
      
      //set params
      this.params = APP.donParams[id];
      if (refetch) this.params = APP.donParams[id] = await don.getParameters.call();
      
      this.goal = this.params[5].toNumber();
      
      this.updateBalance();
      
      //force update
      this.$forceUpdate();
    },
    async contribute() {
      if (this.value === '') {
        this.$root.snack('Please enter a value to contribute');
        return;
      }
      const value = parseInt(this.value);
      const tx = await APP.currentDon.sendTransaction({
        value,
        from: APP.account
      });
      this.$root.snack('Contribution Made');
      this.updateBalance();
    },
    async updateBalance() {
      this.balance = (await utils.getBalance(APP.currentDon.address)).toNumber();
      this.percent = this.balance / this.params[5].toNumber() * 100;
    }
    //jshint ignore: end
  },
  
  template: `
    <div class="page">
      <md-layout md-align="center" :md-gutter="true">
        <md-layout md-flex="80" md-align="center">
            
          <md-layout md-flex="50" md-flex-xsmall="90" md-align="center">
          
            <h2>{{ params[0] }}</h2>
          
            <md-whiteframe elevation="1" class="width-100 padding-16">
              <md-progress v-if="goal !== 0" md-theme="second" :md-progress="percent">
              </md-progress>
              <h4>
                Contributions: {{ balance }} <span v-if="this.goal !== 0">/ {{ goal }}</span>
              </h4>
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