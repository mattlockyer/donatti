

export default {

  data() {
    return {
      dons: [],
      test: true,
      loaded: false
    };
  },

  created() {
    this.$root.title = 'My Dons';
  },
  
  mounted() {
    this.$root.showLoader();
    APP.getDons(() => {
      this.dons = APP.donList;
      this.$forceUpdate();
      this.loaded = true;
      this.$root.hideLoader();
    });
  },

  methods: {

  },

  template: `
    <div class="page">
      <md-layout md-align="center" :md-gutter="true">
        <md-layout md-flex="80" md-align="center">
        
          
          <div v-if="dons.length > 0">
            
            <md-table>
              <md-table-header>
                <md-table-row>
                  <md-table-head>Name</md-table-head>
                  <md-table-head>ID</md-table-head>
                  <md-table-head>Raised</md-table-head>
                  <md-table-head>Goal</md-table-head>
                  <md-table-head>Start</md-table-head>
                  <md-table-head>End</md-table-head>
                  <md-table-head></md-table-head>
                </md-table-row>
              </md-table-header>
            
              <md-table-body>
                <md-table-row v-for="id in APP.donList">
                  <md-table-cell>
                    <router-link :to="'/don/' + id">{{ APP.donParamsObj[id].name }}</router-link>
                  </md-table-cell>
                  <md-table-cell>{{ id }}</md-table-cell>
                  <md-table-cell>{{ APP.donCollected[id] }}</md-table-cell>
                  <md-table-cell>{{ APP.donParamsObj[id].goal }}</md-table-cell>
                  <md-table-cell>{{ APP.donParamsObj[id].start }}</md-table-cell>
                  <md-table-cell>{{ APP.donParamsObj[id].end }}</md-table-cell>
                  <md-table-cell>
                    <router-link :to="'/edit/' + id">Edit</router-link>
                  </md-table-cell>
                </md-table-row>
              </md-table-body>
            </md-table>
          </div>
          
          
          <div v-else-if="loaded">
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