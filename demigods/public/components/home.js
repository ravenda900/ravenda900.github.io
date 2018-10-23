const Home = Vue.component('home', {
  template: '#home-template',
  data: () => ({
    valid: true,
    rules: {
      required: value => !!value || 'Required.',
      counter: value => value.length <= 25 || 'Max 25 characters',
    },
    ign: '',
    quote: null,
    isDataLoaded: false
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
  },
  mounted () {
    axios.get('https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1')
      .then((response) => {
        this.quote = response.data[0];
        this.isDataLoaded = true;
      });
  },
  destroyed () {
    this.quote = null;
  }
});