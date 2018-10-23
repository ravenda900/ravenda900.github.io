const router = new VueRouter({
  routes
});

new Vue({
  router,
  data: {
    drawer: null,
    items: [
      { icon: 'home', text: 'Home', path: '/' },
      // { divider: true },
      // { icon: 'assignment', text: 'Mechanics', path: 'mechanics' },
      { icon: 'redeem', text: 'Rewards', path: 'rewards' },
      { divider: true },
      // { icon: 'help', text: 'Add Question', path: 'add-question' },
      { icon: 'list', text: 'Scores', path: 'scores' }
    ]
  },
  props: {
    source: String
  },
  methods: {
  }
}).$mount('#app');