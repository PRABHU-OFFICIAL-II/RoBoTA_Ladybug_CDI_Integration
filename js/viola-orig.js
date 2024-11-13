"use strict";
var ucases = [];
var qcases = [];
var tcases = [];
var qcount = 0;
var tcount = 0;
var ucount = 0;
var count = 0;
var irogr, qid, notifClickQ, manage;
function notifyMe() {
  if (Notification.permission !== "granted") Notification.requestPermission();
  else {
    chrome.tabs.query(
      {
        url: "https://infa.lightning.force.com/*",
      },
      function (tabs) {
        if (tabs.length != 0) {
          var tab = tabs[0];
          getMileStone(tab).then((results) => {
            if (parseInt(results.count) > 0) {
              let tmpucases = ucases;
              let tmpqcases = qcases;
              //let tmptcases = tcases;
              chrome.browserAction.setBadgeBackgroundColor({
                color: [225, 0, 0, 200],
              });
              console.log("Total Cases: " + results.count.toString());
              chrome.browserAction.setBadgeText({
                text: results.count.toString(),
              });
              //https://stackoverflow.com/questions/2271156/chrome-desktop-notification-example
              var notification = new Notification("RoBoT-A Viola", {
                icon: "https://www.informatica.com/etc/designs/informatica-com/favicon.png",
                body: "Milestone Notification Count: " + results.count.toString() + "\nUser Cases: " + ucases.length + "\nQueue Cases: " + qcases.length + "\nTeam Cases: " + tcases.length,
              });
              setStorage(ucases, qcases, tcases);
              notification.onclick = function () {
                // console.log("Notif Clicked" + myQ + gQ + bothQ);
                if (notifClickQ == "myCases") {
                  console.log("myQ: " + tmpucases.length);
                  if (tmpucases.length > 0) {
                    tmpucases.forEach((c) => {
                      window.open(`https://infa.lightning.force.com/lightning/r/Case/${c}/view`);
                    });
                  }
                } else if (notifClickQ == "QCases") {
                  console.log("gQ: " + tmpqcases.length);
                  if (tmpqcases.length > 0) {
                    tmpqcases.forEach((c) => {
                      window.open(`https://infa.lightning.force.com/lightning/r/Case/${c}/view`);
                    });
                  }
                } else if (notifClickQ == "both") {
                  console.log("bothQ: " + bothQ.length);
                  let both = tmpcases.concat(tmpqcases);
                  if (both.length > 0) {
                    both.forEach((c) => {
                      window.open(`https://infa.lightning.force.com/lightning/r/Case/${c}/view`);
                    });
                  }
                }
              };
              viola();
              ucases = [];
              qcases = [];
              tcases = [];
              qcount = 0;
              // } else if (parseInt(qcount) > 0) {
              //   chrome.browserAction.setBadgeBackgroundColor({
              //     color: "red",
              //   });
              //   chrome.browserAction.setBadgeText({
              //     text: "0+" + qcount.toString(),
              //   });
              //   qcount = 0;
              //   setStorage([], qcases);
              //   ucases = [];
              //   qcases = [];
            } else {
              chrome.browserAction.setBadgeText({
                text: "",
              });
              setStorage([], [], []);
              ucases = [];
              qcases = [];
              tcases = [];
            }
          });
        } else {
          chrome.browserAction.setBadgeText({
            text: "",
          });
          setStorage([], [], []);
        }
      }
    );
  }
}

function setStorage(u, q, t) {
  chrome.storage.sync.set(
    {
      ucases: u,
      qcases: q,
      tcases: t,
    },
    function () {
      console.log("Viola: Cases saved successfully to storage");
    }
  );
}

function getValueFromCookie(iurl, key) {
  return new Promise(function (resolve, reject) {
    chrome.cookies.get(
      {
        url: iurl.replace("lightning.force", "my.salesforce"),
        name: key,
      },
      (sessionCookie) => {
        if (!sessionCookie) {
          return;
        }
        let session = {
          key: sessionCookie.value,
          hostname: sessionCookie.domain,
        };
        resolve({
          status: 200,
          sid: sessionCookie.value,
        });
      }
    );
  });
}

