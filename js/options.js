function save_options() {
  let timer = document.getElementById("timer").value;
  let irogr = document.getElementById("irogr").value;
  let qid = document.getElementById("qid").value;
  let likesViola = document.getElementById("viola").checked;
  let manage = document.getElementById("manage").checked;
  let clickQ = document.getElementById("clicQ").value;
  let notif = document.getElementById("Notifications").checked;
  let who = document.getElementById("whoami").value;
  chrome.storage.sync.set(
    {
      interval: timer,
      likesViola: likesViola,
      irogr: irogr,
      qid: qid,
      clickQ: clickQ,
      manage: manage,
      Notifications: notif,
      whoami: who,
    },
    function () {
      // Update status to let user know options were saved.
      let status = document.getElementById("status");
      status.textContent = "Options saved.";
      setTimeout(function () {
        status.textContent = "";
      }, 750);
    }
  );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesViola = true.
  chrome.storage.sync.get(
    {
      interval: "5",
      likesViola: true,
      irogr: "15",
      qid: "00G3f000000N38GEAS",
      clickQ: "myCases",
      manage: false,
      Notifications: true,
      whoami: "Product Specialist",
    },
    function (items) {
      document.getElementById("timer").value = items.interval;
      document.getElementById("irogr").value = items.irogr;
      document.getElementById("qid").value = items.qid;
      document.getElementById("viola").checked = items.likesViola;
      document.getElementById("manage").checked = items.manage;
      document.getElementById("clicQ").value = items.clickQ;
      document.getElementById("Notifications").checked = items.Notifications;
      document.getElementById("whoami").value = items.whoami;
    }
  );
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
