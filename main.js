function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
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
console.log("SWO++: settingsUrl: "+settingsUrl);

let html = '<a class="nav-link nav-item" href='+settingsUrl+'>SWO++</a>';
h2.insertAdjacentHTML("afterend", html);




chrome.storage.sync.get(['theme'], function(result) {
    console.log('SWO++: Theme currently is ' + result.theme);
    if (result.theme == "dark") {
        var theme = chrome.runtime.getURL("darktheme.css");
        console.log("SWO++: theme: "+theme);
        //chrome.scripting.insertCSS(activeTab.id, theme);

        /*document.body.style.backgroundColor = '#36393f';
        document.querySelector('h1').style.color = '#dcbe96';
        document.querySelector('p').style.color = '#dcbe96';
        document.querySelector('h3').style.color = '#dcbe96';*/

        document.head.innerHTML = document.head.innerHTML+'<link href="'+theme+'" rel="stylesheet">';
        console.log("SWO++: dark theme applied");

    } else {
      //document.body.style.backgroundColor = 'white !important';
      //document.body.setAttribute( 'style', 'backgroundColor: white !important' );
      var theme = chrome.runtime.getURL("normaltheme.css");
      document.head.innerHTML = document.head.innerHTML+'<link href="'+theme+'" rel="stylesheet">';
    }
  });

chrome.storage.sync.get(['loginStatus'], function(result) {
    var link = window.location.href;
    var token = "placeholder";

    chrome.storage.sync.get(['token'], function(result) {
      token = result.token;
    });

    //console.log('SWO++: Login status currently is ' + result.loginStatus);
    if (result.loginStatus == "1" && link == "https://scratchwars-online.cz/cs/account/") {
      console.log("SWO++: LogStatus is 1, fetching id");
      var id = document.querySelector(".user-id").innerHTML;
      id = id.replace("#", "");
      console.log("SWO++: id: "+id);
      
      chrome.storage.sync.set({"login": id}, function() {
        console.log("SWO++: Login set to: "+id);

        chrome.storage.sync.set({"loginStatus": "2"}, function() {
          window.location.href = "https://scratchwars-online.cz/cs/account/collection/"+id;
        });

      });
    } else if (result.loginStatus == "2") {
      
      chrome.storage.sync.get(['login'], function(result) {
        var login = result.login;

        if (link == "https://scratchwars-online.cz/cs/account/collection/"+login) {
          console.log("SWO++: LogStatus is 2, fetching collection");

          //document.querySelector('[data-hero-family-id="68"]').click();
          //document.querySelectorAll('[data-hero-family-id="68"]')[1].click();

          // implementovat mladého dobrodruha - 103
        
         if (document.querySelector('[data-hero-family-id="103"]')) {
          var iid = document.querySelectorAll('[data-hero-family-id="103"]')[1].children[0].dataset.iid;
          } else {
            var iid = document.querySelectorAll('[data-hero-family-id="68"]')[1].children[0].dataset.iid;
          }
          console.log("SWO++: iid: "+iid);

          //var iid = document.querySelectorAll('[data-hero-family-id="103"]')[1].children[0].dataset.iid;
          /*console.log("SWO++: iid: "+iid);
          if (typeof idd !== 'undefined') {
            var iid = document.querySelectorAll('[data-hero-family-id="68"]')[1].children[0].dataset.iid;
            console.log("SWO++: iid2: "+iid);
        }*/
          
          
          
          chrome.storage.sync.set({"verifyiid": iid}, function() {

            chrome.storage.sync.get(['pin'], function(result) {
              var pin = result.pin;

              //var response = fetch("https://SWOPPServer.mole06.repl.co/index.php?token="+token+"&iid="+iid+"&login="+login+"&pin="+pin+"&card=saman").then(window.location.href = chrome.runtime.getURL("settings.html"));

              var url = "https://SWOPPServer.mole06.repl.co/index.php?token="+token+"&iid="+iid+"&login="+login+"&pin="+pin+"&card=saman";

              chrome.storage.sync.set({"loginStatus": "3"});  
      
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url);
              
              xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                  console.log(xhr.status);
                  console.log(xhr.responseText);
                  chrome.storage.sync.set({"loginStatus": "3"}, function() {
                    window.location.href = chrome.runtime.getURL("settings.html");
                  });    
                  
              }};
        
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