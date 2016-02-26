var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd;
try {
  wd = require('wd');
} catch (err) {
  wd = require('../../lib/main');
}

var Eyes = require('eyes.selenium').Eyes;
var webdriver = require('selenium-webdriver');

chaiAsPromised.transferPromiseness = wd.transferPromiseness;

describe('Applitools wd selenium example', function () {
  this.timeout(60000);
  var browser = wd.promiseChainRemote('http://localhost:4444/wd/hub');
  var driver = new webdriver.Builder().
    usingServer('http://localhost:4444/wd/hub').
    withCapabilities(webdriver.Capabilities.chrome()).
    build();
  var eyes = new Eyes();
  eyes.setApiKey("fy11O5GelVm856YF4q5vlF50AnuRiY5301y1Kj0LjTk110");
  eyes.setForceFullPageScreenshot(true);

  before(function (done) {
    return driver.getSession().then(function (sessiondata) {
      console.log('session id: ' + sessiondata.getId());
      return browser.attach(sessiondata.getId());
    }).then(function () {
      eyes.open(driver, "myApp", "Applitools wd selenium example");
      return browser.get("http://admc.io/wd/test-pages/guinea-pig.html");
    }).then(function () {
      done();
    })
  });

  after(function (done) {
    eyes.close(false).then(function (res) {
      console.log(res);
      browser.quit().done();
    });
  });

  afterEach(function (done) {
    eyes.checkRegionBy();
    eyes.checkWindow().then(function () {
      done();
    });
  });

  it("test1", function () {
    return browser
      .elementById('comments')
      .sendKeys("testing wd and webdriver integration");
  });

  it("test2", function () {
    return browser
      .elementById('i am a link')
      .click();
  });
});