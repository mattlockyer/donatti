

export default {
  
  created() {
    this.$root.title = 'Donatti';
  },
  
  template: `
    <md-layout md-flex="50" md-flex-small="70" md-flex-xsmall="100" md-align="center">
      
      <md-layout md-flex="50" md-flex-small="60" md-flex-xsmall="70" md-align="center">
        <div>
          <img src="img/donatti.png" style="filter: saturate(3) hue-rotate(30deg)" />
        </div>
      </md-layout>
      
      <div class="width-100 center">
        <h2>An Ethereum Donation Box Service</h2>
        
        <md-boards md-theme="second" :md-auto="true" :md-infinite="true" :md-duration="5000" :md-swipeable="true">
          <md-board>
            <p>Donatti lets anyone create a donation box (Donatti) on the blockchain to fund their project,
              charity or relief effort.</p>
          </md-board>
        
          <md-board>
            <p>To create a Donatti (or Don) choose 'Create' from the menu and fill in your parameters.</p>
          </md-board>
        
          <md-board>
            <p>A new Don with it's own address will be created on the Ethereum blockchain
              and behave according to your parameters</p>
          </md-board>
          
          <md-board>
            <p>You can embed your Don on any website and display any of your parameters.
              Several guides are available in the 'How To Use' sections</p>
          </md-board>
          
          <md-board>
            <p>You can always edit and administer your Don from this website or
              directly using a service like My Ether Wallet.</p>
          </md-board>
        </md-boards>
      </div>
      
    </md-layout>
  `
};