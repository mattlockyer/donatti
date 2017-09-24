


export default {
  
  data() {
    return {
      dons:[]
    };
  },
  
  created() {
    APP.updateDons(() => {
      console.log(this.dons);
      
      this.dons = APP.donList;
      
      console.log(this.dons);
      
      this.$forceUpdate();
    });
  },
  
  methods: {
    
  },
  
  template: `
    <div class="page">
      <md-layout md-align="center" :md-gutter="true">
        <md-layout md-flex="80" md-align="center">
            
          <h2>Create a Donatti</h2>
          
          <md-table>
            <md-table-header>
              <md-table-row>
                <md-table-head>Name</md-table-head>
                <md-table-head>Address</md-table-head>
                <md-table-head></md-table-head>
              </md-table-row>
            </md-table-header>
          
            <md-table-body>
              <md-table-row v-for="don in APP.donList">
                <md-table-cell>{{ don.name }}</md-table-cell>
                <md-table-cell>{{ don.addr }}</md-table-cell>
                <md-table-cell>
                  <router-link :to="'/don/' + don.addr">Open</router-link>
                </md-table-cell>
              </md-table-row>
            </md-table-body>
          </md-table>
        
        </md-layout>
      </md-layout>
    </div>
  `
};