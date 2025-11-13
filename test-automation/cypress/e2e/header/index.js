// const elments = require('./elements').ELEMENTS;
import { ELEMENTS } from './elements';

class Header {
  onpenLogedProfileMenu() {
    return cy.get(ELEMENTS.profileIcon).click();
  }
}

export default new Header();