(async () => {
  const src = chrome.extension.getURL("./js/sfdc-lwc.js");
  const contentScript = await import(src);
  contentScript.handleLoadScript();
})();