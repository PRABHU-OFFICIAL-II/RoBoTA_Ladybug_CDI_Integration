let puppetTabId;
let puppetSsoUrl;
let orgInfo;
let cdgcTenantUrl;
/*
podInfo
{
  orgId
  orgName
  ssoUrl
  baseUrl
}
*/
function impersonate(podInfo) {
    orgInfo = podInfo;
    if (podInfo.afterSignInUrl) {
        if (podInfo.afterSignInUrl.includes("informaticacloud.com/tenant")) {
            cdgcTenantUrl = podInfo.afterSignInUrl;
        }
    }
    console.log("resp-podInfo " + JSON.stringify(podInfo));
    let domain = getDomain(podInfo.baseUrl);
    console.log("removing old tabs to avoid issues...");
    queryTabs({
        url: "https://*.informaticacloud.com/*",
        active: false,
    }).then((res) => {
        if (res.status == 200) {
            res.tabs.forEach((tab) => {
                if (tab.url.includes(domain)) {
                    console.log("removing " + tab.url);
                    chrome.tabs.remove(tab.id, function () { });
                }
            });
        }
    }).then(() => {
        chrome.cookies.getAll({ domain: ".informaticacloud.com" }, function (cookies) {
            for (const element of cookies) {
                if (element.domain.includes(domain) && element.name.includes("SELECTED_")) {
                    console.log("removing cookie " + element.domain + element.path + element.name);
                    chrome.cookies.remove({ url: "https://" + element.domain + element.path, name: element.name });
                }
            }
            console.log("launching sso " + podInfo.ssoUrl);
            chrome.tabs.create({ url: podInfo.ssoUrl }, function (createdTab) {
                puppetTabId = createdTab.id
                puppetSsoUrl = podInfo.ssoUrl;
            });
        });
    });
};

chrome.tabs.onUpdated.addListener(async function listen(tabId, changeInfo, tab) {
    if (((tab.url.indexOf("informaticacloud.com/cloudshell/shell/error") > -1 || tab.url.indexOf("informaticacloud.com/ma/resources/auth-error.jsp") > -1) || (tab.id === puppetTabId && tab.url.indexOf("informaticacloud.com/identity-service/acs") > -1)) && tab.status == "complete") {
        //alert("cloud ui cookie issue : " + tab.url + " loaded.");
        let bool = ((tab.url.indexOf("informaticacloud.com/cloudshell/shell/error") > -1 || tab.url.indexOf("informaticacloud.com/ma/resources/auth-error.jsp") > -1) || (tab.id === puppetTabId && tab.url.indexOf("informaticacloud.com/identity-service/acs") > -1)) && tab.status == "complete";
        let text = `\nHaving trouble...?${bool}\nClick OK to clear temporary data or Cancel to dismiss.\n`;
        let confirmed = false;
        if (confirm(text)) {
            confirmed = true;
        }
        if (confirmed) cleanup(tab).then(() => {
            confirmed = false;
            let domain = getDomain(tab.url);
            console.log("cleanup for domain: " + domain);
            if (puppetSsoUrl.length > 10) {
                chrome.tabs.update(tab.id, { url: puppetSsoUrl });
            } else {
                chrome.tabs.update(tab.id, { url: `https://${domain}/identity-service/home` });
            }
        });
    }

    if (tab.id === puppetTabId && tab.url.indexOf("informaticacloud.com/ma/form/pods") > -1 && changeInfo.status === 'complete') {
        console.log("pod loaded", JSON.stringify(changeInfo), JSON.stringify(tab));
        console.log("cdgcTenantUrl " + cdgcTenantUrl);
        if (cdgcTenantUrl) {
            chrome.tabs.create({ url: cdgcTenantUrl }, function (createdTab) {
                cdgcTenantUrl = null;
                puppetTabId = "blank";
            })
        } else {
            chrome.tabs.create({ url: `${orgInfo.baseUrl}/cloudUI/products/administer/main/organization` }, function (createdTab) {
                puppetTabId = "blank";
                puppetTabId = createdTab.id;
            });
        }

        //remove pods tab
        chrome.tabs.remove(tab.id, function () { });
    }

    if (tab.id === puppetTabId && tab.url.indexOf(".informaticacloud.com/cloudUI/products/administer/main/organization") > -1 && changeInfo.status === 'complete') {
        console.log("admin loaded", JSON.stringify(changeInfo), JSON.stringify(tab));
        if (!cdgcTenantUrl)
            chrome.tabs.sendMessage(tab.id, { type: "impersonate", info: orgInfo }, (response) => {
                console.log("impersonate msg sent" + response);
                puppetTabId = "blank";
                puppetSsoUrl = "blank";
            });
    }
});