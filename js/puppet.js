let ssoUrl = "";
let baseUrl = "";
let podId = "";
let IDS_SESSIONID = "";
let looper = "true";
let ids_session = 0;
let usr_session = 0;
let domain = ".informaticacloud.com";
let pod = "";
let orgHost = "";
let loggedin = false;

window.puppet = function puppet(orgiD) {
  return new Promise(async function (resolve, reject) {

    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function getSsoUrl() {
      await fetch(`http://resolusense-os.informatica.com/idmc-proxy/api/v1/getpodinfo/${orgiD}`)
        .then((response) => {
          if (response.status === 400) {
            console.error('Bad Request: Check the iOrgId and try again.');
            return { error: `Is this ${orgiD} org Id correct? It seems a little suspicious!!` };
          } else if (response.status === 404) {
            console.error('Not Found: The resource was not found.');
            return { error: `Looks like the DBA took a vacation and org ${orgiD} was not found in for'CE. Better luck next time!!` };
          } else if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((podInfo) => {
          if (podInfo?.error) {
            alert(podInfo.error);
          } else {
            console.log("ssoUrl " + podInfo.ssoUrl);
            ssoUrl = podInfo.ssoUrl;
            podId = podInfo.pod;
            baseUrl = podInfo.baseUrl;
            pod = baseUrl.split("//")[1].split(".")[1];
            if (podInfo.name == "NotFound") {
              let info = `Org Info:-\nId: ${podInfo.orgId}\nName: ${podInfo.name}\nPod: ${podInfo.baseUrl.split("//")[1].replace(".informaticacloud.com", "")}`;
              alert(info);
              return;
            }
            console.log("Pod Info -> " + podInfo);
            orgHost = baseUrl.toLowerCase();
          }
        }).catch((error) => {
          console.error('Fetch error:', error);
          alert("Oops! The PodInfo API took a detour. 🚧\n\nIt needs a VPN passport to get through. 🛂\n\nConnect to your VPN and try this again!");
        });
    }

    async function checkCookie() {
      return new Promise((resolve, reject) => {
        domain = pod + ".informaticacloud.com";
        console.log("cookie domain " + domain);
        chrome.cookies.getAll(
          {
            domain: domain,
          },
          function (cookies) {
            let length = cookies.length;
            let loop = 0;
            // if (length <= 0) {
            cookies.forEach((a) => {
              loop += 1;
              if (a["domain"] == domain) {
                if (a["name"] == "IDS-SESSION") {
                  ids_session = 1;
                  IDS_SESSIONID = a["value"];
                  console.log("IDS-SESSION -> " + a["value"]);
                  //chrome.cookies.remove({ url: "https://" + a.domain + a.path, name: a.name });
                }
                if (a["name"] == "USER_SESSION") {
                  USER_SESSIONID = a["value"];
                  usr_session = 1;
                  console.log("USER_SESSION -> " + a["value"]);
                  //chrome.cookies.remove({ url: "https://" + a.domain + a.path, name: a.name });
                }
              }
            });
            if (loop == length) resolve();
            //   } else {
            //     reject();
            //   }
          }
        );
      });
    }

    async function waitforLogin() {
      return new Promise(async function (resolve, reject) {
        while (looper) {
          await queryTabs({
            url: "https://informatica.okta.com/login/login.htm*" + ssoUrl.split("/")[ssoUrl.split("/").length - 1],
          }).then((res) => {
            if (res["status"] == 200) {
              //alert(data['tabs'][0].id);
              //alert('200 ' + looper);
            }
            if (res["status"] == 400) {
              looper = false;
              //alert('200 ' + looper);
              resolve({
                status: 200,
              });
            }
          });
          if (looper) {
            await sleep(10000).then(() => {
              alert("Please login to Okta to Proceed with BoringTask!");
            });
          }
          //alert('in while');
        }
      });
    }

    // Everything Starts from here ...
    if (ssoUrl == "") await getSsoUrl();
    await checkCookie().then(async () => {
      if (ids_session == 1 || usr_session == 1) {
        let response = await fetch(orgHost + "/session-service/api/v1/session/User", {
          headers: {
            accept: "application/json, text/javascript, */*; q=0.01",
            xsrf_token: "dBwWXbigWAteNx7I09h34Z",
            "IDS-SESSION-ID": IDS_SESSIONID,
          },
          method: "GET",
        });
        let out = await response.text();
        if ((response.status === 200) & out.includes("sessionExpireTime")) {
          let outJson = JSON.parse(out);
          if (outJson.effectiveRoles["Support Engineer"]) {
            console.log("Same Session can be continued...");
            loggedin = true;
          } else {
            console.log("Same Session can't be continued... removing Cookies -> " + JSON.stringify(outJson.effectiveRoles));
            console.log("domain ", domain);
            chrome.cookies.remove({
              url: "https://" + domain + "/identity-service",
              name: "IDS-SESSION",
            });
            chrome.cookies.remove({
              url: "https://" + domain + "/",
              name: "USER_SESSION",
            });
            console.log("removeing old tabs to avoid issue...");
            queryTabs({
              url: "https://*.informaticacloud.com/*",
              active: false,
            }).then((res) => {
              if (res.status == 200) {
                res.tabs.forEach((tab) => {
                  chrome.tabs.remove(tab.id, function () { });
                });
              }
            });
          }
        } else if (out.includes("Pods")) {
          console.log("Same Session can be continued... html pods response rcvd.");
          loggedin = true;
        } else {
          console.log("Same Session can't be continued... removing Cookies -> " + JSON.stringify(out));
          chrome.cookies.remove({
            url: "https://" + domain + "/identity-service",
            name: "IDS-SESSION",
          });
          chrome.cookies.remove({
            url: "https://" + domain + "/",
            name: "USER_SESSION",
          });
          console.log("removeing old tabs to avoid issue...");
          queryTabs({
            url: "https://*.informaticacloud.com/*",
            active: false,
          }).then((res) => {
            if (res.status == 200) {
              res.tabs.forEach((tab) => {
                chrome.tabs.remove(tab.id, function () { });
              });
            }
          });
        }
      }
    });

    let orgUrl = orgHost + "/cloudUI/products/administer/main/orgs";
    console.log("loggedIn? :" + loggedin);
    if (loggedin) {
      console.log("About to open & inject code into Admin page " + orgUrl);
      openInjectAdmin(orgUrl, orgiD);
    } else {
      if (podId.includes(".404")) return;
      openTabs(sanitizeData(ssoUrl), "url", `https://${pod}.informaticacloud.com/ma/form/pods`).then((res) => {
        if (res.status == 200) {
          ssoUrl = "";
          waitforLogin().then(() => {
            console.log("About to open & inject code into Admin page " + orgUrl);
            openInjectAdmin(orgUrl, orgiD).then((results) => {
              resolve(results);
              queryTabs({
                url: `https://${pod}.informaticacloud.com/ma/form/pods`,
                active: false,
              }).then((res) => {
                if (res.status == 200) {
                  res.tabs.forEach((tab) => {
                    //console.log(`closing ${tab.url}`);
                    chrome.tabs.remove(tab.id, function () { });
                  });
                }
              });
            });
          });
        }
      });
    }
  });
};

window.puppet2 = function puppet2(orgInfo, orgId) {
  if (orgInfo && orgInfo.id) {
    console.log("puppet2: ", orgInfo.id);
    podId = orgInfo.baseUrl.split("//")[1];
    pod = orgInfo.baseUrl.split("//")[1].split(".")[1];
    ssoUrl = orgInfo.ssoUrl;
    baseUrl = orgInfo.baseUrl;
    orgHost = baseUrl.toLowerCase();;
    puppet(orgId);
  }

};

function queryTabs(options) {
  return new Promise(function (resolve, reject) {
    chrome.tabs.query(options, function (tabs) {
      console.log("Query with -> " + JSON.stringify(options));
      if (tabs.length != 0) {
        resolve({ status: 200, tabs: tabs });
      } else {
        resolve({
          status: 400,
        });
      }
    });
  });
}

function sendMessagePromise(tabId) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { type: "wait" }, (response) => {
      if (response && response.complete) {
        resolve();
      } else {
        reject("Something wrong");
      }
    });
  });
}

