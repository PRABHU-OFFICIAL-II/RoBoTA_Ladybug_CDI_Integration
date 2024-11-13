let ucases, qcases;
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
            ucases: [],
            qcases: [],
          },
          function () {
            console.log("Viola: Storage has been reset");
          }
        );
      }
    });
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
    $("#home .form-group").append('<div class="text-center"/>');
    $("#home .form-group .text-center").append('<p id="print"/>');
    $("#home .form-group").append('<div id="viola"/>');
    chrome.storage.sync.get(
      {
        ucases: [],
        qcases: [],
      },
      function (items) {
        if (items.ucases.length != 0) {
          ucases = [...new Set(items.ucases)];
          $("#viola").append('<div id="ucases" class="button-wrapper" />');
          $("#ucases").text("User Cases: ");
          $("#ucases").append('<button type="button" class="btn btn-secondary ubutton btn-space btn-sm">Open All</button>');
          $("#ucases").append("</br>");
          ucases.forEach((c) => {
            $("#ucases").append(`<a href="https://infa.lightning.force.com/lightning/r/Case/${c}/view">${c}</a>`);
            $("#ucases").append("</br>");
          });
        }
        if (items.qcases.length != 0) {
          qcases = [...new Set(items.qcases)];
          $("#viola").append('<p id="qcases" />');
          $("#qcases").text("Queue Cases: ");
          $("#qcases").append('<button type="button" class="btn btn-secondary qbutton btn-space btn-sm">Open All</button>');
          $("#qcases").append("</br>");
          qcases.forEach((c) => {
            $("#qcases").append(`<a href="https://infa.lightning.force.com/lightning/r/Case/${c}/view">${c}</a>`);
            $("#qcases").append("</br>");
          });
        }
      }
    );

    $("#qbutton").click(async function () {
      console.log("qbutton clicked")
      qcases.forEach((c) => {
        window.open(`https://infa.lightning.force.com/lightning/r/Case/${c}/view`);
      });
    });
    $("#ubutton").click(async function () {
      alert("hi");
    });

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
        .then((data) => {
          return data.json();
        })
        .then((podInfo) => {
          console.log("resp-podInfo " + JSON.stringify(podInfo));
          $("#print").text("");
          $("#print").append(
            `Org <b>${podInfo.element[0].orgId}</b> is in <b>${podInfo.element[0].baseUrl.split("//")[1].replace(".informaticacloud.com", "")}</b>`
          );
        });
    });

    $(".DiagonAlleyM").click(async function () {
      if ($("#autod").is(":checked")) {
        $("#print").text("..getting orgid..");
        await getOrgID().then((response) => {
          window.open(sanitizeData(`https://psvglx79app01:8899/?orgID=${response.orgiD}`));
        });
      } else {
        //alert($("#orgiD").val());
        window.open(sanitizeData(`https://psvglx79app01:8899/?orgID=${$("#orgiD").val()}`));
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

    // $("#ubutton").click(async function () {
    //   ucases.forEach((c) => {
    //     window.open(`https://infa.lightning.force.com/lightning/r/Case/${c}/view`);
    //   });
    // });
  });
})(jQuery);
