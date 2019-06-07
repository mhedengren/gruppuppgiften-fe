import chromedriver from 'chromedriver';
import { Builder, until, By } from 'selenium-webdriver';
import server from '../../app';

let listeningServer;
let driver;

const PORT = 8081;
const baseUrl = `localhost:${PORT}/`;
const timeout = 1000;

const waitUntilLoaded = (element) => {
  return driver.wait(element.getAttribute('data-loaded'))
    .then((loaded) => {
      if (loaded === 'true') {
        return element;
      }
      return false;
    });
};

describe('html tests', () => {
  beforeAll((done) => {
    listeningServer = server.listen(PORT);

    driver = new Builder().forBrowser('chrome').build();
    driver.get(baseUrl)
      .then(done);
  });

  afterAll((done) => {
    listeningServer.close();
    driver.quit()
      .then(done);
  });

  test('smoke test', (done) => {
    // Find an element that is available in the static html of the page
    driver.wait(until.elementLocated(By.id('animal-listing')), timeout)
      .then((element) => element.getAttribute('id'))
      // Get its id and check that it is identical to the id we started with
      // (yes, it's a pretty stupid test - it just validates that the server and
      // selenium are working)
      .then((id) => {
        expect(id).toBe('animal-listing');
        done();
      });
  });

  test('populate select', (done) => {
    // First find the select-tag and open it
    driver.wait(until.elementLocated(By.id('animal-select')), timeout)
      .then((select) => {
        driver.wait(until.elementIsVisible(select));
        select.click();
        return select;
      })
      // List the options and simulate a click on the second item
      .then((select) => select.findElements(By.tagName('option')))
      .then((options) => {
        driver.wait(until.elementIsVisible(options[1]));
        options[1].click();
      })
      // Wait for the animal description to update
      .then(() => driver.wait(until.elementLocated(By.id('animal-description')), timeout))
      .then(waitUntilLoaded)
      // Get the animal description text and validate it
      .then((description) => description.getText())
      .then((text) => {
        expect(text.length).toBeGreaterThan(0);
        done();
      });
  });
  test('select radio button', (done) => {
    // First find the radio-button and select it
    driver.wait(until.elementLocated(By.id('dog')), timeout)
      .then((select) => {
        driver.wait(until.elementIsVisible(select));
        select.click();
        return select;
      })

      // Wait for the animal description to update
      .then(() => driver.wait(until.elementLocated(By.id('animal-select')), timeout))
      .then(waitUntilLoaded)
      // Get the animal description text and validate it
      .then((select) => select.findElements(By.tagName('option')))
      .then((options) => options[0].getText())
      .then((text) => {
        expect(text).toBe('Select dog');
        done();
      });
  });

  test('upload animal', (done) => {
    // Find the animal input field and fill it with animal data
    driver.wait(until.elementLocated(By.id('animal-to-add')), timeout)
      .then((textarea) => {   
        textarea.sendKeys('\t');
        textarea.clear();
        textarea.sendKeys('{"name":"test"}');
      })
      // Find the submit button and simulate a click
      .then(() => driver.wait(until.elementLocated(By.id('animal-add')), timeout))
      .then((button) => {
        button.click();
        return button;
      })
      // Wait until the load (post) on the button has finished
      .then(waitUntilLoaded)
      // Find the select and wait until it has updated
      .then(() => driver.wait(until.elementLocated(By.id('animal-select')), timeout))
      .then(waitUntilLoaded)
      // List the options and get the last one (hopefully the one we just added)
      .then((select) => {
        return select.findElements(By.tagName('option'));
      })
      .then((options) => {
        return options.pop();
      })
      // Validate that the text is the one we entered as a name
      .then((lastOption) => {
        return lastOption.getText();
      })
      .then((text) => {
        expect(text).toBe('test');
        done();
      });
  });
});
