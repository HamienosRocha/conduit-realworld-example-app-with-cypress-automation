require('dotenv').config();

module.exports = {
  projectId: 'jigrjw',
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'conduit-automation-tests',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    baseUrl: 'https://conduit-realworld-example-app.fly.dev',
    video: true,
    setupNodeEvents(on, config) {

      require('cypress-mochawesome-reporter/plugin')(on);

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
