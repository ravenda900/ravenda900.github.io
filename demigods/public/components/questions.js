const Questions = Vue.component('questions', {
  template: '#questions-template',
  data () {
    return {
      questions: [],
      questionIndices: [],
      answer: null,
      timer: null,
      currentIndex: 0,
      totalTime: 20,
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
        let index = Math.floor(Math.random() * uids.length);
        let key = uids[index];
        this.questionIndices.push(index);
        this.questions.push(questions[key]);
        uids.splice(index, 1);
      }

      if (localStorage.getItem('questionIndices') === null) {
        localStorage.setItem('questionIndices', this.questionIndices.join(', '));
      }
    },
    getCurrentQuestions (questions) {
      const uids = Object.keys(questions);

      for (let i = 0 ; i < this.questionIndices.length ; i++) {
        let key = uids[this.questionIndices[i]];
        this.questions.push(questions[key]);
        uids.splice(this.questionIndices[i], 1);
      }
    },
    startTimer () {
      this.setRemainingTime();
      this.interval = setInterval(() => {
        --this.timer;
        localStorage.setItem('remainingTime', this.timer);
        if (this.timer < 0) {
          if (this.currentIndex + 1=== this.totalQuestions) {
            this.timer = null;
            clearInterval(this.interval);
          } else {
            this.timer = this.totalTime;
            localStorage.setItem('remainingTime', this.timer);
            ++this.currentIndex;
            localStorage.setItem('currentIndex', this.currentIndex);
            this.answer = null;
          }
        }
      }, 1000);
    },
    setAnswer (choice) {
      this.answer = choice;
      this.addPointsToScore();
      if (this.currentIndex + 1 === this.totalQuestions) {
        clearInterval(this.interval);
        this.timer = null;
      }
    },
    skipQuestion () {
      clearInterval(this.interval);
      this.answer = null;
      ++this.currentIndex;
      localStorage.setItem('currentIndex', this.currentIndex);
      localStorage.removeItem('remainingTime');
      this.startTimer();
    },
    addPointsToScore () {
      if (this.currentQuestion.answer.trim().toLowerCase() === this.answer.trim().toLowerCase()) {
        this.score += this.timer * this.points;
        localStorage.setItem('currentScore', this.score);
      }
    },
    submitScore () {
      const firebaseRef = firebase.database().ref();
      const scoresRef = firebaseRef.child('Scores').push();
      const ign = localStorage.getItem('ign');
      const totalScore = this.score;
      const percentage = (this.score / (this.totalQuestions * this.totalTime * this.points) * 100).toFixed(2);

      clearInterval(this.interval);
      this.$router.push({ path: 'scores' });
      scoresRef.set({
        ign: ign,
        totalScore: totalScore,
        date: firebase.database.ServerValue.TIMESTAMP
      }, (error) => {
        if (error) {
          console.error('Error', error);
        } else {
          this.reset();
        }
      });
    },
    reset () {
      this.answer = null;
      this.questions = [];
      this.questionIndices = [];
      this.score = 0;
      this.currentIndex = 0;

      localStorage.removeItem('questionIndices');
      localStorage.removeItem('currentScore');
      localStorage.removeItem('currentIndex');
      localStorage.removeItem('remainingTime');
      localStorage.removeItem('ign');
    },
    setQuestionIndices () {
      if (localStorage.getItem('questionIndices') !== null) {
        this.questionIndices = localStorage.getItem('questionIndices').split(', ').map(questionIndex => parseInt(questionIndex));
      }
    },
    setCurrentScore () {
      if (localStorage.getItem('currentScore') === null) {
        localStorage.setItem('currentScore', this.score);
      } else {
        this.score = parseInt(localStorage.getItem('currentScore'));
      }
    },
    setCurrentIndex () {
      if (localStorage.getItem('currentIndex') === null) {
        localStorage.setItem('currentIndex', this.currentIndex);
      } else {
        this.currentIndex = parseInt(localStorage.getItem('currentIndex'));
      }
    },
    setRemainingTime () {
      if (localStorage.getItem('remainingTime') !== null) {
        this.timer = parseInt(localStorage.getItem('remainingTime'));
      } else {
        this.timer = this.totalTime;
      }
    }
  },
  computed: {
    currentQuestion () {
      return this.questions[this.currentIndex];
    },
    shuffledChoices () {
      const choices = this.currentQuestion.choices.split(', ');

      let ctr = choices.length, temp, index;

      while (ctr > 0) {
        index = Math.floor(Math.random() * ctr);
        ctr--;
        temp = choices[ctr];
        choices[ctr] = choices[index];
        choices[index] = temp;
      }

      return choices;
    }
  },
  destroyed () {
    this.reset();
    clearInterval(this.interval);
  },
  mounted () {
    let questionsRef = firebase.database().ref('GameQuestions');
    this.setCurrentIndex();
    this.setCurrentScore();
    this.setQuestionIndices();

    questionsRef.on('value', (snapshot) => {
      if (snapshot.val() !== null) {
        if (this.questionIndices.length === 0) {
          this.shuffleQuestions(snapshot.val());
        } else {
          this.getCurrentQuestions(snapshot.val());
        }
        this.startTimer();
      }
      this.isDataLoaded = true;
    });
  }
});