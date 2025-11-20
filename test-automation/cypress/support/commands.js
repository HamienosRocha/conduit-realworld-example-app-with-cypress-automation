import { ELEMENTS as loginElements } from '../e2e/login/elements';
import { ELEMENTS as editorElements } from '../e2e/editor/elements';
import { ELEMENTS as headerElements } from '../e2e/header/elements';
import { faker } from "@faker-js/faker";

Cypress.Commands.add('interceptLogin', () => {
  cy.intercept('POST', '/api/users/login');
});

Cypress.Commands.add('loginUI', (email, password) => {
  cy.get(loginElements.emailInput)
    .type(email)
    .should('have.attr', 'type', 'email')
    .and('have.attr', 'placeholder', 'Email')
    .and('have.prop', 'required');

  cy.get(loginElements.passwordInput)
    .type(password)
    .should('have.attr', 'type', 'password')
    .and('have.attr', 'placeholder', 'Password')
    .and('have.attr', 'required');

  cy.intercept('POST', 'api/users/login').as('postLogin');

  cy.get(loginElements.loginButton)
    .contains(loginElements.loginAccessLinkText)
    .click();

  cy.wait('@postLogin').its('response.statusCode').should('eq', 200);
});

Cypress.Commands.add('genererateArticle', () => {
  return {
    title: faker.lorem.sentence(2),
    description: faker.lorem.sentence(5),
    text: faker.lorem.paragraph(),
    tag: faker.lorem.word()
  };
});

Cypress.Commands.add('createArticleAPI', () => {
  return {
    body: faker.lorem.sentence(2),
    description: faker.lorem.sentence(5),
    title: faker.lorem.sentence(3),
    tagList: ''
  };
});

Cypress.Commands.add('fillArticle', (body) => {

  cy.get(editorElements.inputTitleArticle).type(body.title)
    .should('be.visible')
    .and('have.attr', 'required');

  cy.get(editorElements.inputDescriptionArticle).type(body.description)
    .should('be.visible')
    .and('have.attr', 'required');

  cy.get(editorElements.inputTextArticle).type(body.text)
    .should('be.visible')
    .and('have.attr', 'required');

  cy.get(editorElements.inputTagArticle).type(body.tag)
    .should('be.visible')
    .and('not.have.attr', 'required');
});

Cypress.Commands.add('publishArticle', () => {
  return cy.get(editorElements.btnPublish)
    .should('be.visible')
    .should('have.attr', 'type', 'submit')
    .click();
});

Cypress.Commands.add('loginAPI', (email, password) => {
  cy.session([email, password], () => {
    cy.request({
      method: 'POST',
      url: '/api/users/login',
      body: { user: { email, password } }
    }).then((response) => {
      expect(response.status).to.be.eq(200);

      const storage = {
        headers: {
          'Authorization': `Token ${response.body.user.token}`,
        },
        isAuth: true,
        loggedUser: response.body.user
      };

      window.localStorage.setItem('loggedUser', JSON.stringify(storage));
    });

  }).as('postLogin');
});

Cypress.Commands.add('postArticleAPI', (article, loggedUser) => {
  cy.request({
    method: 'POST',
    url: '/api/articles',
    headers: loggedUser.headers,
    body: { article }
  })
    .then(response => {
      expect(response.status).to.be.eq(201);
    })
    .as('article');
});

Cypress.Commands.add('accessProfile', () => {
  cy.get(headerElements.profileIcon).click().then(() => {
    cy.get(headerElements.profileMenu).children().eq(0).click();
  });
});

Cypress.Commands.add('accessRecentArticle', () => {
  cy.get('div.row').find('div.article-preview').eq(0).find('h1').click().then(() => {
    cy.get('@article').then((list) => {
      cy.contains(list.body.article.title);
    });
  });
});