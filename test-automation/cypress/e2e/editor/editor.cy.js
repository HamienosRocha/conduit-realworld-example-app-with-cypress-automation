import editor from ".";
import home from "../home";
import login from "../login";
import { faker } from "@faker-js/faker";

const credentials = Cypress.env("default_auth");

describe('Manage Articles - Version with Page Objects', () => {
  beforeEach(() => {
    home.accessHomePage();
    home.accessLoginPage();
    login.validateLoginPage();

    login.loginWithCredentials(credentials.email, credentials.password);
    home.accessNewArticlePage();
  });

  it('create article with success using tag', () => {
    cy.intercept('POST', '/api/articles').as('postArticle');

    const body = {
      title: faker.lorem.sentence(2),
      description: faker.lorem.sentence(5),
      text: faker.lorem.paragraph(),
      tag: faker.lorem.word()
    };

    editor.fillNewArticleForm(body);

    editor.publishArticle().then(() => {
      cy.wait('@postArticle').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
      });

      cy.get('@articleTitle').then(() => {
        cy.url().should('include', '/article/');
        cy.contains(body.title);
        cy.contains(body.tag);
      });
    });
  });
});

describe('Manage Articles - Version with custom commands', () => {
  beforeEach(() => {
    cy.visit('#/login');
    cy.loginUI(credentials.email, credentials.password);
    cy.visit('#/editor');
  });

  it('create article with success with tag', () => {
    cy.genererateArticle().then(body => {
      cy.intercept('POST', '/api/articles').as('postArticle');
      cy.intercept('GET', '/api/articles/**').as('getArticle');

      cy.fillArticle(body);

      cy.publishArticle().then(() => {
        cy.wait('@postArticle').its('response.statusCode').should('eq', 201);
        cy.wait('@getArticle').its('response.statusCode').should('eq', 200);

        cy.url().should('include', '/article/');
        cy.contains(body.title);
        cy.contains(body.tag);
      });
    });
  });
});

describe('Manage Articles - Version with custom commands and login via API', () => {
  beforeEach(() => {
    cy.loginAPI(credentials.email, credentials.password);
    cy.visit('#/editor');
  });

  it('create article with success with tag', () => {
    cy.genererateArticle().then(body => {
      cy.intercept('POST', '/api/articles').as('postArticle');
      cy.intercept('GET', '/api/articles/**').as('getArticle');

      cy.fillArticle(body);

      cy.publishArticle().then(() => {
        cy.wait('@postArticle').its('response.statusCode').should('eq', 201);
        cy.wait('@getArticle').its('response.statusCode').should('eq', 200);

        cy.url().should('include', '/article/');
        cy.contains(body.title);
        cy.contains(body.tag);
      });
    });
  });

  it('Delete article posted by user', () => {
    const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser') || '{}');
    cy.createArticleAPI().then(article => {
      cy.postArticleAPI(article, loggedUser);
    });

    cy.accessProfile();
    cy.accessRecentArticle();

    cy.intercept('DELETE', 'api/articles/**').as('deleteArticle');

    cy.contains('Delete Article').click().then(() => {
      cy.wait('@deleteArticle').then(response => {
        expect(response.response.statusCode).to.be.eq(200);
      });
    });
  });
});