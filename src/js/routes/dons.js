

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
    this.$root.showLoader(true);
    if (!APP.userDonsLoaded) this.$root.snack('Loading your Dons');
    APP.getDons(() => {
      this.dons = APP.donList;
      this.loaded = true;
      this.$root.hideLoader(true);
      this.$forceUpdate();
    });
  },

  methods: {

  },

  template: `
      
      <div v-if="dons.length > 0" class="width-100">
        <md-card v-for="id in dons">
        
          <md-card-header>
            <div class="md-title">{{ APP.donParamsObj[id].name }}</div>
          </md-card-header>
        
          <md-card-content>
            <md-list>
              <md-list-item>
                {{ APP.donCollected[id] }}
              </md-list-item>
              <md-list-item>
                  <md-icon>whatshot</md-icon>
                  <span>Details</span>
                  <md-list-expand>
                  <md-list>
                      <md-list-item class="md-inset">Goal: {{ APP.donParamsObj[id].goal }}</md-list-item>
                      <md-list-item class="md-inset">Start: {{ APP.donParamsObj[id].start }}</md-list-item>
                      <md-list-item class="md-inset">End: {{ APP.donParamsObj[id].end }}</md-list-item>
                  </md-list>
                  </md-list-expand>
              </md-list-item>
            </md-list>
          </md-card-content>
          
          <md-card-actions>
            <router-link :to="'/don/' + id" class="margin-right-8"><md-button class="md-raised">View</md-button></router-link>
            <router-link :to="'/edit/' + id"><md-button class="md-raised">Edit</md-button></router-link>
          </md-card-actions>
        
        </md-card>
      </div>
      
      
      <div v-else-if="loaded">
        <p>You currently have no Dons, try creating a Don by clicking below</p>
        <md-layout md-align="center">
          <router-link to="/create"><md-button class="md-raised">Create</md-button></router-link>
        </md-layout>
      </div>
  `
};