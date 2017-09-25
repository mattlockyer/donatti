

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
      const params = this.stateParams.slice();
      
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
      const params = this.stateParams = this.params.slice();
      
      //check defaults for start, end, goal
      if (params[3].toNumber() === 0) params[3] = '';
      else params[3] = FlatpickrInstance.prototype.formatDate(new Date(params[3] * 1000), 'Y-m-d h:i');
      if (params[4].toNumber() === 999999999) params[4] = '';
      else params[4] = FlatpickrInstance.prototype.formatDate(new Date(params[4] * 1000), 'Y-m-d h:i');
      if (params[5].toNumber() === 0) params[5] = '';
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