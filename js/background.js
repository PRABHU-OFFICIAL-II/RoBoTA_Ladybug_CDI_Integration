"use strict";
let globalSessionID;
let podx;
let master;
let selectedOrg;
let version;
let current;
let folderid;
let showContext4Pages = ["https://infa.lightning.force.com/lightning/r/Case/*"];
chrome.contextMenus.removeAll(function () {

    chrome.contextMenus.create({
        id: "RoBoT-A",
        title: "RoBoT-A",
        contexts: ["page", "selection"],
    });
    chrome.contextMenus.create({
        title: "for'CE",
        id: "forCE",
        parentId: "RoBoT-A",
        contexts: ["page", "selection"],
        documentUrlPatterns: showContext4Pages
    });
    chrome.contextMenus.create({
        title: "Case Details",
        id: "forCECase",
        parentId: "forCE",
        contexts: ["page", "selection"],
    });

    chrome.contextMenus.create({
        title: "Org Details",
        id: "forCEOrg",
        parentId: "forCE",
        contexts: ["page", "selection"],
    });
    chrome.contextMenus.create({
        title: "IICS Org Info",
        id: "maPodID",
        parentId: "RoBoT-A",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "IICS Diagon Alley",
        id: "logFetcher",
        parentId: "RoBoT-A",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "IICS Puppet III",
        id: "boringTask",
        parentId: "RoBoT-A",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "Show Products",
        id: "boringTaskApps",
        parentId: "boringTask",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "Monitor",
        id: "boringTaskMonitor",
        parentId: "boringTask",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "Data Integration",
        id: "boringTaskCDI",
        parentId: "boringTask",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "App Integration",
        id: "boringTaskCAI",
        parentId: "boringTask",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "App Integration Console",
        id: "boringTaskCAIConsole",
        parentId: "boringTask",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "Administrator",
        id: "boringTaskAdmin",
        parentId: "boringTask",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "Connections",
        id: "boringTaskAdminConn",
        parentId: "boringTaskAdmin",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "Runtime Environments",
        id: "boringTaskAdminRTEs",
        parentId: "boringTaskAdmin",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "Organization",
        id: "boringTaskOrg",
        parentId: "boringTaskAdmin",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "Data Quality & Governance",
        id: "boringTask_DQGC",
        parentId: "boringTask",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "MCC",
        id: "boringTask_DQGC_MCC",
        parentId: "boringTask_DQGC",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "CDGC",
        id: "boringTask_DQGC_CDGC",
        parentId: "boringTask_DQGC",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "CDMP",
        id: "boringTask_DQGC_CDMP",
        parentId: "boringTask_DQGC",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "CDAM",
        id: "boringTask_DQGC_CDAM",
        parentId: "boringTask_DQGC",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "Data Profiling",
        id: "boringTask_DQGC_CDP",
        parentId: "boringTask_DQGC",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "Data Quality",
        id: "boringTask_DQGC_CDQ",
        parentId: "boringTask_DQGC",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "Teams Chat",
        id: "teams",
        parentId: "RoBoT-A",
        contexts: ["page", "selection"],
        documentUrlPatterns: showContext4Pages
    });
    chrome.contextMenus.create({
        title: "with Owner",
        id: "teamsOwner",
        parentId: "teams",
        contexts: ["page", "selection"],
    });
    chrome.contextMenus.create({
        title: "with Manager",
        id: "teamsManager",
        parentId: "teams",
        contexts: ["page", "selection"],
    }); chrome.contextMenus.create({
        title: "with Co-Owner",
        id: "teamsCoOwner",
        parentId: "teams",
        contexts: ["page", "selection"],
    });
    chrome.contextMenus.create({
        title: "IICS JIRA",
        id: "jira",
        parentId: "RoBoT-A",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "IICS JIRA Search",
        id: "jiras",
        parentId: "RoBoT-A",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "IICS KB Search",
        id: "kb",
        parentId: "RoBoT-A",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "Stack Overflow Search",
        id: "sos",
        parentId: "RoBoT-A",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "Clear IICS Cookies",
        id: "cookies",
        parentId: "RoBoT-A",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "CDGC",
        id: "cdgc",
        parentId: "RoBoT-A",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "Download kibana logs",
        id: "cdgckibanalogs",
        contexts: ["selection"],
        parentId: "cdgc"
    });
    chrome.contextMenus.create({
        title: "MDM",
        id: "boringTaskMDM",
        parentId: "boringTask",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "Business 360",
        id: "boringTaskMDM_B360",
        parentId: "boringTaskMDM",
        contexts: ["selection"],
    });
    chrome.contextMenus.create({
        title: "Reference 360",
        id: "boringTaskMDM_R360",
        parentId: "boringTaskMDM",
        contexts: ["selection"],
    });
});

