const router = new VueRouter({
  routes
});

new Vue({
  router,
  data: {
    drawer: null,
    items: [
      { icon: 'home', text: 'Home', path: '/' },
      { icon: 'assignment', text: 'Mechanics', path: 'mechanics' },
      { icon: 'list', text: 'Scores', path: 'scores' },
      { divider: true },
      { icon: 'help', text: 'Add Question', path: 'add-question' }
    ]
  },
  props: {
    source: String
  },
  methods: {
  }
}).$mount('#app');