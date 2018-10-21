const Scores = Vue.component('scoreboard', {
  template: '#scoreboard-template',
  data () {
    return {
      items: [
        {
          action: '60%',
          title: 'Ravenda'
        },
        {
          action: '79%',
          title: 'Ravenda1'
        },
        {
          action: '91%',
          title: 'Ravenda2'
        },
        {
          action: '49%',
          title: 'Ravenda3'
        },
        {
          action: '87%',
          title: 'Ravenda4'
        }
      ]
    }
  },
  methods: {
    getOrdinalNumber (i) {
      let j = i % 10;
      let k = i % 100;
      if (j == 1 && k != 11) {
          return i + 'st';
      }
      if (j == 2 && k != 12) {
          return i + 'nd';
      }
      if (j == 3 && k != 13) {
          return i + 'rd';
      }
      return i + 'th';
    }
  }
});