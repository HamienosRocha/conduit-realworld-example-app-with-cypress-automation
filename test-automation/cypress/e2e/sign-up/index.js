import { ELEMENTS } from './elements';
import { faker } from '@faker-js/faker';

class SignUp {
  generateFixtureUsers(usersQuantity) {
    const arrayCredentials = [];
    const arrayResponses = [];

    Cypress._.times(usersQuantity, () => {
      cy.request({
        method: 'POST',
        url: 'api/users',
        body: {
          user: {
            username: faker.internet.username(),
            email: faker.internet.email(),
            password: faker.internet.password()
          }
        }
      })
        .then(response => {
          arrayCredentials.push(JSON.parse(response.requestBody));
          arrayResponses.push(response.body);
        });

    });
    cy.writeFile('cypress/fixtures/users-credentials.json', arrayCredentials);
    cy.writeFile('cypress/fixtures/users-registered.json', arrayResponses);
  }

  fillRegisterForm(name, email, password) {
    cy.get(ELEMENTS.nameInput)
      .type(name)
      .should('have.attr', 'required');

    cy.get(ELEMENTS.emailInput)
      .type(email)
      .should('have.attr', 'type', 'email')
      .and('have.attr', 'required');
    //.get(ELEMENTS.emailInput)

    cy.get(ELEMENTS.passwordInput)
      .type(password)
      .should('have.attr', 'required')
      .get(ELEMENTS.passwordInput)
      .should('have.attr', 'type', 'password');
  }

  submitRegisterForm() {
    return cy.get(ELEMENTS.btnSubmit).click();
  }
}

export default new SignUp();