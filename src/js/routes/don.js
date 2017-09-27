

import DonForm from '../components/don-form';

export default {
  
  components: {
    'don-form': DonForm
  },
  
  data() {
    return {
      params: [],
      balance: 0,
      percent: 0,
      goal: 0
    };
  },
  
  watch: {
    '$route.params.id'() { this.load(); }
  },
  
  created() {
    //jshint ignore: start
    APP.updateDons(this.load);
    //jshint ignore: end
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
      const tx = await APP.currentDon.pay(25, { from: APP.account });
      this.$root.snack('Contribution Made');
      this.updateBalance();
    },
    async updateBalance() {
      this.balance = (await APP.currentDon.balance.call()).toNumber();
      this.percent = this.balance / this.params[5].toNumber() * 100;
      
      console.log(this.balance);
    }
    //jshint ignore: end
  },
  
  template: `
    <div class="page">
      <md-layout md-align="center" :md-gutter="true">
        <md-layout md-flex="80" md-align="center">
            
          <md-layout md-flex="100" md-align="center">
            <h2>{{ params[0] }}</h2>
          </md-layout>
            
          <md-layout md-flex="50" md-flex-xsmall="90" md-align="center">
          
            <md-whiteframe elevation="1" class="width-100 padding-16">
              <md-progress v-if="goal !== 0" md-theme="second" :md-progress="percent">
              </md-progress>
              <h4>
                Contributions: {{ balance }} <span v-if="this.goal !== 0">/ {{ goal }}</span>
              </h4>
            </md-whiteframe>
            
            <md-button class="md-raised margin-16" v-on:click="contribute">Contribute</md-button>
            
          </md-layout>
        
        </md-layout>
      </md-layout>
    </div>
  `
};