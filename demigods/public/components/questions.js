const Questions = Vue.component('questions', {
  template: '#questions-template',
  data () {
    return {
      questions: [],
      answers: [],
      timer: 20,
      currentIndex: 0,
      totalQuestions: 20,
      isDataLoaded: false
    }
  },
  methods: {
    shuffleQuestions (questions) {
      const uids = Object.keys(questions);

      for (let i = 0 ; i < this.totalQuestions ; i++) {
        let index = uids[Math.floor(Math.random() * uids.length)];
        uids.splice(index, 1);
        this.questions.push(questions[index]);
      }
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
    });
  }
});