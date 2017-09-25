export default {

  data() {
    return {
      dons: [],
      test: true
    };
  },

  created() {
    APP.updateDons(() => {
      this.dons = APP.donList;
      this.$forceUpdate();
      console.log('updated', this.dons.length);
    });
  },

  methods: {

  },

  template: `
    <div class="page">
      <md-layout md-align="center" :md-gutter="true">
        <md-layout md-flex="80" md-align="center">
        
          
          <div v-if="dons.length > 0">
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
          </div>
          
          
          <div v-else>
            <p>You currently have no Dons, try creating a Don by clicking below</p>
            <md-layout md-align="center">
              <router-link to="/create"><md-button class="md-raised">Create</md-button></router-link>
            </md-layout>
          </div>
          
        
        </md-layout>
      </md-layout>
    </div>
  `
};