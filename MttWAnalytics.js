var sendKeysX = function (e, str) {
    for (var i = 0; i < str.length; ++i)
    {
        $browser.sleep(100);
        e.sendKeys(str[i]);
    }
    $browser.sleep(100);
};

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
    return $browser.waitForAndFindElement(By.xpath("//div[@tb-test-id=\'getting-started-notifications-modal\']"), DefaultTimeout);
})
.then(function () {
    log(scriptStep++, "closing 'getting started' dialog");
    return $browser.findElement(By.css("div.tb-modal-external-content.tb-modal > span.tb-modal-close"), DefaultTimeout);
})
.then(function(el) {
    el.click();
}, function() { /* Ignore the error since this is because the 'getting started' dialog was not up */ })
.then(function () {
    return $browser.getCurrentUrl().then(function (url) {
        if (url != workbooks_url)
        {
            return $browser.waitForAndFindElement(By.xpath("//a[@tb-test-id=\'subplace-tab-button-workbooks\']"), DefaultTimeout)
                .then(function (el) {
                    el.click();
                });
        }
    });
})
.then(function () {
    return $browser.wait(until.elementLocated(By.className("tb-subplace-tabs")), DefaultTimeout, "Could not locate tabs");
})
.then(function () {
    $browser.getCurrentUrl().then(function (url) {
        assert.equal(url, workbooks_url, "After login and navigation, urls don't match");
    });
})
.then(function() {
    log(scriptStep++, "Click '+ New Workbook' button");
    return $browser.waitForAndFindElement(By.xpath("//span[@tb-test-id=\'action-create-workbook-from-scratch\']"), DefaultTimeout);
})
.then(function (el) {
    logWithInsight(scriptStep++, "Creating new workbook", "NewWorkbook-" + pod)
    el.click();
    $browser.sleep(2000);
})
.then(function() {
    $browser.getAllWindowHandles().then(function (windowHandlers) {
        if (windowHandlers.length == 1) {
            var waitStart = Date.now();
            var waitElapsed = Date.now() - waitStart;
            while(windowHandlers.length == 1 && waitElapsed < DefaultTimeout) {
                $browser.getAllWindowHandles().then(function (wins) {
                    windowHandlers = wins;
                });
                waitElapsed = Date.now() - waitStart;
            }
        }
        
        $browser.switchTo().window(windowHandlers[1]).then(function () {
            $browser.wait(
                until.elementLocated(By.className("tabAuthMenuBarWorkbook")),
                DefaultTimeout,
                "Could not locate edit workbook tab");
        });
    });
})
.then(function () {
    return $browser.findElement(By.id("loadingGlassPane"))
        .then(function (el) {
            $browser.wait(
                until.elementIsNotVisible(el),
                DefaultTimeout,
                "Glasspane still visible");
        });
})
.then(function () {
    log(scriptStep++, "Wait for the 'Connect to Data' dialog");
    $browser.wait(
        until.elementLocated(By.xpath("//div[@data-tb-test-id=\'tabConnectionDialog-Dialog-Body\']")),
        DefaultTimeout,
        "Could not find 'Connect to Data' dialog");
})
.then(function () {
    log(scriptStep++, "Close the 'Connect to Data' dialog");
    return $browser.waitForAndFindElement(
        By.css("div.tabConnectionDialog div.tab-custom-button > div.tabConnectionDialogHeaderClose"),
        DefaultTimeout,
        "Could not find close button")
            .then(function (closeButton) {
                closeButton.click();
            });
})
.then(function () {
    log(scriptStep++, "Finding the File menu and clicking it");
    return $browser.waitForAndFindElement(
        By.css("body > div.tabAuthMenubarArea > div > div > div.tabAuthMenuBarMenus > div.tabAuthMenuBarCommandMenus > div:nth-child(1) > div"),
        DefaultTimeout,
        "Could not find file menu")
            .then(function (fileMenu) {
                fileMenu.click();
            });
})
.then(function () {
    log(scriptStep++, "Finding and clicking 'Save As'");
    $browser.wait(until.elementLocated(By.className("tabMenuContent")), DefaultTimeout, "Could not find Menu");
    var menuContent = $browser.findElement(By.css("body > div.tabMenu.tab-widget.tabMenuUnificationTheme.light.tabMenuNoIcons.tabMenuNoDesc > div.tabMenuContent"));
    menuContent.findElements(By.className("tabMenuItem")).then(function (menuItems) {
        menuItems[1].click();
    });
})
.then(function () {
    logWithInsight(scriptStep++, "Providing the name of the workbook to save", "");
    $browser.wait(until.elementLocated(By.className("tab-dialogTitle")), DefaultTimeout, 'Could not find Save As dialog').then(function () {
        var workbookNameInputBoxCssSelector = "body > div.tab-dialog.tab-widget.tabDropTarget.tab-selectable.active > div.tab-dialogBodyContainer > div > table > tr:nth-child(2) > td > div > input";
        sendKeysX($browser.findElement(By.css(workbookNameInputBoxCssSelector)), NEW_WORKBOOK_NAME);
    });
})
.then(function () {
    logWithInsight(scriptStep++, "Saving the workbook", "SavingWorkbook-" + pod);
    $browser.findElement(By.className("tabAuthSaveSaveButton")).then(function (el) {
        el.click();
        $browser.sleep(5000);
    });
})
.then(function () {
    log(scriptStep++, "Waiting for the new workbook name to appear");
    $browser.findElement(By.className("tabAuthMenuBarWorkbook")).then(function (el) {
        $browser.findElement(By.className("tabAuthMenuBarWorkbook")).then(function (el1) {
            el1.getText().then(function (wbname) {
                assert.equal(wbname, NEW_WORKBOOK_NAME);
            });
        });
    });
})
.then(function () {
    log(scriptStep++, "Finding the File menu and clicking it");
    return $browser.waitForAndFindElement(
        By.css("body > div.tabAuthMenubarArea > div > div > div.tabAuthMenuBarMenus > div.tabAuthMenuBarCommandMenus > div:nth-child(1) > div"),
        DefaultTimeout,
        "Could not find file menu")
            .then(function (fileMenu) {
                fileMenu.click();
            });
})
.then(function () {
    log(scriptStep++, "Finding 'Close'");
    $browser.wait(until.elementLocated(By.className("tabMenuContent")), DefaultTimeout, "Could not find Menu");
    var menuItems = $browser.findElement(By.css("body > div.tabMenu.tab-widget.tabMenuUnificationTheme.light.tabMenuNoIcons.tabMenuNoDesc > div.tabMenuContent > .tabMenuItem"));
    var closeMenuItem = menuItems.findElement(By.xpath("//span[contains(text(), 'Close')]/../.."));
    log(scriptStep++, "Clicking 'Close'");
    closeMenuItem.click();
})
.then(function() {
    log(scriptStep++, "Switching tabs back to VizPortal");
    $browser.getAllWindowHandles().then(function (windowHandlers) {
        $browser.switchTo().window(windowHandlers[0]);
    });
})
.then(function () {
    log(scriptStep++, "Navigating to the default project workbooks page");
    $browser.get(defaultproject_url).then(function () {
        return $browser.wait(until.elementLocated(By.linkText("Analyze Superstore")), DefaultTimeout, "Could not locate Analyze Superstore on default projects page");
    });
})
.then(function() {
    log(scriptStep++, "Searching for the workbook");
    return $browser.waitForAndFindElement(By.css("span.ng-isolate-scope > div > div > div > div > div.tb-search-box-icon-button > div > span"), DefaultTimeout);
})
.then(function(el) {
    el.click();
    return $browser.waitForAndFindElement(By.name("omniboxTextBox"), DefaultTimeout);
})
.then(function (el) {
    el.clear();
    sendKeysX(el, NEW_WORKBOOK_NAME);
})
.then(function() {
    log(scriptStep++, "Selecting from the search drop down");
    return $browser.waitForAndFindElement(By.xpath("//div[@id=\'ng-app\']/div[2]/div/div/div[2]/a[2]/span/div"), DefaultTimeout); 
})
.then(function (el) { 
    el.click(); 
})
.then(function() {
    log(scriptStep++, "Clicking on the sheet to bring up the view");
    return $browser.waitForAndFindElement(By.xpath("//div[@class=\'tb-react-dg-bsection\']/div[@class=\'tb-react-dg-brow\']/div[@data-tb-test-id=\'name-col-cell\']/div/div/span/a"), DefaultTimeout);
})
.then(function (el) {
    el.click();
})
.then(function() {
    log(scriptStep++, "Clicking on 'Edit' to edit the workbook");
    return $browser.waitForAndFindElement(By.css(".tabToolbarButton.edit"), DefaultTimeout);
})
.then(function (el) { 
    el.click();
})
.then(function() {
    $browser.getAllWindowHandles().then(function (windowHandlers) {
        if (windowHandlers.length == 1) {
            var waitStart = Date.now();
            var waitElapsed = Date.now() - waitStart;
            while(windowHandlers.length == 1 && waitElapsed < DefaultTimeout) {
                $browser.getAllWindowHandles().then(function (wins) {
                    windowHandlers = wins;
                });
                waitElapsed = Date.now() - waitStart;
            }
        }
        
        $browser.switchTo().window(windowHandlers[1]).then(function () {
            $browser.wait(
                until.elementLocated(By.className("tabAuthMenuBarWorkbook")),
                DefaultTimeout,
                "Could not locate edit workbook tab");
        });
    });
})
.then(function () {
    return $browser.findElement(By.id("loadingGlassPane"))
        .then(function (el) {
            $browser.wait(
                until.elementIsNotVisible(el),
                DefaultTimeout,
                "Glasspane still visible");
        });
})
.then(function () {
    log(scriptStep++, "Verifying authoring the workbook");
    return $browser.findElement(By.className("tabAuthMenuBarWorkbook"))
        .then(function (el) {
            el.getText().then(function (wbname) {
                assert.equal(wbname, NEW_WORKBOOK_NAME);
            });
        });
})
.then(function () {
    log(scriptStep++, "Finding the File menu and clicking it");
    return $browser.waitForAndFindElement(
        By.css("body > div.tabAuthMenubarArea > div > div > div.tabAuthMenuBarMenus > div.tabAuthMenuBarCommandMenus > div:nth-child(1) > div"),
        DefaultTimeout,
        "Could not find file menu")
            .then(function (fileMenu) {
                fileMenu.click();
            });
})
.then(function () {
    log(scriptStep++, "Finding 'Close'");
    $browser.wait(until.elementLocated(By.className("tabMenuContent")), DefaultTimeout, "Could not find Menu");
    var menuItems = $browser.findElement(By.css("body > div.tabMenu.tab-widget.tabMenuUnificationTheme.light.tabMenuNoIcons.tabMenuNoDesc > div.tabMenuContent > .tabMenuItem"));
    var closeMenuItem = menuItems.findElement(By.xpath("//span[contains(text(), 'Close')]/../.."));
    log(scriptStep++, "Clicking 'Close'");
    closeMenuItem.click();
})
.then(function() {
    log(scriptStep++, "Switching tabs back to VizPortal");
    $browser.getAllWindowHandles().then(function (windowHandlers) {
        $browser.switchTo().window(windowHandlers[0]);
    });
})
.then(function () {
    log(scriptStep++, "Navigating to the default project workbooks page");
    $browser.get(defaultproject_url).then(function () {
        return $browser.wait(until.elementLocated(By.linkText("Analyze Superstore")), DefaultTimeout, "Could not locate Analyze Superstore on default projects page");
    });
})
.then(function() {
    log(scriptStep++, "Searching for the workbook");
    return $browser.waitForAndFindElement(By.css("span.ng-isolate-scope > div > div > div > div > div.tb-search-box-icon-button > div > span"), DefaultTimeout);
})
.then(function(el) {
    el.click();
    return $browser.waitForAndFindElement(By.name("omniboxTextBox"), DefaultTimeout);
})
.then(function (el) {
    el.clear();
    sendKeysX(el, NEW_WORKBOOK_NAME);
})
.then(function() {
    log(scriptStep++, "Selecting from the search drop down");
    return $browser.waitForAndFindElement(By.xpath("//div[@id=\'ng-app\']/div[2]/div/div/div[2]/a[2]/span/div"), DefaultTimeout); 
})
.then(function (el) { 
    el.click(); 
})
.then(function() {
    log(scriptStep++, "Clicking on more actions to get to Delete menu");
    return $browser.waitForAndFindElement(By.xpath("//div[@class=\'tb-place-name-line\']/span[2]/span/span"), DefaultTimeout);
})
.then(function (el) {
    el.click();
})
.then(function() {
    log(scriptStep++, "Clicking on 'Delete…' to delete the workbook");
    return $browser.waitForAndFindElement(By.xpath("//div[@class=\'tb-place-name-line\']//div[.=\'Delete…\']"), DefaultTimeout);
})
.then(function (el) { 
    el.click();
})
.then(function() {
    log(scriptStep++, "Click confirm delete button");
    return $browser.waitForAndFindElement(By.xpath("//div[@class=\'tb-dialog-actions\']/button[2]"), DefaultTimeout);
})
.then(function (el) { 
    el.click(); 
})
.then(function() {
    log(scriptStep++, "Clearing toast");
    return $browser.waitForAndFindElement(By.css("span.tb-clear-button.tb-disable-selection"), DefaultTimeout);
})
.then(function (el) { 
    el.click();
})
.then(function () {
    endLog(scriptStep);
});
