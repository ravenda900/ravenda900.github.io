const Questions = Vue.component('questions', {
  template: '#questions-template',
  data () {
    return {
      questions: [],
      answer: null,
      timer: null,
      totalTime: 20,
      currentIndex: 0,
      totalQuestions: 20,
      isDataLoaded: false,
      interval: null,
      score: 0,
      points: 10
    }
  },
  methods: {
    shuffleQuestions (questions) {
      const uids = Object.keys(questions);

      for (let i = 0 ; i < this.totalQuestions ; i++) {
        let index = uids[Math.floor(Math.random() * uids.length)];
        this.questions.push(questions[index]);
        uids.splice(index, 1);
      }
    },
    startTimer () {
      this.timer = this.totalTime;
      this.interval = setInterval(() => {

        if (--this.timer < 0) {
          this.timer = this.totalTime;
          ++this.currentIndex;
          this.clearAnswer();
          if (this.currentIndex + 1 === this.totalQuestions) {
            clearInterval(this.interval);
            this.$router.push({ path: 'scores' });
          }
        }
      }, 1000);
    },
    setAnswer (choice) {
      this.answer = choice;
      this.addPointsToScore();
    },
    skipQuestion () {
      clearInterval(this.interval);
      this.clearAnswer();
      ++this.currentIndex;
      this.startTimer();
    },
    addPointsToScore () {
      if (this.currentQuestion.answer === this.answer) {
        this.score += this.timer * this.points;
      }
    },
    clearAnswer () {
      this.answer = null;
    },
    submitScore () {
      const firebaseRef = firebase.database().ref();
      const scoresRef = firebaseRef.child('Scores').push();
    }
  },
  computed: {
    currentQuestion () {
      return this.questions[this.currentIndex];
    }
  },
  mounted () {
    let questionsRef = firebase.database().ref('Questions');

    questionsRef.on('value', (snapshot) => {
      this.shuffleQuestions(snapshot.val());
      this.isDataLoaded = true;
      this.startTimer();
    });
  }
});