function getMileStone(tab) {
  return new Promise(async function (resolve, reject) {
    let taburl = tab.url;
    let useriD = "";
    var sfdc = new URL(taburl);
    var cookie = await getValueFromCookie(taburl, "sid");
    var serverUrl = "https://" + sfdc.hostname;
    var conn = new jsforce.Connection({
      version: "51.0",
      serverUrl: serverUrl,
      sessionId: cookie.sid,
    });
    conn.identity().then(async (res) => {
      useriD = res.user_id;
      console.log("display name: " + res.display_name);
      var filter = "";
      await chrome.storage.sync.get(
        {
          iCare: "",
          iCareNot: "",
        },
        function (items) {
          filter = `or Id IN (${items.iCare.split(",").map((it) => {
            return `'${it.trim()}'`;
          })})`;
          console.log(`Care filters: ${JSON.stringify(items)}`);
          let soql0 = `SELECT FIELDS(ALL) FROM CaseMilestone WHERE CaseId IN (SELECT Id FROM Case WHERE OwnerId in (${qid.split(",").map(item => `'${item.trim()}'`).join(', ')}) AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled') AND IsCompleted = false LIMIT 200`;
          let soql = `SELECT FIELDS(ALL) FROM CaseMilestone WHERE CaseId IN (SELECT Id FROM Case WHERE (OwnerId = '${useriD}' AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled') ${filter} ) AND IsCompleted = false LIMIT 200`;
          //useriD = "0053f0000018YIB";
          let soql2 = `SELECT FIELDS(ALL) FROM CaseMilestone WHERE CaseId IN (SELECT Id FROM Case WHERE Case_Owner_Manager__c = '${useriD.substring(0, 15)}' AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled' AND Status='assess') AND IsCompleted = false AND MilestoneTypeId = '5573f000000CaTZAA0' LIMIT 200`;
          conn.query(soql0, async function (err, qres) {
            if (err) {
              reject(err);
            }
            // console.log(qres);
            qres.records.forEach(function (record) {
              let tim = record.TimeRemainingInMins.split(":")[0];
              if (parseInt(tim) < irogr) {
                if (!items.iCareNot.includes(record.CaseId)) {
                  qcount = qcount + 1;
                  qcases.push(record.CaseId + "/" + tim);
                }
              }
            });
            console.log("Viola qCount =" + qcount);
            conn.query(soql, async function (err, ires) {
              if (err) {
                reject(err);
              }
              // console.log(ires);
              ires.records.forEach(function (record) {
                let tim = record.TimeRemainingInMins.split(":")[0];
                if (parseInt(tim) < irogr) {
                  if (!items.iCareNot.includes(record.CaseId)) {
                    ucount = ucount + 1;
                    ucases.push(record.CaseId + "/" + tim);
                  }
                }
              });
              console.log("Viola uCount =" + ucount);
              // resolve({
              //   count: count,
              // });
            });
            if (manage) {
              conn.query(soql2, function (err, ires) {
                if (err) {
                  reject(err);
                }
                // console.log(ires);
                ires.records.forEach(function (record) {
                  let tim = record.TimeRemainingInMins.split(":")[0];
                  if (parseInt(tim) < irogr) {
                    //tcases.push(record.CaseId + "/" + tim);
                    if (!items.iCareNot.includes(record.CaseId)) {
                      tcount = tcount + 1;
                      tcases.push(record.CaseId + "/" + tim);
                    }
                  }
                });
                console.log("Viola tCount =" + tcount);
                resolve({
                  count: qcount + ucount + tcount,
                });
              });
            } else {
              await Promise.all(ucases);
              resolve({
                count: qcount + ucount + tcount,
              });
            }
          });
        }
      );
    });
  });
}

function viola() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://na2.ai.dm-us.informaticacloud.com/active-bpel/public/rt/dIjE3p8O2kuj9gfDoNfsuE/Ze-Violate", true);
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log("POST -> Ze-Violate -> 200 OK");
      } else {
        console.error(xhr.statusText);
      }
    }
  };
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
  };
  xhr.send(null);
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function start() {
  //clean up
  chrome.browserAction.setBadgeText({
    text: "",
  });
  let interval;
  let viola;
  chrome.storage.sync.get(
    {
      interval: "5",
      likesViola: true,
      irogr: "15",
      qid: "00G3f000000N38GEAS",
      clickQ: "myCases",
      manage: false,
    },
    async function (items) {
      interval = items.interval;
      viola = items.likesViola;
      irogr = parseInt(items.irogr);
      qid = items.qid;
      notifClickQ = items.clickQ;
      manage = items.manage;
      console.log("Extension Options: " + JSON.stringify(items));
      if (viola) {
        await sleep(1000 * 30);
        notifyMe(); // init 1st time to avoid initial delay.
        setInterval(function () {
          notifyMe();
          qcount = 0;
          ucount = 0;
          tcount = 0;
          //  }, 1000 * 60 * 0.5);
        }, 1000 * 60 * parseFloat(interval));
      }
    }
  );
}
start();
/*
https://developer.chrome.com/extensions/security
https://stackoverflow.com/questions/9899372/pure-javascript-equivalent-of-jquerys-ready-how-to-call-a-function-when-t
document.querySelectorAll("iframe#ext-comp-1005").forEach( item => item.contentWindow.document.body.querySelectorAll(".x-grid3-col-00NG000000FQuSP").forEach(function(el) { alert (el.textContent)})
 */
//https://stackoverflow.com/questions/26630519/queryselector-for-web-elements-inside-iframe
//code: 'document.querySelector("div.infaTableGridCell.infaTableGridLink.ellipses-overflow.cell-align-left").textContent'
//code: 'document.querySelectorAll("div.infaTableGridCell.infaTableGridLink.ellipses-overflow.cell-align-left")[1].forEach(function(el) { alert (el.textContent)})'
//code: 'document.querySelectorAll("iframe#ext-comp-1005").forEach( item => item.contentWindow.document.body.querySelectorAll(".x-grid3-col-00NG000000FQuSP").forEach(function(el) { alert (el.textContent)}))'
//chrome.tabs.executeScript(tab.id, {code}, counterCallBack);
// case number
// open in existing tab
//
