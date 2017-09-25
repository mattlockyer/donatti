

export default {
  
  props: ['parent', 'params', 'submitLabel', 'resetLabel'],
  
  data() {
    return {
      stateParams: ['', true, false, '', '', '']
    };
  },
  
  watch: {
    params() {
      this.reset();
    }
  },
  
  mounted() {
    flatpickr('.date-picker', { enableTime: true });
  },
  
  methods: {
    submit() {
      const { name, open, over, start, end, goal } = this;
      const params = [ name, open, over, start, end, goal ];
      
      //check name was set
      if (params[0] === '') {
        this.$root.snack('Please Name Your Donatti and Try Again');
        return;
      }
      //set times and goal
      params[3] = Math.floor(new Date(params[3] ? params[3] : 0).getTime() / 1000); //start time
      params[4] = Math.floor(new Date(params[4] ? params[4] : 999999999999).getTime() / 1000); //end time
      if (params[5] === '') params[5] = 0;
      
      this.parent.submit(params);
    },
    reset() {
      this.stateParams = this.params.slice();
      //check defaults for start, end, goal
      if (this.stateParams[3].toNumber() === 0) this.stateParams[3] = '';
      if (this.stateParams[4].toNumber() === 999999999) this.stateParams[4] = '';
      if (this.stateParams[5].toNumber() === 0) this.stateParams[5] = '';
    }
  },
  
  template: `
  
    <form novalidate @submit.stop.prevent="submit">
    
      <md-input-container md-theme="second">
        <label>Name</label>
        <md-input v-model="stateParams[0]" placeholder="Name Your Donatti"></md-input>
      </md-input-container>
      
      <div>
        <md-switch v-model="stateParams[1]">Donations Open</md-switch>
      </div>
      
      <div>
        <md-switch v-model="stateParams[2]">Accept Over Goal</md-switch>
      </div>
      
      <md-input-container md-theme="second">
        <label>Start Date</label>
        <md-input class="date-picker" v-model="stateParams[3]" placeholder="Start Date (default: now)"></md-input>
      </md-input-container>
      
      <md-input-container md-theme="second">
        <label>End Date</label>
        <md-input class="date-picker" v-model="stateParams[4]" placeholder="End Date (default: forever)"></md-input>
      </md-input-container>
      
      <md-input-container md-theme="second">
        <label>Funding Goal</label>
        <md-input v-model="stateParams[5]" placeholder="Goal (default: unlimited)" type="number"></md-input>
      </md-input-container>
      
      <md-layout md-align="center">
        <md-button class="md-raised" v-on:click="submit">{{ submitLabel ? submitLabel : 'Submit' }}</md-button>
        <md-button class="md-raised" v-on:click="reset">{{ resetLabel ? resetLabel : 'Reset' }}</md-button>
      </md-layout>
      
    </form>
  `
};