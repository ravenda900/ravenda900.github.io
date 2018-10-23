const Scores = Vue.component('scoreboard', {
  template: '#scoreboard-template',
  data () {
    return {
      items: [],
      totalQuestions: 20,
      totalTime: 20,
      points: 10
    }
  },
  computed: {
    sortedItems () {
      return this.items.sort((a, b) => a.totalScore - b.totalScore).reverse();
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
  },
  mounted () {
    let scoresRef = firebase.database().ref('Scores').orderByChild('totalScore');

    scoresRef.on('value', (snapshot) => {
      this.items = [];
      const scores = snapshot.val();
      const uids = Object.keys(scores);
      for (let i = 0 ; i < uids.length ; i++) {
        this.items.push(scores[uids[i]]);
      }
    });
  }
});