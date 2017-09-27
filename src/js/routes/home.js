

export default {
  
  created() {
    this.$root.title = 'Donatti';
  },
  
  template: `
    <div class="page">
      <md-layout md-align="center" :md-gutter="true">
        <md-layout md-flex="35" md-flex-xsmall="80" md-align="center">
            
          <h2>Vue JS Boilerplate</h2>
          
          <p>Testing Home Route</p>
        
        </md-layout>
      </md-layout>
    </div>
  `
};