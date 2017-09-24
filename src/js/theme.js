

export default {
  init() {
    Vue.material.registerTheme('default', {
      primary: 'white',
      accent: 'blue',
      warn: 'orange',
      background: 'white'
    });
  
    Vue.material.registerTheme('second', {
      primary: 'blue',
      accent: 'blue',
      warn: 'orange',
      background: 'white'
    });
  }
};