

export default {
  
  created() {
    this.$root.title = 'Donatti';
  },
  
  template: `
    <md-layout md-flex="50" md-flex-small="70" md-flex-xsmall="100" md-align="center">
      
      <md-layout md-flex="50" md-flex-small="60" md-flex-xsmall="70" md-align="center">
        <div>
          <img src="img/donatti.png" />
        </div>
      </md-layout>
      
      <div class="width-100 center">
        <h2>An Ethereum Donation Box Service</h2>
        <p>Donatti lets anyone create a donation box with </p>
      </div>
      
    </md-layout>
  `
};