chrome.contextMenus.onClicked.addListener(async function (clickData) {
    if (clickData.menuItemId == "jira" && clickData.selectionText) {
        let baseurl = "https://infajira.informatica.com/browse/" + clickData.selectionText;
        window.open(sanitizeData(encodeURI(baseurl)));
    }

    if (clickData.menuItemId == "jiras" && clickData.selectionText) {
        let baseurl = 'https://infajira.informatica.com/issues/?jql=project in (CCON, POP, CLDDI, "IF", ER, CO, CTP, ICAI) AND text ~ ' + '"' + clickData.selectionText + '"';
        window.open(sanitizeData(encodeURI(baseurl)));
    }

    if (clickData.menuItemId == "kb" && clickData.selectionText) {
        let baseurl = `https://infa.lightning.force.com/lightning/cmp/c__INFAKBContentSearch?#q=${clickData.selectionText}&t=All&sort=relevancy&f:@athenaproduct=[Cloud%20Data%20Integration,Cloud%20Application%20Integration]`;
        window.open(sanitizeData(encodeURI(baseurl)));
    }

    if (clickData.menuItemId == "sos" && clickData.selectionText) {
        let baseurl = 'https://stackoverflow.com/search?q="' + clickData.selectionText + '"';
        window.open(sanitizeData(encodeURI(baseurl)));
    }

    if (clickData.menuItemId == "logFetcher" && clickData.selectionText) {
        getOrgID().then((response) => {
            console.log(response.caseNumber);
            let caseNum = response.caseNumber.split(" ")[0];
            if (!response.orgiD) {
                window.open((`https://diagonalley.informatica.com/?orgId=${clickData.selectionText}&caseNum=${caseNum}`));
            } else {
                window.open((`https://diagonalley.informatica.com/?orgId=${response.orgiD}&caseNum=${caseNum}`));
            }
        });
    }

    if (clickData.menuItemId == "forCECase") {
        getOrgID().then((response) => {
            console.log("forCECase: " + response.caseNumber);
            let caseNum = response.caseNumber.split(" ")[0];
            if (caseNum) {
                window.open(`https://force.informatica.com/force-ui/case/${caseNum}/case-details`);
            }
        });
    }

    if (clickData.menuItemId == "forCEOrg") {
        if (clickData.selectionText && clickData.selectionText.length > 20) {
            window.open(`https://force.informatica.com/force-ui/org/${clickData.selectionText}`);
        } else {
            getOrgID().then((response) => {
                console.log("forCEOrg: " + JSON.stringify(response));
                let orgId = response.orgiD;
                if (orgId) {
                    window.open(`https://force.informatica.com/force-ui/org/${orgId}`);
                }
            });
        }
    }

    if (/teams*/.test(clickData.menuItemId)) {
        chrome.tabs.query(
            { url: "https://infa.lightning.force.com/*", active: true, currentWindow: true },
            function (tabs) {
                let tabUrl = new URL(tabs[0].url)
                if (tabs.length != 0 && tabUrl.pathname.split("/")[3] == "Case") {
                    let caseId = tabUrl.pathname.split("/")[4];
                    if (clickData.menuItemId == "teamsCoOwner") {
                        sfdcQueryRunner(tabs[0], `SELECT owner.email FROM Raise_Hand__c WHERE Case__c = '${caseId}' AND Type__c  = 'Co-own'`).then((response) => {
                            if (response.totalSize == 1) {
                                window.open(`msteams:/l/chat/0/0?users=${response.records[0].Owner.Email}`);
                            } else if (response.totalSize > 1) {
                                let promptText = 'Co-Owner List:\n';
                                response.records.forEach((element, index) => {
                                    promptText += `${index + 1}. ${element.Owner.Email}\n`
                                })
                                promptText += "\nEnter Your Choice(number): ";
                                let choice = prompt(promptText);
                                if (choice != null) {
                                    let email = response.records[parseInt(choice) - 1].Owner.Email;
                                    window.open(`msteams:/l/chat/0/0?users=${email}`);
                                }
                            } else if (response.totalSize == 0) {
                                alert("No Co-Owners found!!");
                            }
                        })
                    } else {
                        sfdcQueryRunner(tabs[0], `SELECT Org_ID__c,Org__c,Case_Number__c,owner.email, Case_Owner_Manager__r.Email FROM Case WHERE Id = '${caseId}'`).then((response) => {
                            console.log("teams: " + response);
                            let email = response.records[0].Owner.Email;
                            let managerEmail = response.records[0].Case_Owner_Manager__r.Email ? response.records[0].Case_Owner_Manager__r.Email : null;
                            if (clickData.menuItemId == "teamsOwner" && email) {
                                window.open(`msteams:/l/chat/0/0?users=${email}`);
                            }
                            if (clickData.menuItemId == "teamsManager" && managerEmail) {
                                window.open(`msteams:/l/chat/0/0?users=${managerEmail}`);
                            }
                        })
                    }

                } else {
                    alert("You have to be in Salesforce");
                }
            }
        );
    }
    if (clickData.menuItemId == "maPodID" && clickData.selectionText) {
        GetPodInfo(clickData.selectionText).then((podInfo) => {
            console.log(podInfo);
            if (podInfo?.name) {
                let infoTxt = `OrgId      : ${podInfo.orgId}\nOrgName: ${podInfo.name}\nOrgType  : ${podInfo.env}\nLocation  : ${podInfo.region}/${podInfo.pod}\nBaseUrl   : ${podInfo.baseUrl}\nLoginUrl  : ${podInfo.baseUrl.replace(/\/\/[^.]*\./, '//')}/identity-service/home`;
                alert(infoTxt);
                var copyFrom = document.createElement("textarea");
                copyFrom.textContent = infoTxt;
                document.body.appendChild(copyFrom);
                copyFrom.select();
                document.execCommand("copy");
                document.body.removeChild(copyFrom);
            } else if (podInfo && podInfo?.error) {
                if (podInfo.error?.message?.includes("Region not supported"))
                    if (confirm("IICS Region not supported by RoBoT-A.\n\nClick OK to Follow Instructions at https://infawiki.informatica.com/pages/viewpage.action?pageId=518980692 to add support.\n") == true) {
                        window.open("https://infawiki.informatica.com/pages/viewpage.action?pageId=518980692");
                    }

                alert(podInfo.error);
            } else if (podInfo.fetchFailed) {
                alert("Oops! The PodInfo API took a detour. 🚧\n\nIt needs a VPN passport to get through. 🛂\n\nConnect to your VPN and try this again!");

            } else {
                alert("Internal Error.\n\nSend the following to mreddy@informatica.com\n\nselectedText: " + clickData.selectionText + "\nerror: " + JSON.stringify(podInfo));
            }
        }).catch((error) => {
            alert(error.message);
        });
    }

    if (/boringTask*/.test(clickData.menuItemId)) {
        if (clickData.selectionText) {

            function makeUrlParams(menuItemId, podInfo) {
                let appUri = '/';
                let baseUrl = podInfo.baseUrl;
                let cdgcUrl = x => baseUrl.replace(/https:\/\/[^.]*\./, 'https://' + x + '.')
                let dqdpUrl = x => baseUrl.replace('.', '-' + x + '.')

                // someone couldn't agree on a hostname format, so this doesn't work. some places have cai, some have ai
                let caiUrl = x => baseUrl.replace('.', '.' + x + '.')
                switch (menuItemId) {
                    case "boringTaskMonitor":
                        appUri = "/cloudUI/products/monitor/main/RunningJobs/di";
                        break;
                    case "boringTaskCDI":
                        appUri = "/diUI/products/integrationDesign/main/explore/allProjects";
                        break;
                    case "boringTaskCAI":
                        appUri = "dynamic_integration.cloud.group_ai.appintegration.designer";
                        break;
                    case "boringTaskCAIConsole":
                        appUri = "dynamic_integration.cloud.group_ai.appintegration.console";
                        break;
                    case "boringTaskAdminConn":
                        appUri = "/cloudUI/products/administer/main/ConnectionListWS";
                        break;
                    case "boringTaskAdminRTEs":
                        appUri = "/cloudUI/products/administer/main/runtimeEnvironments";
                    case "boringTaskOrg":
                        appUri = "/cloudUI/products/administer/main/organization";
                        break;
                    case "boringTaskMDM_B360":
                        baseUrl = dqdpUrl('mdm');
                        appUri = "/ui-config-app";
                        break;
                    case "boringTaskMDM_R360":
                        baseUrl = dqdpUrl('mdm');
                        appUri = "/rdm-ui";
                        break;
                    case "boringTask_DQGC_MCC":
                        baseUrl = cdgcUrl('mcc');
                        break;
                    case "boringTask_DQGC_CDGC":
                        baseUrl = cdgcUrl('cdgc');
                        break;
                    case "boringTask_DQGC_CDMP":
                        baseUrl = cdgcUrl('cdmp-app');
                        break;
                    case "boringTask_DQGC_CDAM":
                        baseUrl = cdgcUrl('cdam');
                        break;
                    case "boringTask_DQGC_CDP":
                        baseUrl = dqdpUrl('dqprofile');
                        appUri = "/profiling-ui/main/Explore/allProjects";
                        break;
                    case "boringTask_DQGC_CDQ":
                        baseUrl = dqdpUrl('dqcloud');
                        appUri = "/dq-product/cloud/main/dq_home";
                        break;
                    default:
                        appUri = "/cloudshell/showProducts";
                }
                return { appUri, baseUrl }
            }

            GetPodInfo(clickData.selectionText).then((podInfo) => {
                console.log(podInfo);
                if (podInfo?.name) {
                    let impInfo = { orgId: podInfo.orgId, orgName: podInfo.name, ssoUrl: podInfo.ssoUrl, ...makeUrlParams(clickData.menuItemId, podInfo) };
                    impersonate(impInfo);
                } else if (podInfo.fetchFailed) {
                    alert("Oops! The PodInfo API took a detour. 🚧\n\nIt needs a VPN passport to get through. 🛂\n\nConnect to your VPN and try this again!");

                } else if (podInfo?.error) {
                    alert(podInfo.error);
                } else {
                    alert("Not Found\n" + JSON.stringify(podInfo));
                }
            }).catch((error) => {
                alert(error.message);
            });
        }
    }

    if (clickData.menuItemId == "upgrade" && clickData.selectionText) {
        fetch(`https://na2.ai.dm-us.informaticacloud.com/active-bpel/public/rt/dIjE3p8O2kuj9gfDoNfsuE/Ze-AwesomeIICS-UpgradeCheck`)
            .then((data) => {
                return data.json();
            })
            .then((upgrdInfo) => {
                let oversion = upgrdInfo.version;
                let cversion = chrome.runtime.getManifest().version;
                console.log(`version Check. local - ${oversion} vs. new version ${cversion}`);
                if (cversion == oversion) {
                    alert("No Upgrade Detected. No ETA.");
                } else {
                    alert("Upgrade Detected.\nGet new version " + oversion + " from Tools wiki.");
                    window.open(sanitizeData("https://infawiki.informatica.com/display/GCS/PlugIn+-+RoBoT-A"));
                }
            }).catch((error) => {
                console.log(error.message);
            });
    }

    if (clickData.menuItemId == "meet" && clickData.selectionText) {
        let r = { "Id": "1234" }
        let lastKnownVersion = await getFromStorage(r.Id);
        if (!lastKnownVersion) {
            alert('not found');
        }
        chrome.storage.local.set({ [r.Id]: true });
    }

    if (clickData.menuItemId == "cdgckibanalogs" && clickData.selectionText) {
        let tid = clickData.selectionText;
        chrome.tabs.query(
            { active: true, currentWindow: true },
            (tabs) => chrome.tabs.sendMessage(tabs[0].id, { type: clickData.menuItemId, traceId: tid }, () => 0)
        );
    }

    if (clickData.menuItemId == "logManager" && clickData.selectionText) {
        let baseurl = "Awesome-Tools:\\awesome?" + clickData.selectionText;
        window.open(sanitizeData(baseurl));
    }

    if (clickData.menuItemId == "test" && clickData.selectionText) {
        let taburl = "";
        let useriD;
        function getValueFromCookie(iurl, key) {
            return new Promise(function (resolve, reject) {
                console.log("url=" + iurl);
                chrome.cookies.get({ url: iurl.replace("lightning.force", "my.salesforce"), name: key }, (sessionCookie) => {
                    if (!sessionCookie) {
                        return;
                    }
                    let session = { key: sessionCookie.value, hostname: sessionCookie.domain };
                    resolve({ status: 200, sid: session });
                });
            });
        }
        await queryTabs({
            status: "complete",
            windowId: chrome.windows.WINDOW_ID_CURRENT,
            active: true,
        }).then((res) => {
            if (res.status == 200) {
                res.tabs.forEach((tab) => {
                    console.log("url=" + tab.url);
                    taburl = tab.url;
                });
            }
        });
        let sfdc = new URL(taburl);
        let cookie = await getValueFromCookie(taburl, "sid");
        console.log("sid= " + cookie.sid, sfdc);
        let serverUrl = "https://infa.my.salesforce.com";
        let conn = new jsforce.Connection({
            version: "53.0",
            serverUrl: serverUrl,
            sessionId: cookie.sid,
        });
        conn.identity().then((res) => {
            console.log("user ID: " + res.user_id);
            useriD = res.user_id;
            console.log("organization ID: " + res.organization_id);
            console.log("username: " + res.username);
            console.log("display name: " + res.display_name);
            conn.query(
                `SELECT FIELDS(ALL) FROM CaseMilestone WHERE CaseId IN (SELECT Id FROM Case WHERE OwnerId = '${useriD}' AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled') AND IsCompleted = false LIMIT 200`,
                function (err, res) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log(res);
                }
            );
        });
        chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
            let tabUrl = new URL(tabs[0].url);
            if (tabUrl.pathname.split("/")[3] == "Case") {
                chrome.tabs.sendMessage(tabs[0].id, { type: "getLocalStorage", id: "1234" }, (response) => {
                    if (response && response.complete) {
                        alert(Object.keys(response.layout))
                        let allCases = response.layout;
                        console.log(allCases)
                        let currentCase = allCases.workspaces.filter(tab => tab.active);
                        if (currentCase.length) {
                            alert({ status: 200, caseNumber: currentCase.title });
                        }
                    }
                });
            } else {
                alert("Be in Force.com case tab.!!");
            }
        });
    }

    if (clickData.menuItemId == "cookies" && clickData.selectionText) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            console.log(JSON.stringify(tabs));
            if (tabs[0].url.indexOf("informaticacloud.com") > -1) {
                cleanup(tabs[0]);
            } else {
                alert("Please use this option from IICS Pages");
            }
        })
    }
});

