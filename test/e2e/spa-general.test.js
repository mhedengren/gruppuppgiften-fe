import express from 'express';
import path from 'path';
import chromedriver from 'chromedriver';
import { Builder, until, By } from 'selenium-webdriver';

let listeningServer;
let driver;

const PORT = 8081;
const baseUrl = `localhost:${PORT}/`;
const timeout = 2000;

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
});
