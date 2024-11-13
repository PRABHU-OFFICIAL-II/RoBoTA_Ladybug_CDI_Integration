
chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    if (message.type == "cdgckibanalogs") {
        let script = document.createElement('script');
        let apis = { cdgckibanalogs: 'search-logs-by-traceid' }
        script.textContent = `(function () {
      function getCookie(name) {
        let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
      }
      let getOrgIdFilter = () => {
        let resolvers = [
          () => getCookie('X-INFA-ORG-ID')
        ]
        for(resolver of resolvers) {
          try {
            let orgid = resolver()
            if(orgid && orgid.trim() != '')
              return \`&orgId=\${resolver()}\`
          } catch(w) {}
        }
        return ""
      }
      let getUserProvider = () => {
        let resolvers = [
          () => window.iics.session.name
        ]
        for(resolver of resolvers) {
          try {
            let orgid = resolver()
            if(orgid && orgid.trim() != '')
              return \`&userId=\${resolver()}\`
          } catch(w) {}
        }
        return ""
      }
      let a=document.createElement('a')
      a.href=\`http://inedctst01:7002/index.html?api=${apis[message.type]}&traceId=${message.traceId}\${getOrgIdFilter()}\${getUserProvider()}\`
      a.target='_blank'
      a.click()
    })()`;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    }

    if (message.type == "wait") {
        // telling that CS has finished its job
        let resp = await waitForElm("div.infaWSContentBodyOuter.ui-infa-panel-outer.hasDesc > div.infaWSContentBody.ui-infa-panel.orgsListTable > div > div > div.infaTableHeader > div > div.infaTableButtonSet > div.infaTableBtn.infaTextBox.hasClearBtn > input");
        console.log(resp.maxLength);
        sendResponse({ complete: true });
    }

    if (message.type == "orgInfo") {
        waitForDetailsTab().then((elm) => {
            console.log("huh " + elm);
            sendResponse({ complete: true });
        });
    }

    if (message.type == "storeExtentionID") {
        localStorage.setItem("ExtentionID", message.id);
        console.log(" ExtentionID: " + localStorage.getItem("ExtentionID"));
    }

    if (message.type == "getLocalStorage") {
        localStorage.setItem("ExtentionID", message.id);
        console.log(" ExtentionID: " + localStorage.getItem("ExtentionID"));
        sendResponse({ complete: true, layout: localStorage.getItem("consolePersistenceState:06m3f0000008XCpAAM:Base") });
    }

    if (message.type == "impersonate") {
        console.log("going for impersonate" + JSON.stringify(message));
        let ssoUrl = message.info.ssoUrl;
        let podId = message.info.podId;
        let baseUrl = message.info.baseUrl;
        let pod = baseUrl.split("//")[1].split(".")[1];
        let tokens = new URL(baseUrl).hostname.split(".");
        let domain = tokens.splice(tokens.length - 3, 3).join(".");
        if (message.info.orgName == "NotFound") {
            let info = `Org Info:-\nId: ${message.info.orgId}\nName: ${message.info.orgName}\nPod: ${message.info.baseUrl.split("//")[1].replace(".informaticacloud.com", "")}`;
            console.log(info);
            return;
        }
        sleep(500).then(async () => {
            console.log("selectOrg api: " + `https://${domain}/ma/selectOrg?orgId=${message.info.orgId}&orgName=${encodeURI(message.info.orgName)}&prodId=di.administer`);
            let response = await fetch(`https://${domain}/ma/selectOrg?orgId=${message.info.orgId}&orgName=${encodeURI(message.info.orgName)}&prodId=di.administer`, {
                "method": "GET",
                "credentials": "include"
            });
            if (response.ok) {
                sleep(500).then(() => {
                    if (message.info.afterSignInUrl) {
                        window.location = message.info.afterSignInUrl;
                    } else if (/dynamic_*/.test(message.info.appUri) && message.info.appUri) {
                        fetch(`${window.location.origin}/cloudshell/api/v1/UserProductsInfo`, {
                            "headers": {
                                "accept": "application/json",
                                "logid": "123456789",
                            },
                            "method": "GET",
                            "credentials": "include"
                        }).then((response) => {
                            let data = response.json();
                            let tokenes = message.info.appUri.split("_");
                            console.log("UserProductsInfo: " + JSON.stringify(data) + " " + tokenes[0] + " " + tokenes[1] + " " + tokenes[2]);
                            data.userProducts.filter(product => product.uniqueName == tokenes[1]).forEach(services => {
                                services.filter(product => product.uniqueName == tokenes[2])
                                window.location = window.location.origin + services[0].indexPageUrl;
                            });
                        }).catch((error) => {
                            console.log(error);
                        });
                    } else if (!message.info.appUri) {
                        window.location = window.location.origin + '/cloudshell/showProducts';
                    } else {
                        window.location = window.location.origin + message.info.appUri;
                    }

                    console.log("response.ok");
                })
            }
        });
    }

    if (message.type == 'LADYBUG_BG') {
        const responseEvent = new CustomEvent('LADYBUG_BG', { detail: resp });
        window.dispatchEvent(message);
    }
    return Promise.resolve("Dummy response to keep the console quiet");
});

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForElm(selector) {
    return new Promise((resolve) => {
        console.log("wait promise...");
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

function waitForDetailsTab() {
    return new Promise((resolve) => {
        let div = document.querySelector("one-record-home-flexipage2").shadowRoot.querySelector("forcegenerated-adg-rollup_component___force-generated__flexipage_-record-page___-case_-record_-page5___-case___-v-i-e-w").shadowRoot.querySelector("forcegenerated-flexipage_case_record_page5_case__view_js").shadowRoot.querySelectorAll("flexipage-tabset2")[1].shadowRoot.querySelector("div.slds-tabs_card");
        console.log("wait promise...");
        if (div) {
            return resolve(div);
        }

        const observer = new MutationObserver((mutations) => {
            if (div) {
                resolve(div);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

chrome.runtime.sendMessage({ greeting: "forCE" }, function (response) {
    console.log("RoBoT-A response: ", response);
    if (response.isInstalled) localStorage.setItem("RoBoT-A", JSON.stringify(response));
});

window.addEventListener("message", function (event) {
    if (event.source != window)
        return;
    if (event.origin == "hello") return;
    if (event.data.type && (event.data.type == "impersonate")) {
        console.log("Content script received message: " + JSON.stringify(event.data));
        (async () => {
            const response = await chrome.runtime.sendMessage({
                greeting: "puppet",
                podInfo: event.data.podInfo,
                orgDetails: event.data.orgDetails,
                afterSignInUrl: event.data.afterSignInUrl
            });
            console.log("puppet response: ", response);
        })();
    }
});

chrome.runtime.onConnect.addListener(function (port) {
    if (port.name === "contentScriptPort") {
        port.onMessage.addListener(function (msg) {
            if (msg.type === "insertHtml") {
                const outputField = document.querySelector(msg.selector);
                const tag = document.createElement(msg.tag);
                tag.innerHTML = msg.content;
                outputField.appendChild(tag);
                port.postMessage({ type: "insertedHtml", content: tag.outerHTML });
            }
        });
    }
});

// inject ladybug
function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}
injectScript(chrome.extension.getURL('/js/ladybug.js'), 'body');

window.addEventListener('LADYBUG_FG', function (event) {
    console.log(event)
    if (event.detail.type == 'LADYBUG_EX') {
        let sending = chrome.runtime.sendMessage(event.detail);
    }
})
