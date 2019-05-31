const {clearElement} = require('../../src/js/animalApp');

const fakeElement = {
  firstChild: true,
  removeChild(){
    delete this.firstChild;
    this._removeChild();
  },
  _removeChild: jest.fn()
};
describe('unit test clear element', ()=>{
  test('clear element', ()=> {
    clearElement(fakeElement);
    expect(fakeElement._removeChild).toHaveBeenCalledTimes(1);
  });
});