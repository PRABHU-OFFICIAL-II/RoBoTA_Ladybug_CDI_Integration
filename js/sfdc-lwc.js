import { loadScript } from 'lightning/platformResourceLoader';
import insertHtmlScript from '@salesforce/resourceUrl/insertHtmlScript';
function handleLoadScript() {
  Promise.all([
    loadScript(this, insertHtmlScript)
  ])
    .then(() => {
      // Content script loaded successfully
      // Insert your HTML tag into the lightning-output-field here
      const div = this.template.getElementsByTagName('lightning-output-field.slds-form-element.slds-form-element_stacked');
      const contentScriptPort = chrome.runtime.connect({ name: "contentScriptPort" });
      contentScriptPort.postMessage({ type: "insertHtml", selector: "lightning-output-field", tag: "div", content: "Hello World" });
      contentScriptPort.onMessage.addListener((msg) => {
        if (msg.type === "insertedHtml") {
          div.innerHTML = msg.content;
        }
      });
    })
    .catch(error => {
      // Handle error
    });
};