"use strict";
let ucases = [];
let qcases = [];
let tcases = [];
let qcount = 0;
let tcount = 0;
let ucount = 0;
let count = 0;
let prod = true;
let qkase = {}, qkases = [];
let tkase = {}, tkases = [];
let ukase = {}, ukases = [];
let irogr, qid, notifClickQ, manage, moveit, moveQ, moveitPairs, conn, mention, Notifications, whoami;
function notifyMe() {
  if (Notification.permission !== "granted") Notification.requestPermission();
  else {
    let qurl = "https://infa.lightning.force.com/*";
    if (!prod) {
      qurl = "https://informatica--uat.my.salesforce.com/*";
    }
    chrome.tabs.query(
      {
        url: qurl,
      },
      function (tabs) {
        if (tabs.length != 0) {
          let tab = tabs[0];
          getMileStone(tab).then((results) => {
            if (parseInt(results.count) > 0) {
              let tmpucases = ukases;
              let tmpqcases = qkases;
              //let tmptcases = tcases;
              chrome.browserAction.setBadgeBackgroundColor({
                color: [225, 0, 0, 200],
              });
              console.log("Total Cases: " + results.count.toString());
              chrome.browserAction.setBadgeText({
                text: results.count.toString(),
              });
              setStorage(ukases, qkases, tkases);
              if (Notifications) {
                //https://stackoverflow.com/questions/2271156/chrome-desktop-notification-example
                let notification = new Notification("RoBoT-A Viola", {
                  icon: "https://www.informatica.com/etc/designs/informatica-com/favicon.png",
                  body: "Milestone Notification Count: " + results.count.toString() + "\nUser Cases: " + ukases.length + "\nQueue Cases: " + qkases.length + "\nTeam Cases: " + tkases.length,
                });

                notification.onclick = function () {
                  // console.log("Notif Clicked" + myQ + gQ + bothQ);
                  if (notifClickQ == "myCases") {
                    console.log("myQ: " + tmpucases.case.length);
                    if (tmpucases.case.length > 0) {
                      tmpucases.case.forEach((c) => {
                        window.open(`https://infa.lightning.force.com/lightning/r/Case/${c.CaseId}/view`);
                      });
                    }
                  } else if (notifClickQ == "QCases") {
                    console.log("gQ: " + tmpqcases.length);
                    if (tmpqcases.case.length > 0) {
                      tmpqcases.case.forEach((c) => {
                        window.open(`https://infa.lightning.force.com/lightning/r/Case/${c.CaseId}/view`);
                      });
                    }
                  } else if (notifClickQ == "both") {
                    console.log("bothQ: " + bothQ.length);
                    let both = tmpcases.concat(tmpqcases);
                    if (both.length > 0) {
                      both.case.forEach((c) => {
                        window.open(`https://infa.lightning.force.com/lightning/r/Case/${c.CaseId}/view`);
                      });
                    }
                  }
                };
              }
              let d = {
                "type": "Viola", "id": results.count.toString(), "extra": "na"
              }
              viola(d);
              qkases = [];
              ukases = [];
              tkases = [];
              qcount = 0;
            } else {
              chrome.browserAction.setBadgeText({
                text: "",
              });
              setStorage([], [], []);
              qkases = [];
              ukases = [];
              tkases = [];
            }
            if (moveit && moveQ.records.length > 0) {
              console.log("Checking for Cases to move");
              let looper = 0;
              moveitPairs.pairs.forEach((pair) => {
                pair[0].split(',').forEach((keywrd) => {
                  //alert(keywrd);
                  let qname = pair[1].split('/')[0];
                  let qid = pair[1].split('/')[1];
                  let index;
                  //console.log(moveQ.records);
                  moveQ.records.forEach(async (r) => {
                    let error = (r.Error_Message__c ? r.Error_Message__c : '').toLowerCase();
                    // if (r.Description.toLowerCase().includes(keywrd.toLowerCase()) || r.Subject.toLowerCase().includes(keywrd.toLowerCase()) || error.includes(keywrd.toLowerCase())) {
                    if (r.Description.toLowerCase().includes(keywrd.toLowerCase()) || r.Subject.toLowerCase().includes(keywrd.toLowerCase())) {
                      if (!await getFromStorage(r.Id)) {
                        chrome.storage.local.set({ [r.Id]: true });
                        console.log("Moveit match -> case:" + r.Id + " " + " key:" + keywrd.toLowerCase() + " Q:" + pair[1]);
                        //Moveit -- DR -- DR -- DR -- DR -- DR -- DR -- DR -- DR -- DR
                        console.log("Moveit Count:" + looper)
                        //Don't move more than 3 once
                        //if (looper >= 3) return;
                        index = moveQ.records.map(item => item.CaseNumber).indexOf(r.CaseNumber);
                        let optionHeader = { headers: { 'SForce-Auto-Assign': 'FALSE' } };
                        conn.sobject('Case').update({
                          Id: r.Id,
                          OwnerId: qid
                        }, optionHeader, function (err, res) {
                          if (err) { console.log("Case Moveit Error: " + err) }
                          if (res) {
                            looper++;
                            new Notification("RoBoT-A Moveit", {
                              icon: "https://www.informatica.com/etc/designs/informatica-com/favicon.png",
                              body: `${r.CaseNumber} Moved to ${qname} as the case is related to ${keywrd.toLowerCase()}`,
                            });
                            console.log("Case Moveit Success: " + r.CaseNumber);
                            let d = {
                              "type": "MoveIt", "id": r.CaseNumber, "extra": qname
                            }
                            viola(d);
                          }
                          conn.chatter.resource('/feed-elements').create({
                            body: {
                              messageSegments: [{
                                type: 'Text',
                                text: `'Moved to ${qname} as the case is related to ${keywrd.toLowerCase()}. (This case is moved by automation, if unrelated to your product, please Accept to change state and move back to Cloud Queue)'`
                              }]
                            },
                            feedElementType: 'FeedItem',
                            subjectId: r.Id,
                          }, function (err, result) {
                            if (err) {
                              console.log("chatter error: " + err);
                              let d = {
                                "type": "Chatter", "id": "error", "extra": err.message ? err.message : "error"
                              }
                              viola(d);
                            }
                            let d = {
                              "type": "Chatter", "id": result.id, "extra": encodeURI(result.capabilities.comments.page.currentPageUrl)
                            }
                            viola(d);
                            console.log("Id: " + result.id);
                            console.log("URL: " + result.url);
                            console.log("Body: " + result.body.messageSegments[0].text);
                            console.log("Comments URL: " + result.capabilities.comments.page.currentPageUrl);
                          });
                          //https://developer.salesforce.com/docs/atlas.en-us.chatterapi.meta/chatterapi/quickreference_post_feed_item.htm
                          //https://jsforce.github.io/document/#chatter-api
                          // let commentObj = 'CaseComment';
                          // if (prod) {
                          //   commentObj = "Case_Comment__c"
                          // }
                          // console.log("comment RID:" + r.Id)
                          // conn.sobject(commentObj).create({
                          //   Case__c: r.Id,
                          //   Case__r: { type: 'Case__c', Id: `'${r.Id}'` },
                          //   Comment__c: `Moved to ${qname} as the case is related to ${keywrd.toLowerCase()}`,
                          //   Comment_to_Search__c: `Moved to ${qname} as the case is related to ${keywrd.toLowerCase()}`,
                          //   Visibility__c: 'Internal'
                          //   //CommentBody: `Moved to ${qname} as the case is related to ${keywrd.toLowerCase()}`,
                          //   //ParentId: r.Id,
                          //   //OwnerId:Owner=Id
                          // }, function (err, res) {
                          //   if (err) { console.log("Case Moveit Comment Error: " + err) }
                          //   if (res) {
                          //     console.log("Case Comment Update Success for " + r.CaseNumber + ' id: ' + res.Id);
                          //   }
                          // })
                        })
                        //remove processed case
                        moveQ.records.splice(index, 1);
                      }
                    }
                  })
                })
              })
              moveQ = {};
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
function setStorage(u, q, t) {
  chrome.storage.sync.set(
    {
      ukases: u,
      qkases: q,
      tkases: t,
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

function fetchFromSOQL(conn, soql) {
  return new Promise(async function (resolve, reject) {
    let records = [];
    let query = conn
      .query(soql)
      .on("record", function (record) {
        records.push(record);
      })
      .on("end", function () {
        // console.log("total in database : " + query.totalSize);
        // console.log("total fetched : " + query.totalFetched);
        resolve({
          count: count,
          records: records,
        });
      })
      .on("error", function (err) {
        console.error(err);
        reject(err);
      })
      .run({ autoFetch: true, maxFetch: 4000 });
  });
}
function getMileStone(tab) {
  return new Promise(async function (resolve, reject) {
    let taburl = tab.url;
    let useriD = "";
    let sfdc = new URL(taburl);
    let cookie = await getValueFromCookie(taburl, "sid");
    let serverUrl = "https://infa.my.salesforce.com";
    conn = new jsforce.Connection({
      version: "53.0",
      serverUrl: serverUrl,
      sessionId: cookie.sid,
    });
    conn.identity().then(async (res) => {
      useriD = res.user_id;
      console.log("display name: " + res.display_name);
      let filter = "";
      await chrome.storage.sync.get(
        {
          iCare: "",
          iCareNot: "",
        },
        async function (items) {
          filter = `or Id IN (${items.iCare.split(",").map((it) => {
            return `'${it.trim()}'`;
          })})`;
          console.log(`Care filters: ${JSON.stringify(items)}`);
          let soqlQ = `SELECT Case.Priority,Case.Support_Account__r.GCS_Segment__c,Case.CaseNumber,FIELDS(ALL) FROM CaseMilestone WHERE CaseId IN (SELECT Id FROM Case WHERE OwnerId in (${qid.split(",").map(item => `'${item.trim()}'`).join(', ')}) AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled') AND IsCompleted = false LIMIT 200`;
          let soqlU = `SELECT Case.Priority,Case.Support_Account__r.GCS_Segment__c,Case.CaseNumber,FIELDS(ALL) FROM CaseMilestone WHERE CaseId IN (SELECT Id FROM Case WHERE (OwnerId = '${useriD}' AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled') ${filter} ) AND IsCompleted = false LIMIT 200`;
          useriD = "0053f0000018YIB";
          let soqlT = `SELECT Case.Priority,Case.Support_Account__r.GCS_Segment__c,Case.CaseNumber,FIELDS(ALL) FROM CaseMilestone WHERE CaseId IN (SELECT Id FROM Case WHERE Case_Owner_Manager__c = '${useriD.substring(0, 15)}' AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled' AND Status='assess') AND IsCompleted = false AND MilestoneTypeId = '5573f000000CaTZAA0' LIMIT 200`;
          let soqlM = `SELECT Case.CaseNumber,id,Description,Error_Message__c,Subject FROM Case WHERE OwnerId in (${qid.split(",").map(item => `'${item.trim()}'`).join(', ')}) AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled' AND Status='New'`
          //let soqlM = `SELECT id,Description,Subject FROM Case WHERE CaseNumber='02870082' AND OwnerId = '00GG00000033KgQMAU'`
          let soqlmention = "SELECT Body,IsRichText,ParentId,Type FROM CaseFeed WHERE ParentId = '5006S00001vHU2dQAG' AND Visibility = 'InternalUsers'";
          moveQ = await fetchFromSOQL(conn, soqlM);
          let qRes, uRes;
          qRes = uRes = {};
          if (prod) { qRes = await fetchFromSOQL(conn, soqlQ); }
          if (prod) { uRes = await fetchFromSOQL(conn, soqlU); }
          //let mentionres = await fetchFromSOQL(conn, soqlmention);
          //console.log("MoveIt Total=" + moveQ.records.length);
          if (manage) {
            let tRes = await fetchFromSOQL(conn, soqlT);
            tRes.records.forEach(function (record) {
              let tim = record.TimeRemainingInMins.split(":")[0];
              if (parseInt(tim) < irogr) {
                //tcases.push(record.CaseId + "/" + tim);
                if (!items.iCareNot.includes(record.CaseId)) {
                  tcount = tcount + 1;
                  tkase.CaseId = record.CaseId;
                  tkase.CaseNumber = record.Case.CaseNumber;
                  tkase.GCS_Segment__c = record.Case.Support_Account__r.GCS_Segment__c;
                  tkase.Priority = record.Case.Priority;
                  tkase.tim = tim;
                  tkases.push({ "case": tkase });
                  tkase = {};
                  //tcases.push(record.CaseId + "/" + tim + "/" + record.Case.CaseNumber + "/" + record.Case.Support_Account__r.GCS_Segment__c + "/" + record.Case.Priority);
                }
              }
            });
            console.log("Viola tCount =" + tcount);
          }
          if (prod)
            qRes.records.forEach(function (record) {
              let tim = record.TimeRemainingInMins.split(":")[0];
              if (parseInt(tim) < irogr) {
                if (!items.iCareNot.includes(record.CaseId)) {
                  qkase.CaseId = record.CaseId;
                  qkase.CaseNumber = record.Case.CaseNumber;
                  qkase.GCS_Segment__c = record.Case.Support_Account__r.GCS_Segment__c;
                  qkase.Priority = record.Case.Priority
                  qkase.tim = tim;
                  qkases.push({ "case": qkase });
                  qkase = {};
                  qcount = qcount + 1;
                  // qcases.push(record.CaseId + "/" + tim + "/" + record.Case.CaseNumber + "/" + record.Case.Support_Account__r.GCS_Segment__c + "/" + record.Case.Priority);
                  if (mention == "yes") {
                    //logic
                  }
                }
              }
            });
          if (prod)
            uRes.records.forEach(function (record) {
              let tim = record.TimeRemainingInMins.split(":")[0];
              if (parseInt(tim) < irogr) {
                if (!items.iCareNot.includes(record.CaseId)) {
                  ucount = ucount + 1;
                  ukase.CaseId = record.CaseId;
                  ukase.CaseNumber = record.Case.CaseNumber;
                  ukase.GCS_Segment__c = record.Case.Support_Account__r.GCS_Segment__c;
                  ukase.Priority = record.Case.Priority;
                  ukase.tim = tim;
                  ukases.push({ "case": ukase });
                  ukase = {};
                  //ucases.push(record.CaseId + "/" + tim + "/" + record.Case.CaseNumber + "/" + record.Case.Support_Account__r.GCS_Segment__c + "/" + record.Case.Priority);
                }
              }
            });
          console.log("Viola qCount =" + qcount);
          console.log("Viola uCount =" + ucount);
          console.log("Viola tCount =" + tcount);
          console.log("Viola impl " + JSON.stringify(qkases));
          console.log("Viola implt " + JSON.stringify(tkases));
          console.log("Viola implu " + JSON.stringify(ukases));
          resolve({
            count: qcount + ucount + tcount,
          });
        }
      );
    });
  });
}

function viola(d) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", `https://na2.ai.dm-us.informaticacloud.com/active-bpel/public/rt/dIjE3p8O2kuj9gfDoNfsuE/Ze-Violate?type=${d.type}&id=${d.id}&extra=${d.extra}`, true);
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log(`GET -> Ze-${d.type} -> 200 OK`);
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

const checkMoveItConf = async () => {
  return new Promise(async function (resolve, reject) {
    await fetch("../custom.config").then(async (response) => {
      const mjson = await response.json();
      mention = mjson.mention;
      if (mjson.move == "yes") {
        const response = await fetch("../resources/moveItPairs.json");
        const json = await response.json();
        console.log("Moveit config found ");
        chrome.storage.sync.set(
          {
            moveit: true,
            moveitPairs: json
          },
          function () {
            console.log("Moveit: map saved successfully to storage");
          }
        );
        resolve({
          status: 200
        });
      } else {
        chrome.storage.sync.set(
          {
            moveit: false,
            moveitPairs: {}
          },
          function () {
            console.log("Moveit will not work as expected");
          }
        );
        resolve({
          status: 200
        });
      }
    }).catch((error) => {
      console.log("Moveit config not found " + error);
      resolve({
        status: 200
      });
    });
  });
}

async function start() {
  //clean up
  chrome.browserAction.setBadgeText({
    text: "",
  });
  let interval;
  let viola;
  await checkMoveItConf();
  chrome.storage.sync.get(
    {
      interval: "5",
      likesViola: true,
      irogr: "15",
      qid: "00G3f000000N38GEAS",
      clickQ: "myCases",
      manage: false,
      moveit: false,
      moveitPairs: {},
      Notifications: true,
      whoami: "Product Specialist",
    },
    async function (items) {
      interval = items.interval;
      viola = items.likesViola;
      irogr = parseInt(items.irogr);
      qid = items.qid;
      notifClickQ = items.clickQ;
      manage = items.manage;
      moveit = items.moveit;
      moveitPairs = items.moveitPairs;
      Notifications = items.Notifications;
      whoami = items.whoami;
      console.log("Extension Options: " + JSON.stringify(items));
      if (viola) {
        await sleep(1000 * 10);
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
