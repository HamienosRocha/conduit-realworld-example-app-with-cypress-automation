require('dotenv').config();

module.exports = {
  projectId: 'jigrjw',
  e2e: {
    baseUrl: 'https://conduit-realworld-example-app.fly.dev',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      config.env = {
        default_auth: {
          email: process.env.CYPRESS_DEFAULT_AUTH_EMAIL,
          password: process.env.CYPRESS_DEFAULT_AUTH_PASSWORD,
          name: process.env.CYPRESS_DEFAULT_AUTH_NAME,
        }
      };

      return config;
    },
  },
};
