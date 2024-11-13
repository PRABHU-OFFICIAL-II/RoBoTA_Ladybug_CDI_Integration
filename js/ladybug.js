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

(function () {
  try {
    GM_addStyle(`
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
        .timeline-tab-table {
            border-collapse: collapse;
        }

        .timeline-tab-cell {
            width: 20px;
            height: 20px;
            min-width: 20px;
            min-height: 20px;
            max-width: 20px;
            max-height: 20px;
            border: solid 1px rgb(183, 211, 185);
        }

        .timeline-tab-row-header {
            text-align: end;
            font-size: smaller;
            vertical-align: bottom;
            white-space: nowrap;
            border: solid 1px transparent;
            padding-top: 1px;
            padding-right: 5px;
        }

        .timeline-tab-col-header {
            text-align: center;
            font-size: small;
            height: 30px;
        }
        .popupbg-infinite-progress-container {
			overflow: hidden;
		}
		.popupbg-infinite-progress-circle {
			width: 120px;
			height: 120px;
			border-radius: 50%;
			border: 10px solid #f3f3f3;
			border-top-color: #4caf50;
			animation: spin 1s linear infinite;
		}

		@keyframes spin {
			0% {
				transform: rotate(0deg);
			}
			100% {
				transform: rotate(360deg);
			}
		}
        `);
    // we are in tampermonkey env, just continue
  } catch (e) {
    // we are in robota, do this check to avoid double loading
    if (!window.iics) return;
  }

  // because the URL matching is wierd - https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns
  let allowedHosts = ["mcc.", "cdgc.", "dqprofile.", "informaticacloud."];
  if (
    allowedHosts.filter((h) => window.location.hostname.includes(h)).length == 0
  )
    return;

  console.log("Hello from CDGCS!");

  function AlertManager() {
    let Alert = (msg, level) => {
      if (!this.alertsection) {
        this.alertsection = render("alertmgr", {
          ele: "div",
          styles: {
            display: "flex",
            flexDirection: "column",
            background: "transparent",
            maxWidth: "200px",
            top: "10px",
            right: "10px",
            position: "absolute",
            zIndex: 10000,
          },
        });
        document.body.appendChild(this.alertsection);
      }
      let bgcolors = {
        info: "green",
        error: "red",
        warning: "orange"
      };
      let alert = render("alert", {
        ele: "div",
        text: msg,
        styles: {
          background: bgcolors[level],
          color: "white",
          padding: "5px",
          borderRadius: "5px",
          margin: "2px 0px",
          minWidth: "100px",
        },
      });
      this.alertsection.appendChild(alert);
      setTimeout((_) => alert.remove(), 3000);
    };

    this.info = (msg) => Alert(msg, "info");
    this.error = (msg) => Alert(msg, "error");
    this.warn = (msg) => Alert(msg, "warning");
  }
  let AM = new AlertManager();

  function render(name, spec, elemCreated, container) {
    let e;
    if (!spec.preBuilt) {
      e = document.createElement(spec.ele);
      spec.iden && elemCreated(spec.iden, e);
      if (spec.text) e.innerHTML = spec.text;
      if (spec.classList) {
        e.classList =
          `${name}-` + spec.classList.split(/\s+/).join(` ${name}-`);
      }
      spec.attribs &&
        Object.keys(spec.attribs).forEach((key) => {
          e[key] = spec.attribs[key];
        });
      spec.styles &&
        Object.keys(spec.styles).forEach((key) => {
          e.style[key] = spec.styles[key];
        });
      spec.evnts &&
        Object.keys(spec.evnts).forEach((key) => {
          e.addEventListener(key, spec.evnts[key]);
        });
      if (spec.children) {
        if (spec.children instanceof Function) {
          spec.children().map((x) => e.appendChild(x));
        } else
          spec.children.forEach((child) => render(name, child, elemCreated, e));
      }
    } else {
      e = spec.ele;
    }
    if (container) {
      let lbl;
      if (spec.label || spec.postlabel) {
        let rgid = "id_" + Math.random();
        e.id = rgid;
        lbl = document.createElement("label");
        lbl.innerHTML = spec.label || spec.postlabel;
        lbl.setAttribute("for", rgid);
      }
      if (spec.label) container.appendChild(lbl);
      container.appendChild(e);
      if (spec.postlabel) container.appendChild(lbl);
      return container;
    }
    return e;
  }
  let clipboardDiv;

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
        AM.info("Copied to clipboard");
      }
    } catch (err) {
      console.error(err);
      AM.error("copy failed, but the config is printed to browser console!");
    }
    focused.focus();
  }

  // ---------- HTTP ---------------
  let rejectCodeList = [400, 401, 500, 403];

  function makeGuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  function _ajax(method, url, data, hdrs, cancelToken, decorator) {
    let traceId = "ladybug_" + makeGuid();
    hdrs = {
      ...hdrs,
      x_infa_log_ctx: traceId,
      "X-INFA-TID": traceId,
      "X-INFA-TG-ID": traceId,
      xsrf_token: getCookie("XSRF_TOKEN"),
    };
    return new Promise((resolve, reject) => {
      var xhttp = new XMLHttpRequest();
      xhttp.withCredentials = true;
      if (cancelToken) {
        cancelToken.cancel = function () {
          xhttp.abort();
          reject(new Error("Cancelled"));
        };
      }
      decorator && decorator(xhttp, resolve, reject);
      xhttp.open(method, url, true);
      hdrs &&
        Object.keys(hdrs).forEach((key) =>
          xhttp.setRequestHeader(key, hdrs[key])
        );
      xhttp.send(data);
    });
  }

  function ajax(method, url, data, hdrs, cancelToken) {
    return _ajax(
      method,
      url,
      data,
      hdrs,
      cancelToken,
      (xhttp, resolve, reject) => {
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && [200, 201, 202].includes(this.status)) {
            let json;
            try {
              json = JSON.parse(this.responseText);
            } catch (e) {}
            resolve({
              response: this.responseText,
              json,
              headers: makeHMap(xhttp.getAllResponseHeaders()),
            });
          }
          if (this.readyState == 4 && rejectCodeList.includes(this.status)) {
            reject({
              message: JSON.parse(this.responseText).message,
              code: this.status,
            });
          }
        };
        xhttp.onerror = function () {
          reject({
            message: JSON.parse(this.responseText).message,
            code: this.status,
          });
        };
      }
    );
  }

  function download(url, fileName, hdrs) {
    return _ajax("GET", url, undefined, hdrs, undefined, (xhr) => {
      xhr.responseType = "blob";
      xhr.onload = () => {
        if (xhr.status === 200) {
          const url = window.URL.createObjectURL(xhr.response);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 0);
        }
      };
    });
  }

  function makeHMap(headers) {
    var arr = headers.trim().split(/[\r\n]+/);
    var headerMap = {};
    arr.forEach(function (line) {
      var parts = line.split(": ");
      var header = parts.shift();
      var value = parts.join(": ");
      headerMap[header] = value;
    });
    return headerMap;
  }

  function get(url, data, headers, token) {
    return ajax("GET", url, undefined, headers, token);
  }

  function post(url, data, hdrs) {
    if (typeof data !== "string") {
      hdrs = {
        "Content-Type": "application/json",
        ...hdrs
      };
    }
    return ajax("POST", url, JSON.stringify(data), hdrs);
  }

  function postFile(url, data, hdrs) {
    return ajax("POST", url, data, hdrs);
  }

  function delet(url) {
    return ajax("DELETE", url);
  }
  // -------------------------------

  // UI building helper functions
  function makePopup(def, bgcolor) {
    let elems = {};
    render(
      "popupbg", {
        ele: "div",
        attribs: {
          tabindex: "0"
        },
        styles: {
          position: "absolute",
          top: "0px",
          left: "0px",
          right: "0px",
          bottom: "0px",
          background: bgcolor || "transparent",
          zIndex: 10000,
          display: "flex",
          flexDirection: "column",
        },
        evnts: {
          click: function () {
            this.remove();
          },
          keypress: function (e) {
            console.log(e);
            if (e.key == "Escape") {
              this.remove();
            }
          },
        },
        children: [{
          ...def,
          iden: "child"
        }],
      },
      (i, e) => (elems[i] = e),
      document.body
    );
    return elems.child;
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  function copyActionFor(funct) {
    return () => funct().then(copyToClip);
  }

  function showActionFor(funct) {
    return () => funct().then(showFmt);
  }

  function showFmt(text) {
    makePopup({
        ele: "div",
        styles: {
          margin: "20px 40px",
          background: "white",
          border: "solid 2px black",
          position: "relative",
          height: "calc(100% - 40px)",
          width: "calc(100% - 80px)",
        },
        evnts: {
          click: (_) => _.stopPropagation()
        },
        children: [{
            ele: "pre",
            styles: {
              overflow: "auto",
              height: "100%",
              width: "100%",
              position: "absolute",
              padding: "5px",
              margin: "0px",
            },
            text,
          },
          {
            ele: "div",
            styles: {
              display: "flex",
              position: "absolute",
              top: "5px",
              right: "5px",
            },
            children: [{
                ele: "button",
                text: "copy",
                evnts: {
                  click: (_) => copyToClip(text)
                },
                styles: {
                  marginRight: "5px"
                },
              },
              {
                ele: "button",
                text: "x",
                evnts: {
                  click: (e) =>
                    e.target.parentElement.parentElement.parentElement.click(),
                },
              },
            ],
          },
        ],
      },
      "rgba(0,0,0,0.3)"
    );
  }

  function withProgress(func) {
    let popup = makePopup({
        ele: "div",
        classList: "infinite-progress-container",
        styles: {
          position: "absolute",
          top: "0px",
          bottom: "0px",
          left: "0px",
          right: "0px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        children: [{
          ele: "div",
          classList: "infinite-progress-circle"
        }],
      },
      "rgba(0,0,0,0.3)"
    );
    return func().finally((x) => {
      popup && popup.parentElement.click();
      return x;
    });
  }

  function getSesssionId() {
    const event = new CustomEvent("LADYBUG_FG", {
      detail: {
        type: "LADYBUG_EX",
        cod: "COOKIE",
        domain: window.location.hostname.substr(
          window.location.hostname.indexOf(".") + 1
        ),
        name: "IDS-SESSION",
      },
    });
    window.dispatchEvent(event);
    window.addEventListener("LADYBUG_BG", function (event) {
      console.log("Message from content script:", event.detail);
    });
  }

  // CDI Code starts

  // Function to convert time from PST to IST
  function getCurrentIST(pstTime) {
    let date = new Date();
    let timezoneOffset = date.getTimezoneOffset();
    // let pstOffset = -480; // this is the offset for the Pacific Standard Time timezone
    let adjustedTime = new Date(
      date.getTime() + (timezoneOffset) * 60 * 1000
    );

    // display the date and time in PST timezone
    let options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "Asia/Kolkata",
    };
    let istDateTime = date.toLocaleString("en-US", options);
    console.log(istDateTime); // Output: 2/16/2022, 11:01:20 AM
    return `Updated ${istDateTime} IST`;
  }

  function convertToIST(pstTime) {

    const pstDate = new Date(pstTime + " GMT-0800");

    // const istOffset = 13.5 * 60 * 60 * 1000;
    // const istDate = new Date(pstDate.getTime() + istOffset);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    };
    const istDateStr = pstDate.toLocaleString('en-US', options);
    return istDateStr;

  }

  function updateTimestampToIST() {
    const timestampElement = document.querySelector("div.job-update-timestamp");
    const timestampPattern = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}, \d{4}, \d{1,2}:\d{2} (AM|PM)$/;
    const timeStampContent = document.querySelectorAll(".infaTableGridCell.ellipses-overflow")
    if (timestampElement && timeStampContent) {
      const pstTextMatch = timestampElement.textContent
        .split(" ")
        .slice(-3)
        .join(" ");

      for (let element of timeStampContent) {
        const textContent = element.textContent.trim();
        if (timestampPattern.test(textContent)) {
          const pstContentMatch = textContent;
          if (pstTextMatch && pstContentMatch) {
            const istTime = getCurrentIST(pstTextMatch);
            const istContent = convertToIST(pstContentMatch);
            timestampElement.innerHTML = istTime;
            element.innerHTML = istContent;
          } else {
            console.warn("Timestamp element not found.");
          }
        } else {
          continue;
        }
      }
    }
  }

  //mods for CDI pages
  function CDI() {
    // API
    this.getUiConfig = () => {
      return {
        "na1.*": {
          "/home": {
            menuItems: [{
              group: "",
              text: "Test Check",
              action: () => showFmt("Lady Bug Triggered"),
            }, ],
          },
          "/MonitorJobs": {
            menuItems: [{
              group: "monitor",
              text: "IST Refactor",
              action: () => updateTimestampToIST(),
              //     document.addEventListener('DOMContentLoaded', updateTimestampToIST
              //   ),
            }, ],
          },
        },
      };
    };
  }

  // mods for CDGC pages
  function CDGC() {
    // API
    this.getUiConfig = () => {
      return {
        "mcc.*": {
          "/monitor": {
            menuItems: [
              // { group: "Jobs", text: "Show subtask details", action: () => Promise.resolve(1) },
              {
                group: "Jobs",
                text: "Show timeline view",
                action: () => cdgc_mcc_showTimeLineView(),
              },
              {
                group: "Jobs",
                text: "Show all capabilities",
                action: () => showCdgcCapabilities(),
              },
            ],
          },
          "/jobInfo/.*": {
            menuItems: [{
                group: "Job info",
                text: "Show job definition",
                action: showActionForCdgcUrl(
                  get,
                  (_) =>
                  `/ccgf-orchestration-management-api-server/api/v1/jobs/${window.location.pathname.substring(
                      9
                    )}?aggregateResourceUsage=false&expandChildren=INPUT-PROPERTIES&expandChildren=OUTPUT-PROPERTIES&expandChildren=TASK-HIERARCHY&expandChildren=WORKFLOW-DETAILS&expandChildren=OPERATIONS`
                ),
              },
              {
                group: "Job info",
                text: "Show job spec",
                action: showActionForCdgcUrl(
                  get,
                  (_) =>
                  `/ccgf-orchestration-management-api-server/api/v1/jobs/${window.location.pathname.substring(
                      9
                    )}/jobspec`
                ),
              },
              // { group: "Job info", text: "Copy job summary", action: _ => copyJobSummary(window.location.pathname.substring(9)) }
            ],
            snippets: [
              function AugmentedDetailsPanel() {
                let update = () => {
                  let sfs = [
                    "metadata_staging",
                    "auto_catalog_staging",
                    "custom-metadata-staging-producer",
                    "profiling_staging",
                  ];
                  let proms = sfs.map((sf) =>
                    cdgcApi(
                      get,
                      `/ccgf-metadata-staging/api/v1/staging/files?path=${this.jobid}&serviceFunction=${sf}`,
                      undefined, {},
                      false
                    )
                  );
                  Promise.all(proms).then((fsets) => {
                    this.panel.innerHTML = "";
                    render(
                      "aug-ui", {
                        ele: "h2",
                        text: "Additional info"
                      },
                      undefined,
                      this.panel
                    );
                    fsets.forEach((files, i) => {
                      if (!files.fullyQualifiedPath.length) return;
                      render(
                        "aug-ui", {
                          ele: "div",
                          children: [{
                              ele: "h3",
                              text: `Files in ${sfs[i]}`
                            },
                            {
                              ele: "div",
                              children: files.fullyQualifiedPath.map((p) => ({
                                ele: "a",
                                styles: {
                                  display: "block"
                                },
                                text: p,
                                evnts: {
                                  click: getDownloadActionForCdgcUrl(
                                    (_) =>
                                    `/ccgf-metadata-staging/api/v1/staging/files/download?filePath=${encodeURIComponent(
                                        p
                                      )}&serviceFunction=metadata_staging`,
                                    p.split("/").pop()
                                  ),
                                },
                              })),
                            },
                          ],
                        },
                        undefined,
                        this.panel
                      );
                    });
                    if (!this.stopped) setTimeout(update, 5000);
                  });
                };

                let delayedInit = () => {
                  let pp = document.querySelector(
                    `#overview_container_${this.jobid}`
                  );
                  if (!pp) {
                    setTimeout(delayedInit, 200);
                    return;
                  }
                  pp.appendChild(
                    (this.panel = render("aug-ui", {
                      ele: "div",
                      styles: {
                        display: "flex",
                        flexDirection: "column",
                        margin: "0px 30px",
                        background: "lightblue",
                        padding: "10px",
                      },
                    }))
                  );
                  update();
                };

                this.init = () => {
                  this.jobid = window.location.pathname.substring(9);
                  setTimeout(delayedInit, 200);
                };

                this.deinit = () => {
                  this.stopped = true;
                };
              },

              function TraceIdOpener() {
                this.init = () => {
                  let jId = window.location.pathname.substring(9);
                  let parent = document.querySelector(
                    `div[data-cy="new-job-page-${jId}"]`
                  ).previousSibling;
                  if (parent.querySelector(".mcc-kibana-btn")) return;
                  let container = parent.querySelector(
                    ".job-details-header-button-group"
                  );
                  let newBtn = render("mcc", {
                    ele: "div",
                    text: "Kibana",
                    classList: "btn kibana-btn",
                    evnts: {
                      click: (_) => {
                        cdgcApi(
                          get,
                          `/ccgf-orchestration-management-api-server/api/v1/jobs/${jId}`
                        ).then((j) => {
                          function makeDateWithDelta(date, delta) {
                            const newDate = new Date(date);
                            newDate.setDate(newDate.getDate() + delta);
                            return newDate.toISOString();
                          }
                          let s = makeDateWithDelta(j.createdTime, -1),
                            e = makeDateWithDelta(j.endTime, +1);
                          let url = `https://kibana.ext.prod.elk.cloudtrust.rocks/s/ccgf/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'${s}',to:'${e}'))&_a=(columns:!(parsed.serviceName,parsed.level,parsed.message),index:'4407cf18-b96f-40a3-9e59-5c94677dd110',interval:auto,query:(language:kuery,query:'%22${j.traceId}%22'),sort:!(!('@timestamp',desc)))`;
                          console.log(url);
                          window.open(url);
                        });
                      },
                    },
                  });
                  container.insertBefore(newBtn, container.childNodes[0]);
                };
              },
            ],
          },
          "/catalogsource/.*": {
            menuItems: [{
                group: "Lake",
                text: "Export all V & E from origin",
                action: () =>
                  cdgc_triggerExport(
                    window.location.pathname.substring(15),
                    true,
                    true
                  ),
              },
              {
                group: "Lake",
                text: "Export all V from origin",
                action: () =>
                  cdgc_triggerExport(
                    window.location.pathname.substring(15),
                    true
                  ),
              },
              {
                group: "Lake",
                text: "Export all E from origin",
                action: () =>
                  cdgc_triggerExport(
                    window.location.pathname.substring(15),
                    false,
                    true
                  ),
              },
              {
                group: "Lake",
                text: "Export wizard",
                action: () => ExportApp(),
              },

              {
                group: "ConnAssign",
                text: "Check if origin is involved in CA",
                action: () => checkIfConnectionAssignment(),
              },
            ],
            snippets: [
              function ConnAssign() {
                this.init = () => {
                  let jId = window.location.pathname.split("/").reverse()[0];
                  //let parent = document.querySelector(`div[data-cy="new-job-page-${jId}"]`).previousSibling
                  if (document.querySelector(".mcc-connAssign-btn")) {
                    console.log("returning...");
                    return;
                  }
                  let container = document.querySelector(".d-toolbar__content");
                  let newBtn = render("mcc", {
                    ele: "div",
                    text: "&#128279",
                    classList: "btn",
                    evnts: {
                      click: (_) => {
                        checkIfConnectionAssignment();
                      },
                    },
                  });
                  container.insertBefore(newBtn, container.childNodes[0]);
                };
              },
            ],
          },
          ".*": {
            menuItems: [{
                group: "",
                text: "Copy JWT token",
                action: copyActionFor(getToken),
              },
              {
                group: "",
                text: "Copy session id",
                action: copyActionFor(getSesssionId),
              },
              {
                group: "",
                text: "Run permission sync",
                action: (_) =>
                  cdgcApi(
                    post,
                    `/ccgf-auth-pap/authorization/api/v1/pap/syncIICSPermissionsForTenant`
                  ).then((_) => AM.info("Triggered the permission sync!")),
              },
              {
                group: "",
                text: "Services & Configs",
                action: (_) => showServiceList(),
              },
              {
                group: "",
                text: "Show IDMC Config",
                action: (_) => {
                  getCdgcServiceUrl("mcp-app").then((url) => {
                    window.open(`${url}catalogsource/idmc~catalog`);
                  });
                },
              },
            ],
          },
        },
        "cdgc.*": {
          "/asset/.*": {
            menuItems: [{
                group: "ES",
                text: "Show asset doc from ES",
                action: showActionForCdgcUrl(
                  post,
                  (_) => `/ccgf-searchv2/api/v1/search`,
                  (_) => ({
                    from: 0,
                    size: 9,
                    query: {
                      bool: {
                        must: [{
                            terms: {
                              elementType: ["OBJECT"]
                            }
                          },
                          {
                            terms: {
                              "core.identity": [
                                window.location.pathname.substring(7),
                              ],
                            },
                          },
                        ],
                      },
                    },
                  }), {
                    "x-infa-search-language": "elasticsearch"
                  }
                ),
              },
              {
                group: "ES",
                text: "Show in-edges from ES",
                action: showActionForCdgcUrl(
                  post,
                  (_) => `/ccgf-searchv2/api/v1/search`,
                  (_) => ({
                    from: 0,
                    size: 10000,
                    query: {
                      bool: {
                        must: [{
                            terms: {
                              elementType: ["RELATIONSHIP"]
                            }
                          },
                          {
                            terms: {
                              "core.targetIdentity": [
                                window.location.pathname.substring(7),
                              ],
                            },
                          },
                        ],
                      },
                    },
                  }), {
                    "x-infa-search-language": "elasticsearch"
                  }
                ),
              },
              {
                group: "ES",
                text: "Show out-edges from ES",
                action: showActionForCdgcUrl(
                  post,
                  (_) => `/ccgf-searchv2/api/v1/search`,
                  (_) => ({
                    from: 0,
                    size: 10000,
                    query: {
                      bool: {
                        must: [{
                            terms: {
                              elementType: ["RELATIONSHIP"]
                            }
                          },
                          {
                            terms: {
                              "core.sourceIdentity": [
                                window.location.pathname.substring(7),
                              ],
                            },
                          },
                        ],
                      },
                    },
                  }), {
                    "x-infa-search-language": "elasticsearch"
                  }
                ),
              },

              {
                group: "Graph",
                text: "Show asset from Graph",
                action: showActionForCdgcUrl(
                  post,
                  (_) => `/ccgf-searchv2/api/v1/search`,
                  (_) => ({
                    "@type": "g:Bytecode",
                    "@value": {
                      step: [
                        [
                          "V",
                          `${getEffOrgId()}://${window.location.pathname.substring(
                            7
                          )}`,
                          `${getEffOrgId()}~${window.location.pathname.substring(
                            7
                          )}`,
                        ],
                        ["valueMap", true],
                      ],
                    },
                  }), {
                    "x-infa-search-language": "gremlin"
                  }
                ),
              },
              {
                group: "Graph",
                text: "Show in-edges from Graph",
                action: showActionForCdgcUrl(
                  post,
                  (_) => `/ccgf-searchv2/api/v1/search`,
                  (_) => ({
                    "@type": "g:Bytecode",
                    "@value": {
                      step: [
                        [
                          "V",
                          `${getEffOrgId()}://${window.location.pathname.substring(
                            7
                          )}`,
                          `${getEffOrgId()}~${window.location.pathname.substring(
                            7
                          )}`,
                        ],
                        ["inE"],
                        ["valueMap", true],
                      ],
                    },
                  }), {
                    "x-infa-search-language": "gremlin"
                  }
                ),
              },
              {
                group: "Graph",
                text: "Show out-edges from Graph",
                action: showActionForCdgcUrl(
                  post,
                  (_) => `/ccgf-searchv2/api/v1/search`,
                  (_) => ({
                    "@type": "g:Bytecode",
                    "@value": {
                      step: [
                        [
                          "V",
                          `${getEffOrgId()}://${window.location.pathname.substring(
                            7
                          )}`,
                          `${getEffOrgId()}~${window.location.pathname.substring(
                            7
                          )}`,
                        ],
                        ["outE"],
                        ["valueMap", true],
                      ],
                    },
                  }), {
                    "x-infa-search-language": "gremlin"
                  }
                ),
              },

              {
                group: "CDC",
                text: "Show changelog doc",
                action: showActionForCdgcUrl(
                  post,
                  (_) => `/ccgf-searchv2/api/v1/search`,
                  (_) => ({
                    from: 0,
                    size: 9,
                    include_cdc: true,
                    query: {
                      bool: {
                        must: [{
                            terms: {
                              elementType: ["OBJECT"]
                            }
                          },
                          {
                            terms: {
                              "core.identity": [
                                window.location.pathname.substring(7),
                              ],
                            },
                          },
                        ],
                      },
                    },
                  }), {
                    "x-infa-search-language": "elasticsearch"
                  }
                ),
              },

              {
                group: "Lake",
                text: "Export all V & E from origin",
                action: () =>
                  cdgc_searchAsset([window.location.pathname.substring(7)])
                  .then((hits) => hits[0]["sourceAsMap"]["core.origin"])
                  .then((origin) => cdgc_triggerExport(origin, true, true)),
              },
              {
                group: "Lake",
                text: "Export all V from origin",
                action: () =>
                  cdgc_searchAsset([window.location.pathname.substring(7)])
                  .then((hits) => hits[0]["sourceAsMap"]["core.origin"])
                  .then((origin) => cdgc_triggerExport(origin, true)),
              },
              {
                group: "Lake",
                text: "Export all E from origin",
                action: () =>
                  cdgc_searchAsset([window.location.pathname.substring(7)])
                  .then((hits) => hits[0]["sourceAsMap"]["core.origin"])
                  .then((origin) => cdgc_triggerExport(origin, false, true)),
              },
              {
                group: "Lake",
                text: "Export all asset of this type from origin",
                action: () =>
                  cdgc_searchAsset([window.location.pathname.substring(7)])
                  .then((hits) => [
                    hits[0]["sourceAsMap"]["core.origin"],
                    hits[0]["sourceAsMap"]["core.classType"],
                  ])
                  .then((oAc) =>
                    cdgc_triggerExport(oAc[0], true, false, [oAc[1]])
                  ),
              },
              {
                group: "Lake",
                text: "Export wizard",
                action: () => ExportApp(),
              },

              {
                group: "ConnAssign",
                text: "Check if origin is involved in CA",
                action: () => checkIfConnectionAssignment(),
              },
            ],
          },
          ".*": {
            menuItems: [{
                group: "",
                text: "Copy JWT token",
                action: copyActionFor(getToken),
              },
              {
                group: "",
                text: "Copy session id",
                action: copyActionFor(getSesssionId),
              },
              //{group: "", text: "Make HTTP requests", action: () => showHttpReqBuilder() },
              {
                group: "",
                text: "Run permission sync",
                action: (_) =>
                  cdgcApi(
                    post,
                    `/ccgf-auth-pap/authorization/api/v1/pap/syncIICSPermissionsForTenant`
                  ).then((_) => AM.info("Triggered the permission sync!")),
              },
              {
                group: "",
                text: "Services & Configs",
                action: (_) => showServiceList(),
              },
            ],
          },
        },
      };
    };

    // Internal stuff
    this.token = undefined;
    this.services = undefined;

    let getToken = () => {
      let token = this.token;
      // Function to decode JWT
      function parseJwt(token) {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
          );

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
      if (!token || isJwtExpired(token)) {
        return iics.identityService
          .getJWTToken("cdlg_app", "0xcafebabe")
          .then((x) => (this.token = x.jwt_token));
      } else {
        return Promise.resolve(token);
      }
    };

    function getEffOrgId() {
      return getCookie("SELECTED_ORG_ID") || iics.session.currentOrgId;
    }

    function _cdgcApi(method, url, payload, headers = {}) {
      return getToken()
        .then((x) =>
          method(url, payload, {
            Authorization: "Bearer " + x,
            Accept: "application/json",
            ...headers,
          })
        )
        .then((x) => x.json);
    }

    function getCdgcServiceUrl(serviceName) {
      if (!this.services)
        this.services = _cdgcApi(
          get,
          `/ccgf-service-discovery/api/v1/tms/servicemappingsWithPodInfo/${getEffOrgId()}`
        );
      return this.services.then(
        (s) =>
        s.serviceDetails.filter((s) => s.serviceName == serviceName)[0]
        .serviceVersion.externalServiceUrl
      );
    }

    function cdgcApi(method, api, payload, headers = {}, progress) {
      return progress || progress == undefined ?
        withProgress((_) =>
          getCdgcServiceUrl(api.split("/")[1]).then((url) =>
            _cdgcApi(
              method,
              `${url}${api.substring(1 + api.substr(1).indexOf("/"))}`,
              payload,
              headers
            )
          )
        ) :
        getCdgcServiceUrl(api.split("/")[1]).then((url) =>
          _cdgcApi(
            method,
            `${url}${api.substring(1 + api.substr(1).indexOf("/"))}`,
            payload,
            headers
          )
        );
    }

    function copyActionForCdgcUrl(func, urlGetter, payloadGetter, hdrs) {
      return copyActionFor(() =>
        cdgcApi(
          func,
          urlGetter(),
          payloadGetter ? payloadGetter() : undefined,
          hdrs
        ).then((x) => JSON.stringify(x, undefined, 4))
      );
    }

    function showActionForCdgcUrl(func, urlGetter, payloadGetter, hdrs) {
      return showActionFor(() =>
        cdgcApi(
          func,
          urlGetter(),
          payloadGetter ? payloadGetter() : undefined,
          hdrs
        ).then((x) => JSON.stringify(x, undefined, 4))
      );
    }

    function getDownloadActionForCdgcUrl(urlGetter, fileName) {
      return () =>
        cdgcApi((url, _, hdrs) => download(url, fileName, hdrs), urlGetter());
    }

    function copyJobSummary(jId) {
      cdgcApi(
        get,
        `/ccgf-orchestration-management-api-server/api/v1/jobs/${jId}?aggregateResourceUsage=false`
      ).then((x) => console.log(x));
    }

    function cdgc_searchAsset(ids) {
      return cdgcApi(
        post,
        `/ccgf-searchv2/api/v1/search`, {
          from: 0,
          size: 9,
          query: {
            bool: {
              must: [{
                  terms: {
                    elementType: ["OBJECT"]
                  }
                },
                {
                  terms: {
                    "core.identity": ids
                  }
                },
              ],
            },
          },
        }, {
          "x-infa-search-language": "elasticsearch"
        },
        false
      ).then((x) => x["hits"]["hits"]);
    }

    function cdgc_facetQuery(forObjects, query, facetFields) {
      query["elementType"] = [forObjects ? "OBJECT" : "RELATIONSHIP"];
      let q = {
        from: 0,
        size: 0,
        sort: [],
        include_cdc: false,
        query: {
          bool: {
            must: Object.entries(query).map(([k, v]) => ({
              terms: {
                [k]: v
              },
            })),
          },
        },
        aggs: facetFields.reduce(
          (obj, item) => ({
            ...obj,
            [item]: {
              terms: {
                field: item,
                size: 10000
              }
            },
          }), {}
        ),
      };
      // return as {facetfield: {k1: v1, k2: v2}}
      return cdgcApi(
        post,
        `/ccgf-searchv2/api/v1/search`,
        q, {
          "x-infa-search-language": "elasticsearch"
        },
        false
      ).then((x) =>
        Object.entries(x["aggregations"]).reduce(
          (obj, [k, v]) => ({
            ...obj,
            [k]: v.buckets.reduce(
              (o, i) => ({
                ...o,
                [i.key]: i.docCount
              }), {}
            ),
          }), {}
        )
      );
    }

    function cdgc_triggerExport(
      origin,
      exportObj,
      exportRels,
      oFilters = [],
      eFilters = []
    ) {
      let plod = {
        exportSpecs: [],
        exportLevel: "TABLE"
      };
      if (exportObj)
        plod["exportSpecs"].push({
          namespace: "objects",
          origins: [origin],
          tableSpecs: oFilters.map(( of ) => ({
            name: of ,
            filters: []
          })),
        });
      if (exportRels)
        plod["exportSpecs"].push({
          namespace: "relationships",
          origins: [origin],
          tableSpecs: eFilters.map(( of ) => ({
            name: of ,
            filters: []
          })),
        });
      console.log(plod);
      return cdgcApi(
        post,
        `/ccgf-contentv2/api/v1/diagnostics/content`,
        plod
      ).then((x) => {
        console.log(x);
        getCdgcServiceUrl("mcp-app").then((url) => {
          console.log(`${url}jobInfo/${x.jobId}`);
          window.open(`${url}jobInfo/${x.jobId}`);
        });
      });
    }

    function showCdgcCapabilities() {
      let rows = document
        .querySelector(".asset-list-panel-job-monitor-jobs")
        .querySelectorAll("tr.d-table__body__row"),
        ids = {};
      for (let i = 0; i < rows.length; i++)
        ids[rows[i].getAttribute("data-id")] = rows[i];
      Promise.all(
        Object.keys(ids).map((i) =>
          cdgcApi(
            get,
            `/ccgf-orchestration-management-api-server/api/v1/jobs/${i}?expandChildren=TASK-HIERARCHY`,
            undefined, {},
            false
          )
        )
      ).then((resps) => {
        console.log(resps);
        resps.forEach((j) => {
          let colors = {
            ACTIVE: "black",
            CANCEL_REQUESTED: "black",
            CANCELLED: "black",
            RUNNING: "black",
            STARTING: "black",
            SUBMITTED: "black",
            COMPLETED: "green",
            FAILED: "red",
            PARTIAL_COMPLETED: "orange",
          };
          if (ids[j.id].capAdded) return;
          ids[j.id].capAdded = true;
          ids[j.id].children[1].querySelector(
            "button"
          ).innerHTML += ` <small style='font-size: 0.8em'>(${j.tasks
            .filter((t) => !t.parentTaskId)
            .map((t) => [
              t.status,
              t.name,
              t.name
                .toUpperCase()
                .split(/\s/)
                .map((x) => x[0])
                .join(""),
            ])
            .map(
              ([s, fn, n]) =>
                `<strong style='color: ${colors[s]}' title='${fn}, ${s}'>${n}</strong>`
            )
            .join(", ")})</small>`;
        });
      });
    }

    function showServiceList() {
      cdgcApi(
        get,
        `/tms/odata/v1/TenantServiceStatuses?%24filter=tenantId+eq+%27${getEffOrgId()}%27`
      ).then((x) => {
        console.log(x);
        let keys = [
          "serviceName",
          "serviceStatus",
          "currentServiceVersion",
          "targetServiceVersion",
          "routedServiceVersion",
        ];
        makePopup({
            ele: "div",
            styles: {
              margin: "20px 40px",
              background: "white",
              border: "solid 2px black",
              padding: "5px",
              overflow: "auto",
              position: "relative",
            },
            evnts: {
              click: (_) => _.stopPropagation()
            },
            children: [{
                ele: "table",
                children: [{
                    ele: "tr",
                    children: [...keys, "Action"].map((k) => ({
                      ele: "th",
                      text: k,
                    })),
                  },
                  ...x["value"].map((row) => ({
                    ele: "tr",
                    children: [
                      ...keys.map((k) => ({
                        ele: "td",
                        text: row[k]
                      })),
                      {
                        ele: "button",
                        text: "show config",
                        evnts: {
                          click: (_) =>
                            showServiceConfig(
                              row.serviceName,
                              row.currentServiceVersion
                            ),
                        },
                      },
                    ],
                  })),
                ],
              },
              {
                ele: "div",
                styles: {
                  display: "flex",
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                },
                children: [{
                    ele: "button",
                    text: "copy",
                    evnts: {
                      click: (_) => copyToClip(text)
                    },
                    styles: {
                      marginRight: "5px"
                    },
                  },
                  {
                    ele: "button",
                    text: "x",
                    evnts: {
                      click: (e) =>
                        e.target.parentElement.parentElement.parentElement.click(),
                    },
                  },
                ],
              },
            ],
          },
          "rgba(0,0,0,0.3)"
        );
      });
    }

    function showServiceConfig(sName, sVersion) {
      cdgcApi(
        get,
        `/cms/api/v1/tenant/${getEffOrgId()}/${sName}/${sVersion}/settings`
      ).then((x) => {
        console.log(x);
        let keys = ["keyName", "isRequired", "defaultValue", "value"];
        makePopup({
            ele: "div",
            styles: {
              margin: "20px 40px",
              background: "white",
              border: "solid 2px black",
              padding: "5px",
              overflow: "auto",
              position: "relative",
            },
            evnts: {
              click: (_) => _.stopPropagation()
            },
            children: [{
                ele: "h3",
                text: `${sName}: ${sVersion}`
              },
              {
                ele: "table",
                children: [{
                    ele: "tr",
                    children: keys.map((k) => ({
                      ele: "th",
                      text: k
                    })),
                  },
                  ...x["serviceSettings"]
                  .sort((a, b) => a.keyName.localeCompare(b.keyName))
                  .map((row) => ({
                    ele: "tr",
                    children: keys.map((k) => ({
                      ele: "td",
                      text: row[k]
                    })),
                  })),
                ],
              },
              {
                ele: "div",
                styles: {
                  display: "flex",
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                },
                children: [{
                    ele: "button",
                    text: "copy",
                    evnts: {
                      click: (_) => copyToClip(text)
                    },
                    styles: {
                      marginRight: "5px"
                    },
                  },
                  {
                    ele: "button",
                    text: "x",
                    evnts: {
                      click: (e) =>
                        e.target.parentElement.parentElement.parentElement.click(),
                    },
                  },
                ],
              },
            ],
          },
          "rgba(0,0,0,0.3)"
        );
      });
    }

    function TimelineMonitorView(elem) {
      // get jobs run between provided timestamp
      function getJobs(filters) {
        const PAGE_SIZE = 200;

        function makeUrl(filters, offset, ps) {
          let params = {
            metadataOnly: false,
            offset: offset,
            limit: ps,
            sort: "createdTime:DESC",
            filter: filters,
          };
          let qp = Object.entries(params)
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return value
                  .map(
                    (val) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
                  )
                  .join("&");
              }
              return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            })
            .join("&");
          return `/ccgf-orchestration-management-api-server/api/v1/jobs?${qp}`;
        }

        let fetchPromise = cdgcApi(get, makeUrl(filters, 0, 0)).then((resp) => {
          let proms = [];
          for (let i = 0; i < resp.metadata.totalElements; i += PAGE_SIZE)
            proms.push(cdgcApi(get, makeUrl(filters, i, PAGE_SIZE)));
          return Promise.all(proms);
        });

        return new Promise((res, rej) =>
          fetchPromise.then((responses) =>
            res(responses.flatMap((response) => response.jobs))
          )
        );
      }

      function getJobDetail(id) {
        return cdgcApi(
          get,
          `/ccgf-orchestration-management-api-server/api/v1/jobs/${id}?aggregateResourceUsage=false&expandChildren=INPUT-PROPERTIES&expandChildren=OUTPUT-PROPERTIES&expandChildren=TASK-HIERARCHY&expandChildren=WORKFLOW-DETAILS&expandChildren=OPERATIONS`
        );
      }

      function getJobSpec(id) {
        return cdgcApi(
          get,
          `/ccgf-orchestration-management-api-server/api/v1/jobs/${id}/jobspec`
        );
      }

      function floorDate(date, interval) {
        date = new Date(date);
        if (interval === "day") {
          date.setHours(0, 0, 0, 0);
        } else if (interval === "hour") {
          date.setMinutes(0, 0, 0);
        } else {
          throw new Error('Interval must be either "day" or "hour"');
        }
        return date;
      }

      function ceilDate(date, interval) {
        date = new Date(date);
        if (interval === "day") {
          date.setHours(0, 0, 0, 0);
          date.setDate(date.getDate() + 1);
        } else if (interval === "hour") {
          date.setMinutes(0, 0, 0);
          date.setHours(date.getHours() + 1);
        } else {
          throw new Error('Interval must be either "day" or "hour"');
        }
        return date;
      }

      function interpolateColor(
        min,
        max,
        value,
        startHex = "#D4E5D5",
        endHex = "#204B22"
      ) {
        function hexToRgb(hex) {
          const bigint = parseInt(hex.slice(1), 16);
          return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
          };
        }

        function rgbToHex(r, g, b) {
          return `#${((r << 16) + (g << 8) + b).toString(16).toUpperCase()}`;
        }
        const startColor = hexToRgb(startHex);
        const endColor = hexToRgb(endHex);
        if (value < min) value = min;
        if (value > max) value = max;
        const ratio = (value - min) / (max - min);
        const r = Math.round(
          startColor.r + ratio * (endColor.r - startColor.r)
        );
        const g = Math.round(
          startColor.g + ratio * (endColor.g - startColor.g)
        );
        const b = Math.round(
          startColor.b + ratio * (endColor.b - startColor.b)
        );
        return rgbToHex(r, g, b);
      }

      function TimelineView(
        ele, {
          grpByFunc,
          startKeyFunc,
          endKeyFunc,
          startDate,
          endDate,
          interval,
          clickFunc,
          width,
        },
        data
      ) {
        function* explodeDateRange(startDate, endDate, delta) {
          let current = floorDate(new Date(startDate), delta);
          endDate = floorDate(new Date(endDate), delta);

          while (current <= endDate) {
            yield current;
            current = new Date(current);
            if (delta === "day") {
              current.setDate(current.getDate() + 1);
            } else if (delta === "hour") {
              current.setHours(current.getHours() + 1);
            } else {
              throw new Error("Delta must be either 'day' or 'hour'");
            }
          }
        }

        function spreadIn2DArray(arr, key, start, end, interval, val) {
          const startTime = floorDate(new Date(start), interval).getTime();
          const endTime = floorDate(new Date(end), interval).getTime();
          let increment =
            interval === "hour" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
          let row = arr[key];
          for (let i = startTime; i <= endTime; i += increment) {
            const timestamp = new Date(i).toString();
            if (!row[timestamp]) row[timestamp] = [];
            row[timestamp].push(val);
          }
        }

        data.forEach((d) => (d.___grpKey = grpByFunc(d)));
        let keys = [...new Set(data.map((obj) => obj.___grpKey))];

        let twoDArray = {},
          timeslots = [],
          maxJobs = 0;
        keys.forEach((key) => (twoDArray[key] = {}));
        data.forEach((datum) =>
          spreadIn2DArray(
            twoDArray,
            datum.___grpKey,
            startKeyFunc(datum),
            endKeyFunc(datum),
            interval,
            datum
          )
        );
        for (const date of explodeDateRange(startDate, endDate, interval))
          timeslots.push(floorDate(date, interval));
        keys.forEach((key) =>
          Object.values(twoDArray[key]).forEach(
            (slot) => (maxJobs = Math.max(maxJobs, slot.length))
          )
        );

        let elems = {};
        render(
          "timeline-tab", {
            ele: "div",
            styles: {
              display: "flex",
              width: width
            },
            children: [{
                ele: "div",
                iden: "rowheaders",
                styles: {
                  display: "flex",
                  flexDirection: "column"
                },
              },
              {
                ele: "div",
                styles: {
                  flexGrow: 1,
                  overflowX: "auto"
                },
                children: [{
                  ele: "table",
                  classList: "table",
                  iden: "datatable"
                }, ],
              },
            ],
          },
          (i, e) => (elems[i] = e),
          ele
        );

        render(
          "timeline-tab", {
            ele: "tr",
            children: timeslots.map((slot) => ({
              ele: "th",
              classList: "col-header",
              text: `${interval == "day" ? slot.getDate() : slot.getHours()}`,
              attribs: {
                title: `${slot.toString()}`
              },
            })),
          },
          undefined,
          elems.datatable
        );

        render(
          "timeline-tab", {
            ele: "div",
            children: ["", ...keys].map((key, i) => ({
              ele: "div",
              styles: i ? {
                height: "20px"
              } : {
                border: "solid 1px transparent"
              },
              classList: i ? "row-header" : "col-header",
              children: [{
                ele: "div",
                text: key.toLowerCase()
              }],
            })),
          },
          undefined,
          elems.rowheaders
        );

        for (key of keys) {
          render(
            "timeline-tab", {
              ele: "tr",
              children: timeslots.map((slot) => {
                let vals = twoDArray[key][slot.toString()] || [];
                let val = vals.length;
                return {
                  ele: "td",
                  classList: "cell",
                  // text: `${val}`,
                  evnts: {
                    click: (_) => clickFunc && clickFunc(vals)
                  },
                  attribs: {
                    title: `On: ${slot.toString()}\nNumber of ${key} jobs: ${val}`,
                  },
                  styles: {
                    backgroundColor: val ?
                      interpolateColor(0, maxJobs, val) : "white",
                  },
                };
              }),
            },
            undefined,
            elems.datatable
          );
        }
      }

      function renderView(ele, options, data) {
        ele.innerHTML = "";
        TimelineView(ele, options, data);
      }

      function renderControls(
        ele, {
          updateCallBack,
          intervalTypes,
          jobStates,
          jobTypeFilters,
          groupByKeys,
          startTime,
          endTime,
        }
      ) {
        let elems = {};

        function update() {
          let state = {
            jobClass: elems.jobClass.value,
            nameFilter: elems.nameFilter.value.trim() != "" ? [elems.nameFilter.value.trim()] : [],
            typeFilter: elems.typeFilter.value.trim() != "" ? [elems.typeFilter.value.trim()] : [],
            stateFilter: elems.stateFilter.value,
            startTime: elems.startTime.value,
            endTime: elems.endTime.value,
            groupBy: elems.groupBy.value,
            intervalType: elems.intervalType.value,
          };
          updateCallBack(state);
        }

        render(
          "controls", {
            ele: "div",
            styles: {
              display: "flex"
            },
            children: [{
                ele: "div",
                styles: {
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  paddingRight: "15px",
                },
                children: [{
                    ele: "div",
                    styles: {
                      display: "flex",
                      flexGrow: 1,
                      margin: "5px 0px"
                    },
                    children: [{
                        ele: "select",
                        iden: "jobClass",
                        children: jobTypeFilters.map((i) => ({
                          ele: "option",
                          text: i,
                        })),
                      },
                      {
                        ele: "span",
                        text: '&nbsp; jobs with "'
                      },
                      {
                        ele: "input",
                        iden: "nameFilter",
                        attribs: {
                          placeholder: "*"
                        },
                        styles: {
                          flexGrow: 1,
                          width: "5px"
                        },
                      },
                      {
                        ele: "span",
                        text: '" in their <b>name</b> and "'
                      },
                      {
                        ele: "input",
                        iden: "typeFilter",
                        attribs: {
                          placeholder: "*"
                        },
                        styles: {
                          flexGrow: 1,
                          width: "5px"
                        },
                      },
                      {
                        ele: "span",
                        text: '" in their <b>type</b> and with &nbsp;',
                      },
                      {
                        ele: "select",
                        iden: "stateFilter",
                        styles: {
                          flexGrow: 1,
                          width: "15px"
                        },
                        children: jobStates.map((i, idx) => ({
                          ele: "option",
                          text: i,
                          attribs: {
                            selected: idx == 0
                          },
                        })),
                      },
                      {
                        ele: "span",
                        text: "&nbsp;status"
                      },
                    ],
                  },
                  {
                    ele: "div",
                    styles: {
                      display: "flex",
                      flexGrow: 1,
                      margin: "5px 0px"
                    },
                    children: [{
                        ele: "span",
                        text: "created between:&nbsp;"
                      },
                      {
                        ele: "input",
                        iden: "startTime",
                        attribs: {
                          type: "date",
                          value: startTime
                        },
                        styles: {
                          flexGrow: 1,
                          width: "5px"
                        },
                      },
                      {
                        ele: "span",
                        text: "&nbsp;and &nbsp;"
                      },
                      {
                        ele: "input",
                        iden: "endTime",
                        attribs: {
                          type: "date",
                          value: endTime
                        },
                        styles: {
                          flexGrow: 1,
                          width: "5px"
                        },
                      },
                      {
                        ele: "span",
                        text: "&nbsp; grouped by &nbsp;"
                      },
                      {
                        ele: "select",
                        iden: "groupBy",
                        children: groupByKeys.map((i) => ({
                          ele: "option",
                          text: i,
                        })),
                      },
                      {
                        ele: "span",
                        text: "&nbsp; shown in &nbsp;"
                      },
                      {
                        ele: "select",
                        iden: "intervalType",
                        children: intervalTypes.map((i) => ({
                          ele: "option",
                          text: i,
                        })),
                      },
                      {
                        ele: "span",
                        text: "wise format"
                      },
                    ],
                  },
                ],
              },
              {
                ele: "div",
                children: [{
                  ele: "button",
                  iden: "updateBtn",
                  text: "Update",
                  styles: {
                    height: "100%"
                  },
                  evnts: {
                    click: () => update()
                  },
                }, ],
              },
            ],
          },
          (i, e) => (elems[i] = e),
          ele
        );
        elems.updateBtn.click();
      }

      function jobsClicked(jobs, ele, detailsPane) {
        let props = {
          Id: "id",
          Name: "name",
          "Start time": "startTime",
          "End time": "endTime",
          Status: "status",
        };

        function showStuff(stuffName, jobId) {
          (stuffName == "spec" ? getJobSpec : getJobDetail)(jobId)
          .then((data) => {
              detailsPane.innerText = JSON.stringify(data, undefined, 4);
            })
            .catch((e) => {
              detailsPane.innerText = JSON.stringify(data, undefined, 4);
            })
            .finally(() => {
              popupRef.parentElement.click();
            });
        }
        let popupRef = makePopup({
            ele: "div",
            styles: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
              position: "absolute",
              padding: "20px",
              top: "0px",
              left: "0",
              bottom: "0px",
              right: "0px",
            },
            children: [{
              ele: "div",
              styles: {
                background: "white",
                maxHeight: "500px",
                minWidth: "600px",
                overflow: "auto",
              },
              children: jobs.map((j) => ({
                ele: "div",
                styles: {
                  display: "flex",
                  flexDirection: "column",
                  border: "solid 1px gray",
                  margin: "10px",
                  padding: "5px",
                  position: "relative",
                },
                children: [
                  ...Object.entries(props).map(([l, k]) => ({
                    ele: "div",
                    styles: {
                      margin: "3px"
                    },
                    children: [{
                        ele: "b",
                        text: `${l}: `
                      },
                      {
                        ele: "span",
                        styles: {
                          flexGrow: 1
                        },
                        text: j[k]
                      },
                    ],
                  })),
                  {
                    ele: "div",
                    styles: {
                      position: "absolute",
                      right: "20px",
                      bottom: "20px",
                      display: "flex",
                      flexDirection: "column",
                    },
                    children: [{
                        ele: "button",
                        text: "See job & task details",
                        evnts: {
                          click: (_) => showStuff("detail", j.id)
                        },
                      },
                      {
                        ele: "button",
                        text: "See job spec",
                        evnts: {
                          click: (_) => showStuff("spec", j.id)
                        },
                      },
                    ],
                  },
                ],
              })),
              evnts: {
                click: (e) => e.stopPropagation()
              },
            }, ],
          },
          "rgba(0,0,0,0.3)"
        );
      }

      function initApp() {
        // ui elems
        let view, controls, detailsPane;

        let groupByKeys = {
          "job type": "type",
          "job name": "name",
          "no grouping": "id",
        };
        let jobStates = [
          "Any",
          "ACTIVE",
          "CANCEL_REQUESTED",
          "CANCELLED",
          "COMPLETED",
          "PARTIAL_COMPLETED",
          "FAILED",
          "RUNNING",
          "STARTING",
          "SUBMITTED",
        ];
        let jobTypeFilters = {
          All: [],
          User: [
            "type:NOT_IN:AutoCataloging,Content Sync,Lakehouse Maintenance,System Job,TDS Data Management",
          ],
          "Auto cataloging": ["type:IN:AutoCataloging"],
          System: [
            "type:NOT_IN:AutoCataloging",
            "type:IN:Content Sync,Lakehouse Maintenance,System Job,TDS Data Management",
          ],
        };
        let intervalTypes = ["hour", "day"];
        let endTime = new Date();
        endTime = ceilDate(endTime, "day");
        let startTime = new Date(endTime);
        startTime.setDate(startTime.getDate() - 4);

        let controlOptions = {
          groupByKeys: Object.keys(groupByKeys),
          jobStates,
          jobTypeFilters: Object.keys(jobTypeFilters),
          intervalTypes,
          startTime: startTime.toLocaleDateString("en-CA"),
          endTime: endTime.toLocaleDateString("en-CA"),

          updateCallBack: (state) => {
            let renderOptions = {
              startKeyFunc: (d) => d.startTime || d.createdTime,
              endKeyFunc: (d) => d.endTime || d.updatedTime,
              width: "100%",
              clickFunc: (vals, e) => jobsClicked(vals, e, detailsPane),
            };
            let filters = [];

            jobTypeFilters[state.jobClass].forEach((f) => filters.push(f));
            state.nameFilter.forEach((f) => filters.push(`name:LIKE:%${f}%`));
            state.typeFilter.forEach((f) => filters.push(`type:LIKE:%${f}%`));
            if (state.stateFilter != "Any")
              filters.push(`status:EQ:${state.stateFilter}`);

            renderOptions.startDate = state.startTime + "T00:00:00Z";
            renderOptions.endDate = state.endTime + "T00:00:00Z";
            filters.push(`startTime:GE:${state.startTime}T00:00:00.000Z`);
            filters.push(`endTime:LE:${state.endTime}T00:00:00.000Z`);

            renderOptions.grpByFunc = (x) => x[groupByKeys[state.groupBy]];
            renderOptions.interval = state.intervalType;

            console.log(filters);

            getJobs(filters).then((data) =>
              renderView(view, renderOptions, data)
            );
          },
        };

        // render the containers for controls and view
        let elems = {};
        render(
          "app", {
            ele: "div",
            styles: {
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "100%",
            },
            children: [{
                ele: "div",
                iden: "controls"
              },
              {
                ele: "div",
                iden: "view",
                styles: {
                  maxHeight: "40%",
                  minHeight: "20%",
                  overflowY: "auto",
                },
                children: [{
                  ele: "div",
                  styles: {
                    textAlign: "center",
                    alignContent: "center",
                    height: "calc(100% - 40px)",
                    background: "aliceblue",
                    margin: "20px 0px",
                  },
                  text: "Loading...",
                }, ],
              },
              {
                ele: "b",
                text: "select any job from above to see the details here",
                styles: {
                  height: "40px",
                  alignContent: "end",
                  margin: "5px 0px",
                },
              },
              {
                ele: "div",
                styles: {
                  overflow: "auto",
                  border: "solid 1px lightgray",
                  flexGrow: 1,
                },
                children: [{
                  ele: "pre",
                  iden: "detail",
                  styles: {
                    height: "100%"
                  }
                }, ],
              },
            ],
          },
          (i, e) => (elems[i] = e),
          elem
        );
        (view = elems.view),
        (controls = elems.controls),
        (detailsPane = elems.detail);

        renderControls(controls, controlOptions);
        // lets' not load the view ourselves and duplicate the code. Let is get loaded by the programmatic click
      }

      initApp();
    }

    function cdgc_mcc_showTimeLineView() {
      let margin = "50px";
      TimelineMonitorView(
        makePopup({
            ele: "div",
            styles: {
              background: "white",
              position: "absolute",
              top: margin,
              left: margin,
              right: margin,
              bottom: margin,
              padding: "10px",
            },
            evnts: {
              click: (e) => e.stopPropagation()
            },
          },
          "rgba(0,0,0,0.3)"
        )
      );
    }

    function checkIfConnectionAssignment() {
      // get the id from the page ctxt
      let id = window.location.pathname.split("/").reverse()[0];

      // is it a resource id / assets id?
      let isOriginId = window.location.hostname.includes("mcc.");
      dataSourceCountUnder10k = "";

      let oprom = isOriginId ?
        Promise.resolve(id) :
        cdgc_searchAsset([id]).then(
          (hits) => hits[0]["sourceAsMap"]["core.origin"]
        );
      oprom.then((originid) => {
        cdgcApi(
          post,
          `/ccgf-searchv2/api/v1/search`, {
            from: 0,
            size: 10000,
            sort: [],
            query: {
              bool: {
                must: [{
                    terms: {
                      "core.origin": [originid]
                    }
                  },
                  {
                    terms: {
                      type: ["core.DataSource"]
                    }
                  },
                  {
                    terms: {
                      elementType: ["OBJECT"]
                    }
                  },
                ],
              },
            },
          }, {
            "x-infa-search-language": "elasticsearch"
          },
          false
        ).then((x) => {
          console.log(x);
          let output = [];
          getCdgcServiceUrl("cdlg-app").then((dgc_url) => {
            if (
              x.hits.total["value"] == 10000 &&
              x.hits.total["relation"] == "gte"
            )
              dataSourceCountUnder10k =
              "[ DataSource count exceeds 10K, Analysis is limited to first 10k dataSources... ]";
            else
              dataSourceCountUnder10k =
              "[ Analysed all " + x.hits.totalHits + " dataSources... ]";
            x.hits.hits.forEach((hit) => {
              if (hit.sourceAsMap && hit.sourceAsMap["core.mergeFacts"]) {
                if (hit.sourceAsMap["core.mergeFacts"].length > 0) {
                  output.push({
                    "core.name": hit.sourceAsMap["core.name"],
                    "core.identity": "<a href='" +
                      dgc_url +
                      "/asset/" +
                      hit.sourceAsMap["core.identity"] +
                      "' target='_blank'>" +
                      hit.sourceAsMap["core.identity"] +
                      "</a>",
                    "core.externalId": hit.sourceAsMap["core.externalId"],
                    "core.location": hit.sourceAsMap["core.location"],
                    "core.mergeFacts": hit.sourceAsMap["core.mergeFacts"].map(
                      (row) => {
                        return {
                          ...row,
                          "core.endpointIdentity": "<a href='" +
                            dgc_url +
                            "/asset/" +
                            row["core.endpointIdentity"] +
                            "' target='_blank'>" +
                            row["core.endpointIdentity"] +
                            "</a>",
                        };
                      }
                    ),
                  });
                }
              }
            });
            if (output.length > 0)
              showFmt(
                "Origin " +
                originid +
                " is involved in Connection Assignment...\n" +
                dataSourceCountUnder10k +
                "\n\n" +
                JSON.stringify(output, undefined, 4)
              );
            else
              showFmt(
                "Origin " +
                originid +
                " is not involved in Connection Assignment...\n" +
                dataSourceCountUnder10k +
                "\n\n" +
                JSON.stringify(output, undefined, 4)
              );
            console.log(output);
          });
        });
      });
    }

    function ExportApp() {
      // get the id from the page ctxt
      let id = window.location.pathname.split("/").reverse()[0];

      // is it a resource id / assets id?
      let isOriginId = window.location.hostname.includes("mcc.");

      let oprom = isOriginId ?
        Promise.resolve(id) :
        cdgc_searchAsset([id]).then(
          (hits) => hits[0]["sourceAsMap"]["core.origin"]
        );
      oprom.then((originid) => {
        let otypep = cdgc_facetQuery(true, {
          "core.origin": [originid]
        }, [
          "core.classType",
        ]);
        let etypep = cdgc_facetQuery(false, {
          "core.origin": [originid]
        }, [
          "type",
        ]);
        Promise.all([otypep, etypep]).then(([otypes, etypes]) => {
          otypes = otypes["core.classType"];
          etypes = etypes["type"];

          // these don't show up in ES
          [
            "core_iclassextension",
            "core_datasource",
            "core_datasetextension",
            "core_dataset",
            "core_dataelementprofile",
            "core_dataelement",
          ].forEach((x) => {
            otypes[x] = 1;
          });
          etypes["core_iassociation"] = 1;

          console.log(otypes, etypes);
          let e_obj_types = {},
            e_edge_types = {};
          let makePickers = (types, out_obj) => {
            return {
              ele: "div",
              styles: {
                display: "flex",
                flexDirection: "column",
                margin: "10px 0px",
              },
              children: Object.keys(types).map((typ) => ({
                ele: "div",
                styles: {
                  display: "flex",
                  marginLeft: "10px"
                },
                children: [{
                    ele: "input",
                    iden: `inp-${typ}-${originid}`,
                    attribs: {
                      type: "checkbox"
                    },
                    evnts: {
                      change: (e) => (out_obj[typ] = e.target.checked)
                    },
                  },
                  {
                    ele: "label",
                    attribs: {
                      for: `inp-${typ}-${originid}`
                    },
                    text: typ,
                  },
                ],
              })),
            };
          };
          makePopup({
              ele: "div",
              styles: {
                margin: "20px 40px",
                padding: "10px",
                display: "flex",
                background: "white",
                border: "solid 2px black",
                padding: "5px",
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
              },
              evnts: {
                click: (_) => _.stopPropagation()
              },
              children: [{
                  ele: "h3",
                  text: "Lake export wizard"
                },
                {
                  ele: "b",
                  text: `Exporting assets from origin: ${originid}`
                },
                {
                  ele: "div",
                  styles: {
                    padding: "20px 10px"
                  },
                  children: [{
                      ele: "b",
                      text: "Pick the object types you want to export",
                    },
                    makePickers(otypes, e_obj_types),
                    {
                      ele: "b",
                      text: "Pick the edge types you want to export",
                    },
                    makePickers(etypes, e_edge_types),
                    {
                      ele: "button",
                      text: "Export",
                      evnts: {
                        click: (_) => {
                          let os = Object.entries(e_obj_types)
                            .filter((a) => a[1])
                            .map((a) => a[0]),
                            es = Object.entries(e_edge_types)
                            .filter((a) => a[1])
                            .map((a) => a[0]);
                          cdgc_triggerExport(
                            originid,
                            os.length > 0,
                            es.length > 0,
                            os,
                            es
                          );
                        },
                      },
                    },
                  ],
                },
              ],
            },
            "rgba(0,0,0,0.3)"
          );
        });
      });
    }
  }

  function DQ() {
    // API
    this.getUiConfig = () => {
      return {
        ".*-dqprofile.*": {
          "/profiling-ui/main/profile/.*": {
            menuItems: [{
              group: "Profile defn",
              text: "Show profile defn",
              action: () =>
                showProfileDefn(
                  window.location.pathname.split("/").reverse()[0]
                ),
            }, ],
          },
        },
      };
    };

    function getEffOrgId() {
      return getCookie("SELECTED_ORG_ID") || iics.session.currentOrgId;
    }

    function _DQApi(method, url, payload, headers = {}) {
      return method(url, payload, headers).then((x) => x.json);
    }

    let frsUrl;

    function FrsApi(method, api, payload, headers = {}) {
      if (!frsUrl) {
        frsUrl = _DQApi(get, `/profiling-ui/config`).then((d) => d.frsBaseURL);
      }
      return frsUrl
        .then((url) => method(`${url}${api}`, payload, headers))
        .then((d) => d.json);
    }

    function showProfileDefn(id) {
      FrsApi(get, `/frs/api/v1/Documents('${id}')`)
        .then((doc) => doc.repoInfo.repoHandle)
        .then((pid) => _DQApi(get, `/profiling-service/api/v1/profile/${pid}`))
        .then((json) => showFmt(JSON.stringify(json, undefined, 4)));
    }

    /*
                function copyActionForCdgcUrl(func, urlGetter, payloadGetter, hdrs) {
                    return copyActionFor(() => cdgcApi(func, urlGetter(), payloadGetter?payloadGetter():undefined, hdrs).then(x => JSON.stringify(x, undefined, 4)))
                }
        
                function showActionForCdgcUrl(func, urlGetter, payloadGetter, hdrs) {
                    return showActionFor(() => cdgcApi(func, urlGetter(), payloadGetter?payloadGetter():undefined, hdrs).then(x => JSON.stringify(x, undefined, 4)))
                }
        
                function getDownloadActionForCdgcUrl(urlGetter, fileName) {
                    return () => cdgcApi((url, _, hdrs) => download(url, fileName, hdrs), urlGetter())
                }
        */
  }

  let UIs = {};
  let apps = [CDGC, DQ, CDI];
  let activeSnippets = [];

  function init() {
    let popupbtn = render("popup-btn", {
      ele: "div",
      styles: {
        position: "absolute",
        bottom: "15px",
        left: "15px",
        display: "block",
        height: "40px",
        width: "40px",
        zIndex: 10000,
      },
      children: [{
        ele: "div",
        text: `<img height="40px" width="40px" src='data:image/png;base64,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'/>`,
        styles: {
          width: "100%",
          height: "100%",
          display: "flex"
        },
        evnts: {
          click: function () {
            makeMenu(makeMenuDef());
          },
        },
      }, ],
    });
    document.body.appendChild(popupbtn);
    //new MoveableItem(popupbtn, 15, 15)
    apps.forEach((app) => {
      UIs = {
        ...UIs,
        ...new app().getUiConfig()
      };
    });
  }

  function update(url) {
    activeSnippets.forEach((snippet) => {
      try {
        snippet.deinit && snippet.deinit();
      } catch (e) {
        console.error(e);
      }
    });
    let uis = getUiElems(url);
    activeSnippets = uis.flatMap((ui) => ui.snippets || []).map((s) => new s());
    activeSnippets.forEach((snippet) => {
      try {
        snippet.init && snippet.init();
      } catch (e) {
        console.error(e);
      }
    });
  }

  init();
  window.navigation.addEventListener("navigatesuccess", update);

  /* internal stuff */
  function makeMenu(def, near) {
    makePopup({
      ele: "div",
      classList: "menu",
      styles: {
        background: "lightgrey",
        border: "solid 1px black",
        position: "absolute",
        bottom: "55px",
        left: "15px",
      },
      children: [def],
      evnts: {
        click: function (e) {
          e.stopPropagation();
        },
      },
    });
  }

  function makeMenuDef() {
    let items = getUiElems().flatMap((ui) => ui.menuItems || []);
    let groupBy = (array, key) =>
      array.reduce(
        (result, item) => (
          (result[item[key]] = result[item[key]] || []).push(item), result
        ), {}
      );
    let groups = groupBy(items, "group");
    return {
      ele: "div",
      styles: {
        display: "flex",
        flexDirection: "column"
      },
      children: Object.entries(groups).flatMap(([grpName, items]) => [{
          ele: "div",
          classList: "item-header",
          text: grpName
        },
        ...items.map((item) => ({
          ele: "div",
          children: [{
            ele: "span",
            text: item.text,
            styles: {
              display: "block",
              padding: "3px 8px"
            },
          }, ],
          classList: "item",
          evnts: {
            click: item.action
          },
        })),
      ]),
    };
  }

  function getUiElems() {
    let u = new URL(window.location.href);
    let app = u.hostname.split(".")[0];
    let path = u.pathname;
    let apps = Object.entries(UIs)
      .filter(([k, v]) => new RegExp(k).test(u.hostname))
      .map((x) => x[1]);
    if (!apps.length) return [];
    return Object.entries(apps[0])
      .filter(([p, e]) => new RegExp(p).test(path))
      .map((x) => x[1]);
  }

  function MoveableItem(img, initX, initY) {
    /* non class functions */
    function now() {
      return +new Date();
    }

    function move(img, x, y) {
      img.style.left = `${x}px`;
      img.style.bottom = `${y}px`;
    }

    function rotate(img, deg) {
      img.style.transform = `rotate(${deg}deg)`;
    }

    function decideMoveParams(curX, curY, newX, newY) {
      console.debug(curX, curY, newX, newY);
      // find the distance
      let dist = Math.sqrt(Math.pow(newX - curX, 2) + Math.pow(newY - curY, 2));
      // move these many pixels per frame
      let pxPerFrame = 5;
      // these many steps
      let steps = dist / pxPerFrame;
      // delta X move per step
      let dx = (newX - curX) / steps;
      let dy = (newY - curY) / steps;
      // find the angle too
      let theta = Math.atan2(newY - curY, newX - curX) * (180 / Math.PI);
      console.debug(steps, dx, dy, theta);
      return {
        steps,
        dx,
        dy,
        theta
      };
    }

    /* class functions */
    this.mouseMoved = () => {
      this.lastMove = now();
      if (this.moving) {
        clearInterval(this.moving);
        this.moving = undefined;
        this.setupMotionChecker();
        move(this.img, this.initX, this.initY);
      }
    };

    this.move_look_repeat = () => {
      let moveState = this.moveState;
      if (moveState.steps <= 0) {
        let bcr = document.body.getBoundingClientRect();
        let MX = bcr.width,
          MY = bcr.height;
        //let MX = 400, MY = 400;
        this.moveState = moveState = {
          ...moveState,
          ...decideMoveParams(
            moveState.curX,
            moveState.curY,
            Math.random() * MX,
            Math.random() * MY
          ),
        };
        rotate(this.img, 90 - moveState.theta);
      }
      //console.log(JSON.stringify(moveState))
      move(
        this.img,
        (moveState.curX += moveState.dx),
        (moveState.curY += moveState.dy)
      );
      moveState.steps--;
    };

    // image to move
    this.img = img;
    this.initX = initX;
    this.initY = initY;

    // state of the movement
    this.moveState = {
      curX: initX,
      curY: initY,
      steps: 0,
      dx: 0,
      dy: 0,
      theta: 90,
    };

    // when did mouse move last?
    this.lastMove = now();

    // move schedule
    this.moving = undefined;
    this.motionChecker = undefined;

    this.scheduleMove = () => {
      this.moving = setInterval((_) => this.move_look_repeat(), 50);
    };

    this.checkMotion = () => {
      if (now() - this.lastMove > 5000) {
        clearInterval(this.motionChecker);
        this.scheduleMove();
      }
    };

    this.setupMotionChecker = () => {
      this.motionChecker = setInterval((_) => this.checkMotion(), 5000);
    };

    window.addEventListener("mousemove", (_) => this.mouseMoved());
    this.setupMotionChecker();
  }

  function showHttpReqBuilder() {
    function execute(txt) {
      let head = txt.split("\n")[0];
    }
    makePopup({
        ele: "div",
        styles: {
          margin: "20px 40px",
          display: "flex",
          background: "white",
          border: "solid 2px black",
          padding: "5px",
          overflow: "auto",
        },
        evts: {
          click: (_) => _.stopPropagation()
        },
        children: [{
            ele: "textarea",
            styles: {
              flexGrow: 1
            }
          },
          {
            ele: "button",
            text: "Execute",
            evnts: {
              click: function () {
                execute(this.previousElementSibling.value);
              },
            },
          },
        ],
      },
      "rgba(0,0,0,0.3)"
    );
  }
})();