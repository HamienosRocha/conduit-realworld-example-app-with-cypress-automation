import login from ".";
import home from "../home";
import register from "../sign-up";
import { ELEMENTS } from "./elements";

const validCredentials = Cypress.env('default_auth');

describe('Login feature using Page Object Model', () => {
  before(() => {
    register.generateFixtureUsers(5);
  });

  beforeEach(() => {
    home.accessHomePage();
  });

  it('sign in with invalid credentials', () => {
    home.accessLoginPage();
    login.validateLoginPage();

    cy.interceptLogin().as('postLogin');

    login.loginWithCredentials('email@wrong', 'invalid_pass');

    cy.wait('@postLogin').its('response.statusCode').should('be.eq', 404);
    cy.contains(ELEMENTS.stringEmailNotFound);
  });

  it('sign in with valid credentials', () => {
    home.accessLoginPage();
    login.validateLoginPage();

    cy.interceptLogin().as('postLogin');
    cy.intercept('GET', '/api/user').as('getUser');

    login.loginWithCredentials(validCredentials.email, validCredentials.password);

    cy.wait('@postLogin').its('response.statusCode').should('be.eq', 200);

    cy.wait('@getUser').then(({ response }) => {
      expect(response).not.to.be.eq(null).and.not.to.be.eq(undefined);
      expect(response).to.have.property('statusCode').and.to.be.eq(200);

      expect(response).to.have.property('body').and.to.be.an('object');
      expect(response.body).to.have.property('user').and.to.be.an('object');
      expect(response.body.user).to.have.property('email').and.to.be.eq(validCredentials.email);
    });
  });

  it('logout', () => {
    home.accessLoginPage();
    login.validateLoginPage();

    login.loginWithCredentials(validCredentials.email, validCredentials.password);
    login.logout();
  });

  it('login with valid credentials from multiple users', () => {
    cy.intercept('POST', 'api/users/login').as('postLogin');
    cy.intercept('GET', 'api/users').as('getUser');

    cy.fixture('users-credentials.json').then(credentialFixture => {
      credentialFixture.forEach(credential => {
        // cy.wait('@postLogin')

        home.accessLoginPage();
        login.validateLoginPage();

        cy.interceptLogin().as('postLogin');
        cy.intercept('GET', '/api/user').as('getUser');

        login.loginWithCredentials(credential.user.email, credential.user.password);
        cy.wait('@postLogin').its('response.statusCode').should('eq', 200);

        cy.wait('@getUser').then(({ response }) => {
          expect(response).not.to.be.eq(null).and.not.to.be.eq(undefined);
          expect(response).to.have.property('statusCode').and.to.be.eq(200);

          expect(response).to.have.property('body').and.to.be.an('object');
          expect(response.body).to.have.property('user').and.to.be.an('object');
          // expect(response.body.user).to.have.property('email').and.to.be.eq(credential.user.email);
        });

        login.logout();
      });
    });
  });
});