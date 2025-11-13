const elements = require('./elements').ELEMENTS;
import { ELEMENTS as headerElements } from '../header/elements';
import header from '../header';

class Login {
  validateLoginPage() {
    cy.url('/login').then(() => {
      cy.contains('Sign in');
    });
  }

  loginWithCredentials(username, password) {
    cy.get(elements.emailInput)
      .type(username)
      .should('have.attr', 'type', 'email')
      .and('have.attr', 'placeholder', 'Email')
      .and('have.prop', 'required');

    cy.get(elements.passwordInput)
      .type(password)
      .should('have.attr', 'type', 'password')
      .and('have.attr', 'placeholder', 'Password')
      .and('have.attr', 'required');

    cy.get(elements.loginButton)
      .contains(elements.loginAccessLinkText)
      .click();
  }

  logout() {
    header.onpenLogedProfileMenu()
      .then(() => {
        cy.get(headerElements.profileMenu)
          .contains('Logout')
          .click();
      });
  }
}

export default new Login();