$browser.get(sso_url).then(function () {
    log(scriptStep++, "Navigating to signin page");
    return $browser.waitForAndFindElement(By.id("email"), DefaultTimeout);
})
.then(function (element) { 
    element.sendKeys(username); 
})

.then(function () {
  //Find the password field by specifying its id, then enter the password
  return $browser.waitForAndFindElement(By.id("password"), DefaultTimeout);
})
.then(function (element) { 
    element.sendKeys(password); 
})
.then(function () {
  //Click the submit button.
  return $browser.waitForAndFindElement(By.id("login-submit"), DefaultTimeout);
})
.then(function (el) { 
    logWithInsight(scriptStep++, "Signing in with " + username, "SignIn-" + pod);
    el.click(); 
})

.then(function () {
  return $browser.wait(until.elementLocated(By.className("tb-subplace-tabs")), DefaultTimeout, "Could not locate tabs");
})
.then(function () {
  $browser.getCurrentUrl().then(function (url) {
    assert.equal(url, workbooks_url, "After login urls don't match");
  });
})
.then(function () {
  log(scriptStep++, 'closing trust dialog');
  return $browser.findElement(By.css("button.tb-outline-button.tb-cancel-button"), DefaultTimeout);
})
.then(function(el) {
  el.click();
}, function() {
  // Ignore the error since this is because the trust dialog was not up  
})
.then (function() {
  log(scriptStep++, "Navigating to Datasources");
  return $browser.get(datasources_url);
})
.then(function () {
  var dsnamexpath = "//span/a[@title=\'"+DATASOURCE_NAME+"\']";
  return $browser.waitForAndFindElement(By.xpath(dsnamexpath), DefaultTimeout); 
})
.then(function(el) {
  el.click();
})
.then(function () {
  log(scriptStep++, "Click create a New workbook");
  return $browser.waitForAndFindElement(By.xpath("//div[@class=\'tb-place-name-line\']/span[1]/span/a"), DefaultTimeout);
})
.then(function (el) {
  logWithInsight(scriptStep++, "Creating new workbook", "NewWorkbook-" + pod)
  el.click();
  $browser.sleep(2000);
})
.then(function() {
  $browser.getAllWindowHandles().then(function (windowHandlers) {
    if(windowHandlers.length == 1) {
      var waitStart = Date.now();
      var waitElapsed = Date.now() - waitStart;
      while(windowHandlers.length == 1 && waitElapsed < DefaultTimeout) {
        $browser.getAllWindowHandles().then(function (wins) {
          windowHandlers = wins;
        })
        waitElapsed = Date.now() - waitStart;
      }
    }
    $browser.switchTo().window(windowHandlers[1]).then(function () {
      $browser.wait(until.elementLocated(By.className("tabAuthMenuBarWorkbook")), DefaultTimeout, "Could not locate edit workbook tab");
    })
  })
})
.then(function () {
  $browser.findElement(By.id("loadingGlassPane")).then(function (el) {
    $browser.wait(until.elementIsNotVisible(el), DefaultTimeout, 'Glasspane still visible');
  })
})
.then(function () {
  log(scriptStep++, "Finding the File menu and clicking it")
  var fileMenuCssSelector = "body > div.tabAuthMastheadArea > div > div > div.tabAuthMenuBarMenus > div.tabAuthMenuBarCommandMenus > div:nth-child(1) > div"
  $browser.wait(until.elementLocated(By.css(fileMenuCssSelector)), DefaultTimeout, 'Could not find file Menu').then(function (fileMenu) {
    $browser.findElement(By.css(fileMenuCssSelector)).then(function (el) {
      el.click();
    })
  })
})

.then(function () {
  log(scriptStep++, "Finding and clicking Save As");
  $browser.wait(until.elementLocated(By.className("tabMenuContent")), DefaultTimeout, 'Could not find Menu');
  var menuContent = $browser.findElement(By.css("body > div.tabMenu.tab-widget.tabMenuUnificationTheme.light.tabMenuNoIcons.tabMenuNoDesc > div.tabMenuContent"));
  menuContent.findElements(By.className("tabMenuItem")).then(function (menuItems) {
    menuItems[1].click()
  })
})
.then(function () {
  logWithInsight(scriptStep++, "Providing the name of the workbook to save", "")
  $browser.wait(until.elementLocated(By.className("tab-dialogTitle")), DefaultTimeout, 'Could not find Save As dialog').then(function () {
    var workbookNameInputBoxCssSelector = "body > div.tab-dialog.tab-widget.tabDropTarget.tab-selectable.active > div.tab-dialogBodyContainer > div > table > tr:nth-child(2) > td > div > input";
    $browser.findElement(By.css(workbookNameInputBoxCssSelector)).sendKeys(NEW_WORKBOOK_NAME)

  })
})
.then(function () {
  logWithInsight(scriptStep++, "Saving the workbook", "SavingWorkbook-" + pod)
  $browser.findElement(By.className("tabAuthSaveSaveButton")).then(function (el) {
    el.click();
    $browser.sleep(5000);
  })
})
.then(function () {
  log(scriptStep++, "Waiting for the new workbook name to appear")
  $browser.findElement(By.className("tabAuthMenuBarWorkbook")).then(function (el) {
    $browser.findElement(By.className("tabAuthMenuBarWorkbook")).then(function (el1) {
      el1.getText().then(function (wbname) {
        assert.equal(wbname, NEW_WORKBOOK_NAME)
      })
    })
  })
})
.then(function () {
  log(scriptStep++, "Navigating to the default project workbooks page")
  $browser.get(defaultproject_url).then(function () {
    return $browser.wait(until.elementLocated(By.linkText("Analyze Superstore")), DefaultTimeout, "Could not locate Analyze Superstore on default projects page");
  })
})

.then(function() {
  log(scriptStep++, "Searching for the workbook")
  return $browser.waitForAndFindElement(By.name("omniboxTextBox"), DefaultTimeout); })
.then(function (el) {
  el.clear();
  el.sendKeys(NEW_WORKBOOK_NAME);
})
.then(function() {
  log(scriptStep++, 'Selecting from the search drop down');
  return $browser.waitForAndFindElement(By.xpath("//div[@id=\'ng-app\']/div[2]/div/div/div[2]/a[2]/span/div"), DefaultTimeout); 
})
.then(function (el) { 
  el.click(); 
})
.then(function() {
  log(scriptStep++, 'Clicking on more actions to get to Delete menu');
  return $browser.waitForAndFindElement(By.xpath("//div[@class=\'tb-place-name-line\']/span[2]/span/span"), DefaultTimeout); })
.then(function (el) {
  el.click();
})
.then(function() {
  log(scriptStep++, 'Clicking on Delete to delete the workbook');
  return $browser.waitForAndFindElement(By.xpath("//div[@class=\'tb-place-name-line\']//div[.=\'Delete…\']"), DefaultTimeout); })
.then(function (el) { 
  el.click();
})
.then(function() {
  log(scriptStep++, 'Click confirm delete button');
  return $browser.waitForAndFindElement(By.xpath("//div[@class=\'tb-dialog-actions\']/button[2]"), DefaultTimeout); })
.then(function (el) { 
  el.click(); 
})
.then(function() {
  log(scriptStep++, 'Clearing toast');
  return $browser.waitForAndFindElement(By.css("span.tb-clear-button.tb-disable-selection"), DefaultTimeout); })
.then(function (el) { 
  el.click();
})
.then(function () {
  endLog(scriptStep);
})
