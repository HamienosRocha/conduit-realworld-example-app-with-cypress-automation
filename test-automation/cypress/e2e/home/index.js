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

  accessRegisterPage() {
    return cy.get(elements.registerButton)
      .should('have.attr', 'href', '#/register')
      .click();
  }

  accessNewArticlePage() {
    return cy.get(elements.newArticleButton)
      .should('have.attr', 'href', '#/editor')
      .click();

  }
}

export default new Home();