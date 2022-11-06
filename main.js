function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

console.log("SWO++: Starting injection");
//document.body.style.backgroundColor = 'orange';
/*
const positionSelect = document.getElementsByClassName("nav-link nav-item");
afterend.insertAdjacentHTML(positionSelect.value, '<strong>inserted');*/
/*
const subject = document.getElementsByClassName("nav-link nav-item");
subject.insertAdjacentText("afterend", '<strong>inserted text</strong>');*/


const h2 = document.getElementById("navbarNav");

const settingsUrl = chrome.runtime.getURL("settings.html");
console.log("SWO++: settingsUrl: " + settingsUrl);

let html = '<a class="nav-link nav-item" href=' + settingsUrl + '>SWO++</a>';
h2.insertAdjacentHTML("afterend", html);




chrome.storage.sync.get(['theme'], function (result) {
  console.log('SWO++: Theme currently is ' + result.theme);
  if (result.theme == "dark") {
    var theme = chrome.runtime.getURL("darktheme.css");
    console.log("SWO++: theme: " + theme);
    //chrome.scripting.insertCSS(activeTab.id, theme);

    /*document.body.style.backgroundColor = '#36393f';
    document.querySelector('h1').style.color = '#dcbe96';
    document.querySelector('p').style.color = '#dcbe96';
    document.querySelector('h3').style.color = '#dcbe96';*/

    document.head.innerHTML = document.head.innerHTML + '<link href="' + theme + '" rel="stylesheet">';
    console.log("SWO++: dark theme applied");

  } else {
    //document.body.style.backgroundColor = 'white !important';
    //document.body.setAttribute( 'style', 'backgroundColor: white !important' );
    var theme = chrome.runtime.getURL("normaltheme.css");
    document.head.innerHTML = document.head.innerHTML + '<link href="' + theme + '" rel="stylesheet">';
  }
});

chrome.storage.sync.get(['loginStatus'], function (result) {
  var link = window.location.href;
  var token = "placeholder";

  chrome.storage.sync.get(['token'], function (result) {
    token = result.token;
  });

  //console.log('SWO++: Login status currently is ' + result.loginStatus);
  if (result.loginStatus == "1" && link == "https://scratchwars-online.cz/cs/account/") {
    console.log("SWO++: LogStatus is 1, fetching id");
    var id = document.querySelector(".user-id").innerHTML;
    id = id.replace("#", "");
    console.log("SWO++: id: " + id);

    chrome.storage.sync.set({ "login": id }, function () {
      console.log("SWO++: Login set to: " + id);

      chrome.storage.sync.set({ "loginStatus": "2" }, function () {
        window.location.href = "https://scratchwars-online.cz/cs/account/collection/" + id;
      });

    });
  } else if (result.loginStatus == "2") {

    chrome.storage.sync.get(['login'], function (result) {
      var login = result.login;

      if (link == "https://scratchwars-online.cz/cs/account/collection/" + login) {
        console.log("SWO++: LogStatus is 2, fetching collection");

        //document.querySelector('[data-hero-family-id="68"]').click();
        //document.querySelectorAll('[data-hero-family-id="68"]')[1].click();

        // implementovat mladého dobrodruha - 103

        if (document.querySelector('[data-hero-family-id="103"]')) {
          var iid = document.querySelectorAll('[data-hero-family-id="103"]')[1].children[0].dataset.iid;
          var cardType = "dobrodruh";
        } else {
          var iid = document.querySelectorAll('[data-hero-family-id="68"]')[1].children[0].dataset.iid;
          var cardType = "saman";
        }
        console.log("SWO++: iid: " + iid);

        //var iid = document.querySelectorAll('[data-hero-family-id="103"]')[1].children[0].dataset.iid;
        /*console.log("SWO++: iid: "+iid);
        if (typeof idd !== 'undefined') {
          var iid = document.querySelectorAll('[data-hero-family-id="68"]')[1].children[0].dataset.iid;
          console.log("SWO++: iid2: "+iid);
      }*/



        chrome.storage.sync.set({ "verifyiid": iid }, function () {

          chrome.storage.sync.get(['pin'], function (result) {
            var pin = result.pin;

            //var response = fetch("https://SWOPPServer.mole06.repl.co/index.php?token="+token+"&iid="+iid+"&login="+login+"&pin="+pin+"&card=saman").then(window.location.href = chrome.runtime.getURL("settings.html"));

            var url = "https://SWOPPServer.mole06.repl.co/index.php?token=" + token + "&iid=" + iid + "&login=" + login + "&pin=" + pin + "&card=" + cardType;

            chrome.storage.sync.set({ "loginStatus": "3" });

            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);

            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                console.log(xhr.status);
                console.log(xhr.responseText);
                chrome.storage.sync.set({ "loginStatus": "3" }, function () {
                  window.location.href = chrome.runtime.getURL("settings.html");
                });

              }
            };

            xhr.send();





            /*
            chrome.storage.sync.set({"loginStatus": "3"}, function() {
              window.location.href = chrome.runtime.getURL("settings.html");
            });*/

          });




        });

      }
    });
  }
});

