
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
                sleep(1500).then(() => {
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

// !!!!!!!!!!! yeah here is the bug !!!!!!!!!!!!

// ==UserScript==
// @name         CDGCS
// @namespace    http://tampermonkey.net/
// @version      2024-06-10
// @description  try to take over the world (nah, just CDGC)!
// @author       mpataki@informatica.com
// @match        *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// ==/UserScript==

(function() {

    // because the URL matching is wierd - https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns
    let allowedHosts = ["mcc.", "cdgc."];
    if(allowedHosts.filter(h => window.location.hostname.startsWith(h)).length == 0) return;

    console.log('Hello from CDGCS!');

    function render(name, spec, elemCreated, container) {
        let e;
        if (!spec.preBuilt) {
            e = document.createElement(spec.ele);
            spec.iden && elemCreated(spec.iden, e)
            if (spec.text) e.innerHTML = spec.text;
            if (spec.classList) {
                e.classList = `${name}-` + spec.classList.split(/\s+/).join(` ${name}-`)
            }
            spec.attribs && Object.keys(spec.attribs).forEach(key => {
                e[key] = spec.attribs[key]
            })
            spec.styles && Object.keys(spec.styles).forEach(key => {
                e.style[key] = spec.styles[key]
            })
            spec.evnts && Object.keys(spec.evnts).forEach(key => {
                e.addEventListener(key, spec.evnts[key])
            })
            if (spec.children) {
                if (spec.children instanceof Function) {
                    spec.children().map(x => e.appendChild(x))
                }
                else spec.children.forEach(child => render(name, child, elemCreated, e))
            }
        } else {
            e = spec.ele;
        }
        if (container) {
            let lbl;
            if (spec.label || spec.postlabel) {
                let rgid = "id_" + Math.random();
                e.id = rgid
                lbl = document.createElement('label')
                lbl.innerHTML = spec.label || spec.postlabel
                lbl.setAttribute('for', rgid)
            }
            if (spec.label) container.appendChild(lbl)
            container.appendChild(e)
            if (spec.postlabel) container.appendChild(lbl)
            return container;
        }
        return e;
    }
    let clipboardDiv ;
    function copyToClip(html) {

        if (!clipboardDiv) {
            clipboardDiv = document.createElement("div");
            clipboardDiv.style.fontSize = "12pt"; // Prevent zooming on iOS
            // Reset box model
            clipboardDiv.style.border = "0";
            clipboardDiv.style.padding = "0";
            clipboardDiv.style.margin = "0";
            // Move element out of screen
            clipboardDiv.style.position = "fixed";
            clipboardDiv.style["right"] = "-9999px";
            clipboardDiv.style.top =
                (window.pageYOffset || document.documentElement.scrollTop) + "px";
            // more hiding
            clipboardDiv.setAttribute("readonly", "");
            clipboardDiv.style.opacity = 0;
            clipboardDiv.style.pointerEvents = "none";
            clipboardDiv.style.zIndex = -1;
            clipboardDiv.setAttribute("tabindex", "0"); // so it can be focused
            clipboardDiv.innerHTML = "";
            document.body.appendChild(clipboardDiv);
        }
        clipboardDiv.innerHTML = html;
        var focused = document.activeElement;
        clipboardDiv.focus();

        window.getSelection().removeAllRanges();
        var range = document.createRange();
        range.setStartBefore(clipboardDiv.firstChild);
        range.setEndAfter(clipboardDiv.lastChild);
        window.getSelection().addRange(range);
        try {
            if (document.execCommand("copy")) {
                alert('Copied to clipboard')
            }
        } catch (err) {
            console.error(err)
            alert("copy failed, but the config is printed to browser console!");
        }
        focused.focus();
    }


    // ---------- HTTP ---------------
    let rejectCodeList = [400, 401, 500, 403];

    function _ajax(method, url, data, hdrs, cancelToken, decorator) {
        return new Promise((resolve, reject) => {
            var xhttp = new XMLHttpRequest();
            if (cancelToken) {
                cancelToken.cancel = function () {
                    xhttp.abort();
                    reject(new Error("Cancelled"));
                };
            }
            decorator && decorator(xhttp, resolve, reject)
            xhttp.open(method, url, true);
            hdrs && Object.keys(hdrs).forEach(key => xhttp.setRequestHeader(key, hdrs[key]))
            xhttp.send(data);
        });
    }

    function ajax(method, url, data, hdrs, cancelToken) {
        return _ajax(method, url, data, hdrs, cancelToken, (xhttp, resolve, reject) => {
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let json;
                    try { json = JSON.parse(this.responseText); } catch (e) { }
                    resolve({
                        response: this.responseText,
                        json,
                        headers: makeHMap(xhttp.getAllResponseHeaders())
                    })
                }
                if (this.readyState == 4 && rejectCodeList.includes(this.status)) {
                    reject({ message: JSON.parse(this.responseText).message, code: this.status });
                }
            };
            xhttp.onerror = function () {
                reject({ message: JSON.parse(this.responseText).message, code: this.status });
            }
        })
    }

    function download(url, fileName, hdrs) {
        return _ajax('GET', url, undefined, hdrs, undefined, xhr => {
            xhr.responseType = 'blob';
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const url = window.URL.createObjectURL(xhr.response);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 0);
                }
            };
        })
    }

    function makeHMap(headers) {
        var arr = headers.trim().split(/[\r\n]+/);
        var headerMap = {};
        arr.forEach(function (line) {
            var parts = line.split(': ');
            var header = parts.shift();
            var value = parts.join(': ');
            headerMap[header] = value;
        });
        return headerMap;
    }

    function get(url, data, headers, token) {
        return ajax("GET", url, undefined, headers, token);
    }

    function post(url, data, hdrs) {
        if (typeof data !== 'string') {
            hdrs = { "Content-Type": "application/json", ...hdrs }
        }
        return ajax('POST', url, JSON.stringify(data), hdrs);
    }

    function postFile(url, data, hdrs) {
        return ajax('POST', url, data, hdrs);
    }

    function delet(url) {
        return ajax('DELETE', url);
    }
    // -------------------------------



    let token = undefined;
    function getToken() {
        // Function to decode JWT
        function parseJwt(token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                return JSON.parse(jsonPayload);
            } catch (error) {
                console.error("Invalid token:", error);
                return null;
            }
        }

        // Function to check if JWT is expired
        function isJwtExpired(token) {
            const decodedToken = parseJwt(token);
            if (!decodedToken || !decodedToken.exp) {
                return true; // Consider token expired if we cannot decode it or it has no exp claim
            }
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            return decodedToken.exp < currentTime;
        }
        if(!token || isJwtExpired(token)) {
            return iics.identityService.getJWTToken('cdlg_app', '0xcafebabe').then(x => token = x.jwt_token)
        } else {
            return Promise.resolve(token);
        }
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function getEffOrgId() {
        return getCookie('SELECTED_ORG_ID') || iics.session.currentOrgId;
    }

    function _cdgcApi(method, url, payload, headers={}) {
        return getToken().then(x => method(url, payload, {'Authorization': 'Bearer ' + x, 'Accept': 'application/json', ...headers})).then(x => x.json)
    }

    let services;
    function cdgcApi(method, api, payload, headers={}) {
        if (!services) services = _cdgcApi(get, `/ccgf-service-discovery/api/v1/tms/servicemappingsWithPodInfo/${getEffOrgId()}`)
        return services.then(s => s.serviceDetails.filter(s => s.serviceName == api.split('/')[1])[0].serviceVersion.externalServiceUrl).then(url => _cdgcApi(method, `${new URL(url).origin}${api}`, payload, headers))
    }

    function copyActionFor(funct) {
        return () => funct().then(copyToClip)
    }

    function showActionFor(funct) {
        return () => funct().then(showFmt)
    }

    function copyActionForCdgcUrl(func, urlGetter, payloadGetter, hdrs) {
        return copyActionFor(() => cdgcApi(func, urlGetter(), payloadGetter?payloadGetter():undefined, hdrs).then(x => JSON.stringify(x, undefined, 4)))
    }

    function showActionForCdgcUrl(func, urlGetter, payloadGetter, hdrs) {
        return showActionFor(() => cdgcApi(func, urlGetter(), payloadGetter?payloadGetter():undefined, hdrs).then(x => JSON.stringify(x, undefined, 4)))
    }

    function getDownloadActionForCdgcUrl(urlGetter, fileName) {
        return () => cdgcApi((url, _, hdrs) => download(url, fileName, hdrs), urlGetter())
    }

    function showFmt(text) {
        makePopup({
            ele: 'pre', styles: { margin: '20px 40px', background: 'white', border: 'solid 2px black', padding: '5px', overflow: 'auto', position: 'relative'}, text, evnts: {click: _ => _.stopPropagation()},
            children: [
                { ele: 'button', text: 'copy', styles: {position: 'absolute', top: '5px', right: '5px'}, evnts: {click: _ => copyToClip(text)}}
            ]
        }, 'rgba(0,0,0,0.3)')
    }

    function showHttpReqBuilder() {
        function execute(txt) {
            head = txt.split('\n')[0];
        }
        makePopup(
            {
                ele: 'div', styles: { margin: '20px 40px', display: 'flex', background: 'white', border: 'solid 2px black', padding: '5px', overflow: 'auto'}, evts: {click: _ => _.stopPropagation()},
                children: [
                    {ele: 'textarea', styles: { flexGrow: 1 }},
                    {ele: 'button', text: 'Execute', evnts: {click: function() { execute(this.previousElementSibling.value) }}}
                ]
            },
            'rgba(0,0,0,0.3)'
        )
    }

    /*
    service functions
    metadata_staging
    auto_catalog_staging
    custom-metadata-staging-producer
    profiling_staging
    plugin-staging
    */

    let UIs = {
        "mcc": {
            "/monitor": {
                menuItems: [
                    {group: "Jobs", text: "Show subtask details", action: () => Promise.resolve(1)}
                ]
            },
            "/jobInfo/.*": {
                menuItems: [
                    {group: "Job info", text: "Copy job definition", action: copyActionForCdgcUrl(get, _ => `/ccgf-orchestration-management-api-server/api/v1/jobs/${window.location.pathname.substring(9)}?aggregateResourceUsage=false&expandChildren=INPUT-PROPERTIES&expandChildren=OUTPUT-PROPERTIES&expandChildren=TASK-HIERARCHY&expandChildren=WORKFLOW-DETAILS&expandChildren=OPERATIONS`)},
                    {group: "Job info", text: "Copy job spec", action: copyActionForCdgcUrl(get, _ => `/ccgf-orchestration-management-api-server/api/v1/jobs/${window.location.pathname.substring(9)}/jobspec`)},
                ],
                snippets: [
                    () => {
                        let jobid = window.location.pathname.substring(9);
                        let placeToShow = document.querySelector(`#overview_container_${jobid}`)
                        cdgcApi(get, `/ccgf-metadata-staging/api/v1/staging/files?path=${jobid}&serviceFunction=metadata_staging`).then(files => {
                            console.log(files)
                            render('aug-ui', {
                                ele: 'div', styles: {display: 'flex', flexDirection: 'column'},
                                children: [
                                    {ele: 'h3', text: 'Files'},
                                    {ele: 'div', children: files.fullyQualifiedPath.map(p => ({
                                        ele: 'a', text: p, evnts: {click: getDownloadActionForCdgcUrl(_ => `/ccgf-metadata-staging/api/v1/staging/files/download?filePath=${encodeURIComponent(p)}&serviceFunction=metadata_staging`, p.split('/').pop())}
                                    }))}
                                ]
                            }, undefined, placeToShow)
                        })
                    }
                ]
            },
            ".*": {
                menuItems: [
                    {group: "", text: "Copy JWT token", action: copyActionFor(getToken)},
                    {group: "", text: "Copy session id", action: copyActionFor(() => Promise.resolve(iics.session.id))}
                ]
            }
        },
        "cdgc": {
            "/asset/.*": {
                menuItems: [
                    {group: "ES", text: "Show asset doc from ES", action: showActionForCdgcUrl(post, _ => `/ccgf-searchv2/api/v1/search`, _ => ({"from": 0, "size": 9, "query": {"bool": {"must": [{"terms": {"elementType": ["OBJECT"]}}, {"terms": {"core.identity": [window.location.pathname.substring(7)]}}]}}}), {'x-infa-search-language': 'elasticsearch'})},
                    {group: "ES", text: "Show in-edges from ES", action: showActionForCdgcUrl(post, _ => `/ccgf-searchv2/api/v1/search`, _ => ({"from": 0, "size": 10000, "query": {"bool": {"must": [{"terms": {"elementType": ["RELATIONSHIP"]}}, {"terms": {"core.targetIdentity": [window.location.pathname.substring(7)]}}]}}}), {'x-infa-search-language': 'elasticsearch'})},
                    {group: "ES", text: "Show out-edges from ES", action: showActionForCdgcUrl(post, _ => `/ccgf-searchv2/api/v1/search`, _ => ({"from": 0, "size": 10000, "query": {"bool": {"must": [{"terms": {"elementType": ["RELATIONSHIP"]}}, {"terms": {"core.sourceIdentity": [window.location.pathname.substring(7)]}}]}}}), {'x-infa-search-language': 'elasticsearch'})},

                    {group: "Graph", text: "Show asset from Graph", action: showActionForCdgcUrl(post, _ => `/ccgf-searchv2/api/v1/search`, _ => ({"@type": "g:Bytecode", "@value": {"step": [["V", `${getEffOrgId()}://${window.location.pathname.substring(7)}`], ["valueMap", true]]}}), {'x-infa-search-language': 'gremlin'})},
                    {group: "Graph", text: "Show in-edges from Graph", action: showActionForCdgcUrl(post, _ => `/ccgf-searchv2/api/v1/search`, _ => ({"@type": "g:Bytecode", "@value": {"step": [["V", `${getEffOrgId()}://${window.location.pathname.substring(7)}`], ["inE"], ["valueMap", true]]}}), {'x-infa-search-language': 'gremlin'})},
                    {group: "Graph", text: "Show out-edges from Graph", action: showActionForCdgcUrl(post, _ => `/ccgf-searchv2/api/v1/search`, _ => ({"@type": "g:Bytecode", "@value": {"step": [["V", `${getEffOrgId()}://${window.location.pathname.substring(7)}`], ["outE"], ["valueMap", true]]}}), {'x-infa-search-language': 'gremlin'})},

                ]
            },
            ".*": {
                menuItems: [
                    {group: "", text: "Copy JWT token", action: copyActionFor(getToken)},
                    {group: "", text: "Copy session id", action: copyActionFor(() => Promise.resolve(iics.session.id))},
                    {group: "", text: "Make HTTP requests", action: () => showHttpReqBuilder() }
                ]
            }
        }
    }

    function getUiElems() {
        let u = new URL(window.location.href);
        let app = u.hostname.split('.')[0];
        let path = u.pathname;
        return Object.entries(UIs[app]).filter(([p, e]) => (new RegExp(p)).test(path)).map(x => x[1]);
    }

    function makePopup(def, bgcolor) {
        let popupbg = render('popupbg', {
            ele: 'div',
            styles: {position: 'absolute', top: '0px', left: '0px', right: '0px', bottom: '0px', background: bgcolor || 'transparent', zIndex: 10000, display: 'flex', flexDirection: 'column'},
            evnts: { click : function() { this.remove() }},
            children: [def]
        });
        document.body.appendChild(popupbg)
    }

    function makeMenu(def, near) {
        makePopup({
            ele: 'div',
            styles: {
                background: 'lightgrey',
                border: 'solid 1px black',
                position: 'absolute',
                bottom: '55px', left: '15px',
                padding: '0px 1px'
            },
            children: [def],
            evnts: { click: function(e) { e.stopPropagation(); } }
        })
    }

    function init() {
        let image;
        try {
            image = `<img src='${chrome.extension.getURL("/resources/vector-ladybug.png")}' height="40px" width="40px" />`
        } catch (e) {
            image = '<svg fill="#000000" viewBox="-3.2 -3.2 38.40 38.40" id="icon" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.00032"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-3.2" y="-3.2" width="38.40" height="38.40" rx="19.2" fill="#ec7e7e" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;}</style></defs><title>debug</title><path d="M29.83,20l.34-2L25,17.15V13c0-.08,0-.15,0-.23l5.06-1.36-.51-1.93-4.83,1.29A9,9,0,0,0,20,5V2H18V4.23a8.81,8.81,0,0,0-4,0V2H12V5a9,9,0,0,0-4.71,5.82L2.46,9.48,2,11.41,7,12.77c0,.08,0,.15,0,.23v4.15L1.84,18l.32,2L7,19.18a8.9,8.9,0,0,0,.82,3.57L3.29,27.29l1.42,1.42,4.19-4.2a9,9,0,0,0,14.2,0l4.19,4.2,1.42-1.42-4.54-4.54A8.9,8.9,0,0,0,25,19.18ZM15,25.92A7,7,0,0,1,9,19V13h6ZM9.29,11a7,7,0,0,1,13.42,0ZM23,19a7,7,0,0,1-6,6.92V13h6Z"></path><rect class="cls-1" width="32" height="32"></rect></g></svg>'
        }
        let popupbtn = render('popup-btn', {
            ele: 'div',
            styles: {
                position: 'absolute',
                bottom: '15px',
                left: '15px',
                display: 'block',
                height: '40px',
                width: '40px',
                zIndex: 10000
            },
            children: [
                {
                    ele: 'div',
                    text: image,
                    styles: {width: '100%', height: '100%', display: 'flex'}, evnts: {
                        click: function() { makeMenu(makeMenuDef()) }
                    }
                }
            ]
        });
        document.body.appendChild(popupbtn)
    }

    init();

    try {GM_addStyle(`
        .popupbg-item {
            font-size: 0.9em;
            cursor: pointer;
            width: 100%;
            padding: 3px 8px;
        }
        .popupbg-item:hover {
            background: gray;
        }
        .popupbg-item-header {
            font-size: 0.7em;
            border-bottom: solid 1px black;
        }
    `)} catch(e) {}

    function makeMenuDef() {
        let items = getUiElems().flatMap(ui => (ui.menuItems || []));
        let groupBy = (array, key) => array.reduce((result, item) => ((result[item[key]] = result[item[key]] || []).push(item), result), {})
        let groups = groupBy(items, 'group');
        return {
            ele: 'div',
            styles: {display: 'flex', flexDirection: 'column'},
            children: Object.entries(groups).flatMap(([grpName, items]) => [
                {ele: 'div', classList: 'item-header', text: grpName},
                ...(items.map(item => ({ele: 'div', text: item.text, classList: 'item', evnts: {click: item.action}})))
            ])
        }
    }

    function update(url) {
        let uis = getUiElems(url);
        uis.flatMap(ui => (ui.snippets || [])).forEach(snippet => { try { snippet() } catch (e) {console.error(e)} })
    }

    window.navigation.addEventListener("navigatesuccess", update);


})();