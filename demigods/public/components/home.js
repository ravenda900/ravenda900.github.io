const Home = Vue.component('home', {
  template: '#home-template',
  data: () => ({
    valid: true,
    rules: {
      required: value => !!value || 'Required.',
      counter: value => value.length <= 20 || 'Max 20 characters',
    },
    ign: ''
  }),
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        let firebaseRef = firebase.database().ref();
        let ignsRef = firebaseRef.child('IGNs').push();
        ignsRef.set({
          ign: this.ign,
          date: firebase.database.ServerValue.TIMESTAMP
        }, (error) => {
          if (error) {
            console.error('Error', error);
          } else {
            this.$router.push({ path: 'instructions' });
          }
        });
      }
    },
    clear () {
      this.ign = '';
    }
  }
});