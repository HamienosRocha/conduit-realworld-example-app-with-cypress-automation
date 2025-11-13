const elements = require('./elements').ELEMENTS;

class Home {
  accessHomePage() {
    cy.visit('/');
  }

  accessLoginPage() {
    cy.contains(elements.loginAccessLinkText)
      .should('have.attr', 'href', '#/login')
      .click();
  }
}

export default new Home();