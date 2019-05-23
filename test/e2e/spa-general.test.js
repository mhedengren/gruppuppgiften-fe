import express from 'express';
import path from 'path';
import chromedriver from 'chromedriver';
import { Builder, until, By } from 'selenium-webdriver';

let listeningServer;
let driver;

const PORT = 8081;
const baseUrl = `localhost:${PORT}/`;
const timeout = 500;

describe('html tests', () => {
  beforeAll((done) => {
    const server = express();
    server.use('/', express.static(path.join(__dirname, '../../src/')));
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
    driver.wait(until.elementLocated(By.id('animal-listing')), timeout)
      .then((element) => element.getAttribute('id'))
      .then((id) => {
        expect(id).toBe('animal-listing');
        done();
      });
  });

  test('populate select', (done) => {
    driver.wait(until.elementLocated(By.id('animal-select')), timeout)
      .then((select) => driver.wait(until.elementIsVisible(select)))
      .then((select) => {
        select.click();
        return select;
      })
      .then((select) => select.findElements(By.tagName('option')))
      .then((options) => options[0])
      .then((option) => option.click())
      .then(() => driver.wait(until.elementLocated(By.id('animal-description')), timeout))
      .then((description) => driver.wait(until.elementIsVisible(description), timeout))
      .then((description) => description.getAttribute('data-loaded'))
      .then((dataLoaded) => {
        expect(dataLoaded).toBe('true');
        done();
      });
  });

  test('upload animal', (done) => {
    driver.wait(until.elementLocated(By.id('animal-to-add')), timeout)
      .then((textarea) => {
        textarea.sendKeys('\t');
        textarea.clear();
        textarea.sendKeys('{"name":"test"}');
      })
      .then(() => driver.wait(until.elementLocated(By.id('animal-add')), timeout))
      .then((button) => button.click())
      .then(() => driver.wait(until.elementLocated(By.id('animal-select')), timeout))
      .then((select) => select.findElements(By.tagName('option')))
      .then((options) => options.pop())
      .then((lastOption) => lastOption.getAttribute('data-name'))
      .then((dataName) => {
        expect(dataName).toBe('test');
        done();
      });
  });
});
