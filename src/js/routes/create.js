

export default {
  
  data() {
    return {
      name: '',
      start: '',
      end: '',
    };
  },
  
  created() {
    
  },
  
  mounted() {
    flatpickr('.date-picker', {});
  },
  
  methods: {
    //jshint ignore: start
    async submit() {
      //console.log(Math.floor(new Date(this.start).getTime() / 1000));
      
      const tx = await APP.donatti.create(this.name, {
        from: APP.account,
        value: 0,
        gas: 1000000
      });
      
      const don = await APP.donatti.getDons.call();
      
      
    }
    //jshint ignore: end
  },
  
  template: `
    <div class="page">
      <md-layout md-align="center" :md-gutter="true">
        <md-layout md-flex="35" md-flex-xsmall="80" md-align="center">
            
          <h2>Create a Donatti</h2>
          
          <form novalidate @submit.stop.prevent="submit">
          
            <md-input-container md-theme="second">
              <label>Name</label>
              <md-input v-model="name" placeholder="Name Your Donatti"></md-input>
            </md-input-container>
            
            <md-input-container md-theme="second">
              <label>Start Date</label>
              <md-input class="date-picker" v-model="start" placeholder="Choose Start Date"></md-input>
            </md-input-container>
            
            <md-input-container md-theme="second">
              <label>End Date</label>
              <md-input class="date-picker" v-model="end" placeholder="Choose End Date"></md-input>
            </md-input-container>
            
            <md-button raised v-on:click="submit">Submit</md-button>
            
          </form>
        
        </md-layout>
      </md-layout>
    </div>
  `
};