function sanitizeData(input) {
    return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function cleanup(tab) {
    return new Promise(function (resolve, reject) {
        let domain = getDomain(tab.url);
        console.log("cleanup 4 tab: " + JSON.stringify(tab) + " domain: " + domain);
        chrome.tabs.query(
            {
                url: `https://*.${domain}/*`,
            },
            function (tabs) {
                if (tabs.length != 0) {
                    console.log("cleanup a tab: " + JSON.stringify(tabs));
                    tabs.forEach((tab) => {
                        console.log("cleanup tab: " + tab.id);
                        chrome.tabs.remove(tab.id, function () { });
                    });
                }
            }
        );
        chrome.cookies.getAll({ domain: ".informaticacloud.com" }, function (cookies) {
            for (const element of cookies) {
                if (element.domain.includes(domain)) {
                    chrome.cookies.remove({ url: "https://" + element.domain + element.path, name: element.name });
                }
            }
        });
    });
}

const asyncFunctionWithAwait = async (message, sender, sendResponse) => {
    console.log(" X " + JSON.stringify(message));
    let http = new XMLHttpRequest();
    http.open("HEAD", "../.moveit", false);
    http.send();
    if (http.status === 200) {
        const response = await fetch("../resources/moveItPairs.json");
        const json = await response.json();
        console.log("File exists " + JSON.stringify(json));
        sendResponse({ farewell: json, status: 200 });
    } else {
        console.log("File doesn't exists");
        sendResponse({ farewell: undefined, status: 404 });
    }
};

chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        alert(request);
        if (sender.url == 'blacklistedWebsite')
            return;
        console.log("Content script received message: " + JSON.stringify(request));
        if (request.greeting == 'puppet') {
            puppet2(request.orgInfo, request.orgId);
            sendResponse({ success: true, status: 200 });
        }
    });

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    let orgId = "empty";
    if (message.greeting == "hello") {
        chrome.tabs.query(
            {
                url: "https://informatica.my.salesforce.com/*",
            },
            function (tabs) {
                if (tabs.length != 0) {
                    let tab = tabs[0];
                    refreshListButton(tab.id);
                    const code = `(function getOrgId() {
        let orgId="empty";
        let tit=document.querySelectorAll("li.x-tab-strip-active > a > em span.tabText")[0].textContent;
        let xpe='//div[@id="00N4A00000EouPm_ileinner"]/a[2][contains(text(),'+'"'+tit.trim()+'")]';
        //alert(xpe);
        document.querySelectorAll("iframe.x-border-panel").forEach(function(item) {
        let doc = item.contentWindow.document;
        let xpathResult = doc.evaluate(xpe, doc, null, XPathResult.ANY_TYPE, null);
        let s = new XMLSerializer();
        while ((n = xpathResult.iterateNext())) {
            let iFrameList=item.contentWindow.document.body.querySelectorAll(".dataCol.last.col02.inlineEditWrite");//.dataCol.last.col02.inlineEditWrite
            orgId=iFrameList[0].textContent;
            //alert("casesssss"+s.serializeToString(n));
            //alert("orgId~"+orgId);
        }
        
      })
      return {orgId};
    })()`;
                    let delay = (function () {
                        let timer = 0;
                        return function (callback, ms) {
                            clearTimeout(timer);
                            timer = setTimeout(callback, ms);
                        };
                    })();
                    delay(function () {
                        chrome.tabs.executeScript(
                            tab.id,
                            {
                                code,
                            },
                            function (results) {
                                orgId = results[0].orgId;
                            }
                        );
                    }, 500);
                }
            }
        );
        sendResponse({
            farewell: orgId,
        });
    }
    if (message.greeting == "hellox") await asyncFunctionWithAwait(message, sender, sendResponse);
    if (message.greeting == "puppet") {
        let podInfo = {
            orgId: message.orgDetails.orgId,
            orgName: message.orgDetails.name,
            baseUrl: message.podInfo.baseUrl,
            ssoUrl: message.podInfo.ssoUrl,
            appUri: "/cloudshell/showProducts",
            afterSignInUrl: message.afterSignInUrl
        }
        impersonate(podInfo);
        sendResponse({ installed: true, status: 200 });
    }
    if (message.greeting == "forCE") {
        sendResponse({ isInstalled: true, extensionId: chrome.runtime.id });
    }
    return Promise.resolve("Dummy response to keep the console quiet");
});

