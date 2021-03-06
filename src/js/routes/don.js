

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
    this.$root.showLoader(true);
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
      if (refetch) await APP.getParams(don);
      this.params = APP.donParamsObj[id];
      
      await this.updateBalance();
      
      //hide the loader
      this.$root.hideLoader(true);
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
      this.balanceUSD = await utils.toUSD(this.balance);
    }
    //jshint ignore: end
  },
  
  template: `
    
    <md-layout md-flex="50" md-flex-small="70" md-flex-xsmall="100" md-align="center">
        
      <h2 class="width-100 center">{{ params.name }}</h2>
     
      
      <div style="width:50%">
        <img :src="params.url" />
      </div>
    
      <md-whiteframe elevation="1" class="width-100 padding-16">
        <md-progress v-if="params.goal !== 0" md-theme="second" :md-progress="percent">
        </md-progress>
        <h4>
          Contributions: {{ balance }} <span v-if="typeof params.goal === 'number'">/ {{ params.goal }}</span>
        </h4>
        <h4>
          Total USD Raised: \${{ this.balanceUSD }}
        </h4>
        <p v-if="typeof params.start === 'number'" >Start {{ params.start }}</p>
        <p v-if="typeof params.end === 'number'" >End {{ params.end }}</p>
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
  `
};