function openTabs(url, ctype, cvalue) {
  return new Promise(function (resolve, reject) {
    chrome.tabs.create(
      {
        url: url,
      },
      function (createdTab) {
        if (ctype == "id") {
          chrome.tabs.onUpdated.addListener(function isCompleted(tabId, changeInfo, tab) {
            if (tab.id == createdTab.id && changeInfo.status == "complete") {
              console.log("Page : " + tab.url + " loaded.");
              // chrome.tabs.executeScript(res.tabs[0].id, {
              //   code,
              // });
              chrome.tabs.onUpdated.removeListener(isCompleted);
              resolve({
                status: 200,
                tabs: tab,
              });
            }
          });
        }
        if (ctype == "url") {
          //console.log("Url Based Listener. URL :" + cvalue);
          chrome.tabs.onUpdated.addListener(function isCompleted(tabId, changeInfo, tab) {
            if (tab.url == cvalue && changeInfo.status == "complete") {
              console.log("Page : " + tab.url + " loaded.");
              chrome.tabs.onUpdated.removeListener(isCompleted);
              resolve({
                status: 200,
                tabs: tab,
              });
            }
          });
        }
      }
    );
  });
}

function openInjectAdmin(orgUrl, orgiD) {
  return new Promise(async function (resolve, reject) {
    let htmlId = "div.infaWSContentBodyOuter.ui-infa-panel-outer.hasDesc > div.infaWSContentBody.ui-infa-panel.orgsListTable > div > div > div.infaTableHeader > div > div.infaTableButtonSet > div.infaTableBtn.infaTextBox.hasClearBtn > input";
    const code = `(function getCount() {

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    sleep(2000).then(() => {
        console.log("sleep 1");
        document.querySelector("${htmlId}").value = '${orgiD}';
        console.log("sleep 1 "+ document.querySelector("${htmlId}"));
        const text = 'pasted text';
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('text', text);
        const event = new ClipboardEvent('paste', {
            clipboardData: dataTransfer,
            bubbles: true
        });
        const elemen = document.querySelector('${htmlId}');
        elemen.dispatchEvent(event);
        sleep(4000).then(() => {
            let eleme = document.querySelector("#row0idgr1 > div:nth-child(2) > div")
            let ev1 = new MouseEvent("mousedown", {
                bubbles: true,
                cancelable: false,
                view: window,
                button: 2,
                buttons: 2,
                clientX: eleme.getBoundingClientRect().x,
                clientY: eleme.getBoundingClientRect().y
            });
            eleme.dispatchEvent(ev1);
            let ev2 = new MouseEvent("mouseup", {
                bubbles: true,
                cancelable: false,
                view: window,
                button: 2,
                buttons: 0,
                clientX: eleme.getBoundingClientRect().x,
                clientY: eleme.getBoundingClientRect().y
            });
            eleme.dispatchEvent(ev2);
            let ev3 = new MouseEvent("contextmenu", {
                bubbles: true,
                cancelable: false,
                view: window,
                button: 2,
                buttons: 0,
                clientX: eleme.getBoundingClientRect().x,
                clientY: eleme.getBoundingClientRect().y
            });
            eleme.dispatchEvent(ev3);
            sleep(3000).then(() => {
                let set = document.getElementsByClassName('voice');
                let evt = document.createEvent("MouseEvents");
                evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                set[0].dispatchEvent(evt);
                sleep(2000).then(() => {
                    let setq = document.querySelector("#setOrg1 > button > div > span")
                        let evt2 = document.createEvent("MouseEvents");
                    evt2.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    setq.dispatchEvent(evt);
                })
            })
        })
      })
    })()`;

    console.log("removeing old tabs to avoid issue...");
    await queryTabs({
      url: "https://*.informaticacloud.com/*",
      active: false,
    }).then(async (res) => {
      console.log("query stat: " + res.status);
      if (res.status == 200) {
        res.tabs.forEach((tab) => {
          chrome.tabs.remove(tab.id, function () { });
        });
      }

      await openTabs(orgUrl, "id", "").then(() => {
        queryTabs({
          url: orgUrl,
          currentWindow: true,
        }).then((res) => {
          console.log("B4 Inject" + JSON.stringify(res));
          if (res.status == 200) {
            chrome.tabs.onUpdated.addListener(function setInput(tabId, changeInfo, tab) {
              console.log("Listener " + tab.url + " " + tab.status);
              if (tab.url == orgUrl && tab.status == "complete") {
                console.log("onUpdated : " + tab.url + " loaded.");
                chrome.tabs.onUpdated.removeListener(setInput);
                sendMessagePromise(res.tabs[0].id)
                  .then(() => {
                    console.log("About to exec code in Admin Page");
                    chrome.tabs.executeScript(
                      res.tabs[0].id,
                      {
                        code,
                      },
                      function (results) {
                        resolve(results);
                      }
                    );
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              }
            });
          }
        });
      });
    });
  });
}

function makeRequest(method, url) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onload = function () {
      if (this.status == 200 && this.readyState == 4) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    };
    xhr.send();
  });
}

async function waitForSearch(tabId) {
  return new Promise(async (resolve) => {
    let found = false;
    let count = 0;
    let type = "";
    while (!found) {
      console.log("wait.............");
      count = count + 1;
      //let code = `return document.querySelector("${htmlId}");`;
      let code = `
          (function getMax() {
              let max=document.querySelector('div.infaTableBtn.infaTextBox.hasClearBtn > input').maxLength;
              console.log(max);
              if(max!=200){max=0;}
              return {max};})()`;
      chrome.tabs.executeScript(
        tabId,
        {
          code,
        },
        function (results) {
          console.log(JSON.stringify(results));
          type = results[0].max;
        }
      );
      if (type == 200) {
        console.log("found search box...");
        found = true;
        resolve({
          status: 200
        });
      }
      // if (count == 10) {
      //   console.log("break.............");
      //   return resolve();
      // }
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request)
  if (request.type == 'LADYBUG_EX') {
    if (request.cod == 'COOKIE') {
      chrome.cookies.getAll(
        { domain: request.domain, name: request.name },
        function (cookies) {
          const event = new CustomEvent('LADYBUG_BG', { detail: { cookies } });
          document.dispatchEvent(event);
        }
      )
    }
  }
});