function getDomain(url) {
    let tokens = new URL(url).hostname.split(".");
    return tokens.splice(tokens.length - 3, 3).join(".");
}

async function GetPodInfo(iOrgId) {
    try {
        let response = await fetch(`http://resolusense-os.informatica.com/idmc-proxy/api/v1/getpodinfo/${iOrgId.trim()}`);
        if (response.status === 400) {
            console.error('Bad Request: Check the iOrgId and try again.');
            return { error: `Is this ${iOrgId} org Id correct? It seems a little suspicious!!` };
        } else if (response.status === 404) {
            console.error('Not Found: The resource was not found.');
            return { error: `Looks like the DBA took a vacation and org ${iOrgId} was not found in for'CE. Better luck next time!!` };
        } else if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let podInfo = await response.json();
        return podInfo;
    } catch (error) {
        if (error.name === 'TypeError') {
            console.error('Fetch error: Possible connectivity issue', error);
            return { fetchFailed: true };
        } else {
            console.error('Fetch error:', error);
            return { error: 'An unexpected error occurred' };
        }
    }
}




if (chrome.runtime.id) {
    let updateTabRetryCount = 0;
    const getUpdatedURL = function () {
        let updatedURL = chrome.extension.getURL('./html/changes.html');
        console.log(updatedURL);
        return updatedURL;
    };
    const waitForUserAction = function () {
        chrome.tabs.onCreated.removeListener(waitForUserAction);
        setTimeout(() => {
            updateTabRetryCount += 1;
            // eslint-disable-next-line no-use-before-define
            openUpdatedPage();
        }, 10000); // 10 seconds
    };
    const openUpdatedPage = function () {
        const updatedURL = getUpdatedURL();
        console.log(updatedURL);
        chrome.tabs.create({ url: updatedURL });
    };
    const shouldShowUpdate = function () {
        const checkQueryState = function () {
            chrome.idle.queryState(30, function (state) {
                if (state === "active") {
                    openUpdatedPage();
                } else {
                    chrome.tabs.onCreated.removeListener(waitForUserAction);
                    chrome.tabs.onCreated.addListener(waitForUserAction);
                }
            });
        };
        checkQueryState();
    };
    // Display updated page after each update
    chrome.runtime.onInstalled.addListener(async (details) => {
        //let { lastKnownVersion } = await chrome.storage.local.get(['last_known_version']); 
        let lastKnownVersion = await getFromStorage('last_known_version');
        let currentVersion = chrome.runtime.getManifest().version;
        if (!lastKnownVersion) {
            lastKnownVersion = '2023.01.10';
        }
        const compareDates = (d1, d2) => {
            return (new Date(d1).getTime() < new Date(d2).getTime());
        };

        let somethingNew = compareDates(lastKnownVersion, currentVersion);
        lastKnownVersion = lastKnownVersion.replaceAll('.', '-');
        currentVersion = currentVersion.replaceAll('.', '-');
        console.log('Last known version: ' + lastKnownVersion + " Current version: " + currentVersion + " Details: " + JSON.stringify(details) + " somethingNew : " + somethingNew);
        if ((details.reason === 'update' || details.reason === 'install') && somethingNew) {
            shouldShowUpdate();
        }
        chrome.storage.local.set({ ['last_known_version']: chrome.runtime.getManifest().version });
    });
}

function getFromStorage(sKey) {
    return new Promise(function (resolve, reject) {
        chrome.storage.local.get(sKey, function (items) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError.message);
            } else {
                resolve(items[sKey]);
            }
        });
    });
}
