const AddQuestion = Vue.component('add-question', {
  template: '#add-question-template',
  data () {
    return {
      valid: true,
      question: '',
      questionRules: [
        v => !!v || 'Question is required',
        v => (v && v.length <= 100) || 'Question must be less than 100 characters'
      ],
      answer: '',
      answerRules: [
        v => !!v || 'Answer is required',
        v => (v && v.length <= 50) || 'Answer must be less than 50 characters'
      ],
      choices: [],
      choicesRules: [
          v => !!v || 'Choices is required',
          v => (v && v.length === 4) || 'Choices must have 4 values'
      ],
      search: null,
      isDataLoaded: false,
      totalQuestions: 0
    }
  },
  watch: {
    choices (val) {
      if (val.length > 4) {
        this.$nextTick(() => this.model.pop())
      }
    }
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        const firebaseRef = firebase.database().ref();
        const questionsRef = firebaseRef.child('GameQuestions').push();
        questionsRef.set({
          question: this.question,
          answer: this.answer,
          choices: this.choices.join(', '),
          date: firebase.database.ServerValue.TIMESTAMP
        }, (error) => {
          if (error) {
            console.error('Error', error);
          } else {
            this.clear()
          }
        });
      }
    },
    clear () {
      this.$refs.form.reset();
    }
  },
  mounted () {
    const questionsRef = firebase.database().ref('GameQuestions');

    questionsRef.on('value', (snapshot) => {
      if (snapshot.val() !== null) {
        let keys = Object.keys(snapshot.val());
        this.totalQuestions = keys.length
      }
      this.isDataLoaded = true;
    });
  }
});