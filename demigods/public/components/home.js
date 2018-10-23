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
        localStorage.setItem('ign', this.ign);
        this.$router.push({ path: 'mechanics' })
      }
    },
    clear () {
      this.ign = '';
    }
  }
});