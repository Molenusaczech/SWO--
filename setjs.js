function changeTheme() {
    var value = document.getElementById("theme").value;
    chrome.storage.sync.set({"theme": value}, function() {
        console.log('Theme value is set to ' + value);
        
      });
}

document.getElementById("theme").addEventListener("change", changeTheme);

console.log("SWO++: Starting injection");

chrome.storage.sync.get(['theme'], function(result) {
    console.log('Theme currently is ' + result.theme);
    document.getElementById("theme").value = result.theme;
  });


