console.log("SWO++: Starting injection");
//document.body.style.backgroundColor = 'orange';
/*
const positionSelect = document.getElementsByClassName("nav-link nav-item");
afterend.insertAdjacentHTML(positionSelect.value, '<strong>inserted');*/
/*
const subject = document.getElementsByClassName("nav-link nav-item");
subject.insertAdjacentText("afterend", '<strong>inserted text</strong>');*/

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

const h2 = document.getElementById("navbarNav");

const settingsUrl = chrome.runtime.getURL("settings.html");
console.log("SWO++: settingsUrl: "+settingsUrl);

let html = '<a class="nav-link nav-item" href='+settingsUrl+'>SWO++</a>';
h2.insertAdjacentHTML("afterend", html);




chrome.storage.sync.get(['theme'], function(result) {
    console.log('Theme currently is ' + result.theme);
    if (result.theme == "dark") {
        var theme = chrome.runtime.getURL("darktheme.css");
        console.log("SWO++: theme: "+theme);
        //chrome.scripting.insertCSS(activeTab.id, theme);

        /*document.body.style.backgroundColor = '#36393f';
        document.querySelector('h1').style.color = '#dcbe96';
        document.querySelector('p').style.color = '#dcbe96';
        document.querySelector('h3').style.color = '#dcbe96';*/

        document.head.innerHTML = document.head.innerHTML+'<link href="'+theme+'" rel="stylesheet">';

    }
  });

