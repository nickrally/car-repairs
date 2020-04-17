import { Selector, t } from 'testcafe';

class SearchComponent {
    constructor() {
      this.fieldInput    = Selector('#field');
      this.operatorInput = Selector('#operator');
      this.valueInput    = Selector('#value');
      this.searchButton  = Selector('#search-btn');
    }
    search = (field, operator, value) => {
      return t
        .click(this.fieldInput)
        .pressKey('ctrl+a delete')
        .typeText(this.fieldInput, field)
        .click(this.operatorInput)
        .pressKey('ctrl+a delete')
        .typeText(this.operatorInput, operator)
        .click(this.valueInput)
        .pressKey('ctrl+a delete')
        .typeText(this.valueInput, value)
        .click(this.searchButton);
    }
}

export default new SearchComponent();