let ukases, qkases, tkases, whoami, useriD;
jQuery.noConflict();
(function ($) {
  $(function () {
    $("#main-nav a").click(function (e) {
      e.preventDefault();
      $(this).tab("show");
    });
    chrome.browserAction.getBadgeText({}, function (result) {
      console.log("Badge text = " + result);
      if (!result) {
        chrome.storage.sync.set(
          {
            ukases: [],
            qkases: [],
            tkases: [],
          },
          function () {
            console.log("Viola: Storage has been reset");
          }
        );
      }
    });
    Array.prototype.sort_by = function (key_func, reverse = false) {
      return this.sort((a, b) => (key_func(b) - key_func(a)) * (reverse ? 1 : -1))
    }
    $("#home").append('<div class="form-group text-center">');
    $("#home .form-group").append('<div class="checkbox">Auto Detect?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>');
    //$('#home .form-group .checkbox').append('<p>Auto Detect?</p>');
    $("#home .form-group .checkbox").append('<input type="checkbox" id="autod" value="">');
    $("#home .form-group").append('<div class="button-wrapper" />');
    $("#home .form-group .button-wrapper").append('<input type="text" placeholder="IICS Org Id.." class="form-control" id="orgiD">');
    $("#home .form-group .button-wrapper").append("<p/>");
    $("#home .form-group .button-wrapper").append('<button type="button" class="btn btn-success Info btn-space">Info</button>');
    //$("#home .form-group .button-wrapper").append('<button type="button" class="btn btn-success PuppetM btn-space">Puppet</button>');
    $("#home .form-group .button-wrapper").append('<button type="button" class="btn btn-success DiagonAlleyM btn-space">DiagonAlley</button>');
    $("#home .form-group .button-wrapper").append("<br>");
    $("#home .form-group .button-wrapper").append("<br>");
    $("#home .form-group .button-wrapper").append('<button type="button" class="btn btn-secondary ubutton btn-space btn-sm">Open All User Cases</button>');
    $("#home .form-group .button-wrapper").append('<button type="button" class="btn btn-secondary qbutton btn-space btn-sm">Open All Q Cases </button>');
    $("#home .form-group .button-wrapper").append('<button type="button" class="btn btn-secondary tbutton btn-space btn-sm">Open All Team Cases </button>');
    $("#home .form-group .button-wrapper").append('<div class="text-center"/>');
    $("#home .form-group .button-wrapper .text-center").append('<p id="print"/>');
    $("#home .form-group .button-wrapper").append('<div id="viola"/>');
    chrome.storage.sync.get(
      {
        ukases: [],
        qkases: [],
        tkases: [],
      },
      function (items) {
        console.log("qkases: " + JSON.stringify(items.qkases));
        console.log("ukases: " + JSON.stringify(items.ukases));
        console.log("tkases: " + JSON.stringify(items.tkases));
        if (items.ukases.length != 0) {
          ukases = [...new Set(items.ukases)];
          ukases.sort_by(el => el.case.tim, reverse = true);
          $("#viola").append('<div id="ucases" class="button-wrapper"/>');
          $("#ucases").text("User Cases: ");
          $("#ucases").append("</br>");
          $("#ucases").append('<table class="table-sm center" id="tbu">');
          ukases.forEach((c) => {
            let txt = c.case.tim == "00" ? "&nbsp;Overdue" : `&nbsp;in ${c.case.tim} mins`;
            let segment = c.case.GCS_Segment__c.charAt(0);
            let clr = "success";
            if (c.case.tim == "00") {
              clr = "danger";
            }
            let markup = `<tr>
                              <th>${c.case.Priority}&nbsp;</th>
                              <th><a target="_blank" href="https://infa.lightning.force.com/lightning/r/Case/${c.case.CaseId}/view">${c.case.CaseNumber}</a></th>
                              <th>&nbsp;<img class="wifi" src="../svg/wifi_${segment}.png" width="15" height="15" translateY(2)></th>
                              <th class="${clr}">${txt}</th>
                          </tr>`;
            $("#tbu").append(markup);
          });
          $("#ucases").append("</br>");
        } else {
          $(".ubutton").toggle();
        }
        if (items.qkases.length != 0) {
          qkases = [...new Set(items.qkases)];
          qkases.sort_by(el => el.case.tim, reverse = true);
          $("#viola").append('<div id="qkases" class="text-center"/>');
          $("#qkases").text("Queue Cases: ");
          $("#qkases").append("</br>");
          $("#qkases").append('<table class="table-sm center" id="tbq">');
          qkases.forEach((c) => {
            let txt = c.case.tim == "00" ? "&nbsp;Overdue" : `&nbsp;in ${c.case.tim} mins`;
            let segment = c.case.GCS_Segment__c.charAt(0);
            let clr = "success";
            if (c.case.tim == "00") {
              clr = "danger";
            }
            let markup = `<tr>
                              <th>${c.case.Priority}&nbsp;</th>
                              <th><a target="_blank" href="https://infa.lightning.force.com/lightning/r/Case/${c.case.CaseId}/view">${c.case.CaseNumber}</a></th>
                              <th>&nbsp;<img class="wifi" src="../svg/wifi_${segment}.png" width="15" height="15" translateY(2)></th>
                              <th class="${clr}">${txt}</th>
                          </tr>`;
            $("#tbq").append(markup);
          });
          $("#qkases").append("</br>");

          function sortTable(table, order) {
            var asc = order === "asc",
              tbody = table.find("tbody");

            table
              .find("tr")
              .sort(function (a, b) {
                if (asc) {
                  return $("td:first", a).text().localeCompare($("td:first", b).text());
                } else {
                  return $("td:first", b).text().localeCompare($("td:first", a).text());
                }
              })
              .appendTo(table);
          }
          //sortTable($("#tbq"), "asc");
        } else {
          $(".qbutton").toggle();
        }
        if (items.tkases.length != 0) {
          tkases = [...new Set(items.tkases)];
          $("#viola").append('<div id="tcases"/>');
          $("#tcases").text("Team Cases: ");
          $("#tcases").append("</br>");
          $("#tcases").append('<div class="scrollable overflow-auto"/>');
          $("#tcases").append('<table class="table-sm center" id="tbt">');
          tkases.forEach((c) => {
            let txt = c.split("/")[1] == "00" ? "&nbsp;Overdue" : `&nbsp;in ${c.split("/")[1]} mins`;
            let segment = c.split("/")[3].charAt(0);
            let clr = "success";
            if (c.split("/")[1] == "00") {
              clr = "danger";
            }
            let markup = `<tr>
                              <th>${c.case.Priority}&nbsp;</th>
                              <th><a target="_blank" href="https://infa.lightning.force.com/lightning/r/Case/${c.case.CaseId}/view">${c.case.CaseNumber}</a></th>
                              <th>&nbsp;<img class="wifi" src="../svg/wifi_${segment}.png" width="15" height="15" translateY(2)></th>
                              <th class="${clr}">${txt}</th>
                          </tr>`;
            $("#tbt").append(markup);
            //$(".scrollable").append("</br>");
          });
        } else {
          $(".tbutton").toggle();
        }
      }
    );

    $(".Info").click(async function () {
      let orgiD = "";
      if ($("#autod").is(":checked")) {
        $("#print").text("..getting orgid..");
        await getOrgID().then((response) => {
          orgiD = response.orgiD;
        });
      } else {
        orgiD = $("#orgiD").val();
      }
      $("#print").text("..getting org info..");
      fetch(`http://resolusense-os.informatica.com/idmc-proxy/api/v1/getpodinfo/${orgiD}`)
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
            console.log("resp-podInfo " + JSON.stringify(podInfo));
            $("#print").text("");
            $("#print").append(`Org <b>${podInfo.orgId}</b> is in <b>${podInfo.baseUrl.split("//")[1].replace(".informaticacloud.com", "")}</b>`);
          }

        })
        .catch((error) => {
          console.error('Fetch error:', error);
          alert("Oops! The PodInfo API took a detour. 🚧\n\nIt needs a VPN passport to get through. 🛂\n\nConnect to your VPN and try this again!");
        });
    });
    $(".DiagonAlleyM").click(async function () {
      if ($("#autod").is(":checked")) {
        $("#print").text("..getting orgid..");
        await getOrgID().then((response) => {
          //https://diagonalley.informatica.com/?orgId={response.orgiD}&caseNum={response.caseNumber}
          window.open(sanitizeData(`https://diagonalley.informatica.com/?orgId=${response.orgiD}&caseNum=${response.caseNumber}`));
        });
      } else {
        //alert($("#orgiD").val());
        //window.open(sanitizeData(`https://diagonalley.informatica.com/?orgID=${$("#orgiD").val()}`));
        window.open(sanitizeData('https://diagonalley.informatica.com/'));
      }
    });

    $(".PuppetM").click(async function () {
      if ($("#autod").is(":checked")) {
        $("#print").text("..getting orgid..");
        await getOrgID().then(async function (response) {
          await puppet(response.orgiD);
        });
      } else {
        await puppet($("#orgiD").val());
      }
    });

    $("#autod").click(function () {
      $("#orgiD").toggle();
    });
    $(".save-settings").click(function () {
      chrome.storage.sync.set(
        {
          iCare: document.getElementById("iCare").value,
          iCareNot: document.getElementById("iCareNot").value,
        },
        function () {
          // Update status to let user know options were saved.
          var status = document.getElementById("status");
          status.textContent = "Options saved.";
          setTimeout(function () {
            status.textContent = "";
          }, 1500);
        }
      );
    });
    $(".ubutton").click(async function () {
      ucases.forEach((c) => {
        window.open(`https://infa.lightning.force.com/lightning/r/Case/${c.split("/")[0]}/view`);
      });
    });

    $(".tbutton").click(async function () {
      tcases.forEach((c) => {
        window.open(`https://infa.lightning.force.com/lightning/r/Case/${c.split("/")[0]}/view`);
      });
    });

    $(".qbutton").click(async function () {
      qkases.forEach((c) => {
        window.open(`https://infa.lightning.force.com/lightning/r/Case/${c.split("/")[0]}/view`);
      });
    });

    $("#wassup").click(function () {
      if ($("#timeline li").length > 0) {
      } else {
        chrome.storage.sync.get(
          {
            whoami: "Product Specialist",
          },
          function (items) {
            whoami = items.whoami;
            console.log("whoami: " + whoami);
            $(".feed-text").text("Getting Latest Feed.");
            var dt = new Date();
            dt.setHours(dt.getHours() - 72);
            let soql = `SELECT Case_Number__c,Case__c,Comment_to_Search__c,CreatedDate FROM Case_Comment__c WHERE CreatedDate > ${dt.toISOString()} AND Case__c IN (SELECT Id FROM Case WHERE (OwnerId = '<replaceUserIDHere>' AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled' AND Next_Action__c = 'Case Owner')) AND Comment_Action_Type__c != 'Customer Action' AND Inbound__c = true ORDER BY CreatedDate DESC`;
            if (whoami == "PS") {
              soql = `SELECT Case_Number__c,Case__c,Comment_to_Search__c,CreatedDate FROM Case_Comment__c WHERE CreatedDate > ${dt.toISOString()} AND Case__c IN (SELECT Case__c FROM Case_Team__c WHERE OwnerId = '<replaceUserIDHere>' AND Role__c = 'CoOwner' AND Case__r.status !='closed' AND Case__r.status != 'Delivered' AND Case__r.status != 'Cancelled') AND Comment_Action_Type__c != 'Customer Action' AND Inbound__c = true ORDER BY CreatedDate DESC`;
            }
            Feed(soql, "");
          }
        );
      }
    });

    $("#wassupq").click(function () {
      if ($("#timeline-q li").length > 0) {
      } else {
        chrome.storage.sync.get(
          {
            qid: "00G3f000000N38GEAS",
          },
          async function (items) {
            $(".feed-text-q").text("Getting Latest Feed.");
            var dt = new Date();
            dt.setHours(dt.getHours() - 24);
            let soql = `SELECT Case_Number__c,Case__c,Comment_to_Search__c,CreatedDate FROM Case_Comment__c WHERE CreatedDate > ${dt.toISOString()} AND Case__c IN (SELECT Id FROM Case WHERE (OwnerId in(${items.qid.split(",").map(item => `'${item.trim()}'`).join(', ')}) AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled' AND Next_Action__c = 'Case Owner')) AND Comment_Action_Type__c != 'Customer Action' AND Inbound__c = true ORDER BY CreatedDate DESC`;
            Feed(soql, "-q");
          }
        );
      }
    });

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
        var records = [];
        console.log(soql);
        var query = conn
          .query(soql)
          .on("record", function (record) {
            records.push(record);
          })
          .on("end", function () {
            // console.log("total in database : " + query.totalSize);
            // console.log("total fetched : " + query.totalFetched);
            resolve({
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

    function getCaseComments(tab, soql) {
      return new Promise(async function (resolve, reject) {
        let taburl = tab.url;
        var sfdc = new URL(taburl);
        var cookie = await getValueFromCookie(taburl, "sid");
        var serverUrl = "https://infa.my.salesforce.com";
        var conn = new jsforce.Connection({
          version: "53.0",
          serverUrl: serverUrl,
          sessionId: cookie.sid,
        });
        conn.identity().then(async (res) => {
          useriD = res.user_id;
          // var dt = new Date();
          // dt.setHours(dt.getHours() - 24);
          //let soql = `SELECT Case_Number__c,Case__c,Comment_to_Search__c,CreatedDate FROM Case_Comment__c WHERE CreatedDate > ${dt.toISOString()} AND Case__c IN (SELECT Id FROM Case WHERE (OwnerId = '${useriD}' AND Status != 'closed' AND Status != 'Delivered' AND Status != 'Cancelled' AND Next_Action__c = 'Case Owner')) AND Comment_Action_Type__c != 'Customer Action' AND Inbound__c = true ORDER BY CreatedDate DESC`;
          //soql.replace("<replaceUserIDHere>", useriD);
          // conn.chatter.resource('/feed-elements').create({
          //   body: {
          //     messageSegments: [{
          //       type: 'Text',
          //       text: 'Moved to GCS B2B as the case is related to Events.cme'
          //     }]
          //   },
          //   feedElementType: 'FeedItem',
          //   subjectId: '5006S00001wGObFQAW',
          // }, function (err, result) {
          //   if (err) {
          //     console.log("chatter error: " + err);
          //   }
          //   console.log("Id: " + result.id);
          //   console.log("URL: " + result.url);
          //   console.log("Body: " + result.body.messageSegments[0].text);
          //   console.log("Comments URL: " + result.capabilities.comments.page.currentPageUrl);
          // });
          fetchFromSOQL(conn, soql.replace("<replaceUserIDHere>", useriD))
            .then((res) => {
              resolve({ res });
            })
            .catch((err) => {
              console.log(err);
              reject({ err });
            });
        });
      });
    }

    function Feed(soql, el) {
      chrome.tabs.query(
        {
          url: "https://infa.lightning.force.com/*",
        },
        function (tabs) {
          if (tabs.length != 0) {
            var tab = tabs[0];
            let markup = "";
            //$(".feed-text").text("Getting Latest Feed..");
            getCaseComments(tab, soql).then((res) => {
              let json = res;
              if (json.res.records.length > 0) {
                json.res.records.forEach((c) => {
                  markup =
                    markup +
                    `<li>
                       <a target="_blank" href="https://infa.lightning.force.com/lightning/r/Case/${c.Case__c}/view">${c.Case_Number__c}</a>
                       <a href="#" class="float-right">@ ${c.CreatedDate.slice(0, 19).replace("T", " ")}</a>
                        <p>${c.Comment_to_Search__c}</p>
                     </li>`;
                });
              } else {
                markup =
                  markup +
                  `<li>
                   <a target="_blank" href="#">Woww..</a>
                   <a href="#" class="float-right"> Amazing !!</a>
                    <p>This means, #NoAction pending on YOU. Go get a Coffee.&nbsp; <a class="nav-link" target="_blank" href="https://www.timhortons.ca/?lang=en&locale-selected=1"><span class="glyphicon glyphicon-new-window"></span></a></i></p>
                 </li>`;
              }

              $(".feed-text" + el).text("Latest Feed");
              $("#timeline" + el).append(markup);
            });
          } else {
            $(".feed-text" + el).text("Please log into Salesforce Case Console.");
          }
        }
      );
    }

  });
})(jQuery);

function restore_options() {
  // Use default value color = 'red' and likesViola = true.
  chrome.storage.sync.get(
    {
      iCare: "",
      iCareNot: "",
    },
    function (items) {
      document.getElementById("iCare").value = items.iCare;
      document.getElementById("iCareNot").value = items.iCareNot;
    }
  );
}
document.addEventListener("DOMContentLoaded", restore_options);
