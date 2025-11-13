module.exports = {
  e2e: {
    baseUrl: 'https://conduit-realworld-example-app.fly.dev',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    default_name: 'test',
    default_auth: {
      email: 'email@email.com',
      password: '123456'
    }
  }
};
