// setup message handler for API call
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let url = 'https://vagrades.com/api/uvaclass/' + encodeURIComponent(request.courseCode);
  fetch(url)
  .then(response => {
    if(response.ok) {
        return response.json();
    }
    else {
        throw new Error('ERROR:', response.statusText);
    }
  })
  .then(course => sendResponse(course))
  .catch(error => sendResponse(NaN));
  return true;
});