import { ELEMENTS } from "./elements";

class Editor {
  fillNewArticleForm(body) {
    cy.get(ELEMENTS.inputTitleArticle).type(body.title).as('articleTitle');
    cy.get(ELEMENTS.inputDescriptionArticle).type(body.description);
    cy.get(ELEMENTS.inputTextArticle).type(body.text);
    cy.get(ELEMENTS.inputTagArticle).type(body.tag);
  }

  publishArticle() {
    return cy.get(ELEMENTS.btnPublish)
      .should('be.visible')
      .should('have.attr', 'type', 'submit')
      .click();
  }
}

export default new Editor();