chrome.action.onClicked.addListener(t=>{
  chrome.scripting.insertCSS({
    target: {tabId: t.id},
    files: ['content-style.css']
  });
  chrome.scripting.executeScript({
    target: {tabId: t.id},
    files: ['content-script.js']
  });
});