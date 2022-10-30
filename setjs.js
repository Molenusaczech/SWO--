function changeTheme() {
    var value = document.getElementById("theme").value;
    chrome.storage.sync.set({"theme": value}, function() {
        console.log('Theme value is set to ' + value);
        
      });
}

function login() {

  var token = makeid(32);
  var pin = document.getElementById("pin").value;

  chrome.storage.sync.set({"token": token});
  chrome.storage.sync.set({"pin": pin});

  chrome.storage.sync.set({"loginStatus": "1"}, function() {
    window.location.href = "https://scratchwars-online.cz/cs/account/";
  });

}

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

document.getElementById("theme").addEventListener("change", changeTheme);
document.getElementById("login").addEventListener("click", login);

console.log("SWO++: Starting injection");

chrome.storage.sync.get(['theme'], function(result) {
    console.log('Theme currently is ' + result.theme);
    document.getElementById("theme").value = result.theme;
  });


chrome.storage.sync.get(['login'], function(result) {
    console.log('Login currently is ' + result.login);
    var login = result.login;
    document.getElementById("logintext").innerHTML = "Logged in as: "+ result.login;

    chrome.storage.sync.get(['token'], function(result) {
      console.log('Token currently is ' + result.token);
      var token = result.token;
      var url = "https://swoppserver.mole06.repl.co/check.php?id="+login+"&token="+token;
      
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          console.log(xhr.status);
          console.log(xhr.responseText);
          
          if (xhr.responseText == "valid") {
            document.getElementById("loginstatus").innerHTML = "Tvoje přihlášení je platné.";
          } else {
            document.getElementById("loginstatus").innerHTML = "Tvoje přihlášení není platné.";
          }
          
      }};

      xhr.send();
      
   

    });
    

});



