

export default {
  
  data() {
    return {
      don: {},
      params:{},
      balance: 0
    };
  },
  
  watch: {
    '$route.params.id': function() { this.load(); }
  },
  
  created() {
    //jshint ignore: start
    APP.updateDons(async () => {
      const { id } = this.$route.params;
      if (!id) return;
      const don = APP.currentDon = APP.donMap[id];
      if (!don) return;
      this.don = APP.donList[don.i];
      this.params = await don.getParameters.call();
      this.balance = (await don.balance.call()).toNumber();
      
      this.$forceUpdate();
    });
    //jshint ignore: end
  },
  
  methods: {
    //jshint ignore: start
    async contribute() {
      const tx = await APP.currentDon.pay(100, { from: APP.account });
      
      this.balance = (await APP.currentDon.balance.call()).toNumber();
      
      this.$forceUpdate();
    }
    //jshint ignore: end
  },
  
  template: `
    <div class="page">
      <md-layout md-align="center" :md-gutter="true">
        <md-layout md-flex="80" md-align="center">
            
          <h2>Donatti: {{ don.name }}</h2>
          
          <md-whiteframe md-elevation="1" class="width-100 padding-16">
            <div>Balance: {{ balance }}</div>
            <div>Open: {{ params[0] }}</div>
            <div>Over: {{ params[1] }}</div>
            <div>Start: {{ params[2] }}</div>
            <div>End: {{ params[3] }}</div>
            <div>Goal: {{ params[4] }}</div>
            <div><md-button v-on:click="contribute">Contribute</md-button></div>
          </md-whiteframe>
          
          
        
        </md-layout>
      </md-layout>
    </div>
  `
};