// check if page is collection

var url = window.location.href;
//console.log("SWO++: url: " + url.split("/")[5]);

if (url.split("/")[5] == "collection") {

  console.log("SWO++: Collection page detected");

  var pos = document.querySelector(".table-responsive");
  let html = '<h3 id="desc-title">Popis hráče</h3> <p id="swopp-desc"></p>';
  pos.insertAdjacentHTML("afterend", html);

  var geturl = "https://swoppserver.mole06.repl.co/profile.php?id=" + url.split("/")[6];

  var rq = new XMLHttpRequest();
  rq.open("GET", geturl);

  rq.onreadystatechange = function () {
    //console.log("SWO++: xhr ready state: " + rq.readyState);
    if (rq.readyState === 4) {
      //console.log(rq.status);
      //console.log("resp"+rq.responseText);


      let desc = JSON.parse(rq.responseText)["description"];

      if (desc == null) {
        desc = "Tento hráč zatím nemá žádný popis nebo nepoužívá SWO++";
        document.getElementById("desc-title").style.display = "none";
        document.getElementById("swopp-desc").style.display = "none";

      }
      console.log("SWO++: desc: " + desc);
      document.getElementById("swopp-desc").innerHTML = desc;
      document.getElementById("swopp-descedit").value = desc;

    }
  };

  rq.send();


  document.getElementById("swopp-desc").insertAdjacentHTML("afterend", '<input type="button" id="swopp-edit" class="btn btn-primary" value="Upravit"> <textarea id="swopp-descedit" rows="4" cols="50"></textarea> <input type="button" id="swopp-editconfirm" class="btn btn-primary" value="Potvrdit">');
  document.getElementById("swopp-descedit").style.display = "none";
  document.getElementById("swopp-editconfirm").style.display = "none";
  chrome.storage.sync.get(['login'], function (result) {


    if (url.split("/")[6] == result.login) {
      console.log("SWO++: Collection page detected, login matches");
      console.log(document.querySelector(".footer"));



    } else {
      console.log("SWO++: Collection page detected, login doesn't match, " + result.login + " vs " + url.split("/")[6]);
      document.getElementById("swopp-edit").style.display = "none";
    }

  });

}

document.getElementById("swopp-edit").addEventListener("click", function () {
  document.getElementById("swopp-edit").style.display = "none";
  document.getElementById("swopp-desc").style.display = "none";
  document.getElementById("swopp-descedit").style.display = "block";
  document.getElementById("swopp-editconfirm").style.display = "block";
});

document.getElementById("swopp-editconfirm").addEventListener("click", function () {
  console.log("SWO++: editconfirm clicked");
  document.getElementById("swopp-edit").style.display = "block";
  document.getElementById("swopp-desc").style.display = "block";
  document.getElementById("swopp-descedit").style.display = "none";
  document.getElementById("swopp-editconfirm").style.display = "none";
  document.getElementById("swopp-desc").innerHTML = document.getElementById("swopp-descedit").value;

  chrome.storage.sync.get(['token'], function (result) {
    var token = result.token;
    chrome.storage.sync.get(['login'], function (result) {

      var geturl = "https://swoppserver.mole06.repl.co/setbio.php?id=" + result.login + "&token=" + token + "&bio=" + document.getElementById("swopp-descedit").value;

      var rq = new XMLHttpRequest();
      rq.open("GET", geturl);

      rq.onreadystatechange = function () {
        //console.log("SWO++: xhr ready state: " + rq.readyState);
        if (rq.readyState === 4) {
          //console.log(rq.status);
          //console.log("resp"+rq.responseText);
        }
      };

      rq.send();
    });
  });

});