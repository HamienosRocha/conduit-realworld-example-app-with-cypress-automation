import signUp from ".";
import home from "../home";
import { faker } from '@faker-js/faker';
import login from "../login";

const credentials = Cypress.env('default_auth');

describe.only('Sign Up Feature', () => {
  beforeEach(() => {
    home.accessHomePage();
  });

  it('System should not permit to resgister user that already exist', () => {
    home.accessRegisterPage().then(() => {
      cy.url().should('include', 'register');
    });

    cy.intercept('POST', '/api/users').as('postUser');

    signUp.fillRegisterForm(credentials.name, credentials.email, credentials.password);

    signUp.submitRegisterForm().then(() => {
      cy.wait('@postUser').then(({ response }) => {
        expect(response.statusCode).eq(422);
      });
    });
  });

  // the method '_.times' can be used inside 'it(...)'
  Cypress._.times(3, () => {
    it('Register a new user', () => {
      home.accessRegisterPage().then(() => {
        cy.url().should('include', 'register');

        cy.intercept('POST', '/api/users').as('postUser');

        signUp.fillRegisterForm(
          faker.person.fullName(),
          faker.internet.email(),
          faker.internet.password()
        );

        signUp.submitRegisterForm().then(() => {
          cy.wait('@postUser').its('response.statusCode').should('eq', 201);
        });
      });

      login.logout();
    });
  });
});