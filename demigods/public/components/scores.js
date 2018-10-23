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
    let db = firebase.database();
    let scoresList = firebase.database().ref('Scores').orderByChild('totalScore');

    scoresList.on('value', (snapshot) => {
      this.items = [];
      const scores = snapshot.val();
      if (scores !== null) {
        const uids = Object.keys(scores);
        for (let i = 0 ; i < uids.length ; i++) {
          let index = this.items.findIndex(item => item.ign === scores[uids[i]].ign);

          if ((scores[uids[i]].totalScore > (this.totalQuestions * this.totalTime * this.points)) || (typeof scores[uids[i]].ign === 'undefined')) {
            db.ref('Scores/' + uids[i]).remove();
          }

          if (index !== -1) {
            if (this.items[index].totalScore <= scores[uids[i]].totalScore) {
              db.ref('Scores/' + this.items[index].key + '/totalScore').set(scores[uids[i]].totalScore, (error) => {
                if (error) {
                  console.error('Error', error);
                } else {
                  db.ref('Scores/' + uids[i]).remove();
                }
              });
            }
            db.ref('Scores/' + uids[i]).remove();
          } else {
            let score = scores[uids[i]];
            score.key = uids[i];
            this.items.push(score);
          }
        }
      } else {
        this.items.push({
          message: 'No entries yet'
        });
      }
    });
  }
});