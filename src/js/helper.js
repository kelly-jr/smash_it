var getJSON = (url, callback) => {
  fetch(url)
    .then(status)
    .then(json)
    .then(function (data) {
      callback(data);
    }).catch(function (error) {
    console.log("Request failed", error);
  });
};

var getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      LOCATION_TRACKER.lat = position.coords.latitude;
      LOCATION_TRACKER.lon = position.coords.longitude;
    });
  }
};

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function json(response) {
  return response.json();
}

function updateValue(selector, value) {
  document.querySelector(selector).innerHTML = value;
}

function addChildElement(selector, element) {
  document.querySelector(selector).innerHTML += element;
}
