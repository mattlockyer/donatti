

export default {
  
  props: ['parent'],
  
  data() {
    return {
      name: '',
      open: true,
      over: false,
      start: '',
      end: '',
      goal: ''
    };
  },
  
  mounted() {
    flatpickr('.date-picker', { enableTime: true });
  },
  
  methods: {
    submit() {
      //console.log(Math.floor(new Date(this.start).getTime() / 1000));
      const { name, open, over, start, end, goal } = this;
      const params = [ name, open, over, start, end, goal ];
      
      if (params[0] === '') {
        this.$root.snack('Please Name Your Donatti and Try Again');
        return;
      }
      
      params[3] = Math.floor(new Date(params[3] ? params[3] : 0).getTime() / 1000); //start time
      params[4] = Math.floor(new Date(params[4] ? params[4] : 999999999999).getTime() / 1000); //end time
      
      if (params[5] === '') params[5] = 0;
      
      this.parent.submit(params);
    },
    reset() {
      Object.assign(this, {
        name: '',
        open: true,
        over: false,
        start: '',
        end: '',
        goal: ''
      });
    }
  },
  
  template: `
  
    <form novalidate @submit.stop.prevent="submit">
    
      <md-input-container md-theme="second">
        <label>Name</label>
        <md-input v-model="name" placeholder="Name Your Donatti"></md-input>
      </md-input-container>
      
      <div>
        <md-switch v-model="open">Donations Open</md-switch>
      </div>
      
      <div>
        <md-switch v-model="over">Accept Over Goal</md-switch>
      </div>
      
      <md-input-container md-theme="second">
        <label>Start Date</label>
        <md-input class="date-picker" v-model="start" placeholder="Start Date (default: now)"></md-input>
      </md-input-container>
      
      <md-input-container md-theme="second">
        <label>End Date</label>
        <md-input class="date-picker" v-model="end" placeholder="End Date (default: forever)"></md-input>
      </md-input-container>
      
      <md-input-container md-theme="second">
        <label>Funding Goal</label>
        <md-input v-model="goal" placeholder="Goal (default: unlimited)" type="number"></md-input>
      </md-input-container>
      
      <md-layout md-align="center">
        <md-button class="md-raised" v-on:click="submit">Submit</md-button>
        <md-button class="md-raised" v-on:click="reset">Reset</md-button>
      </md-layout>
      
    </form>
  `
};