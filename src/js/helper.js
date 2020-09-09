var getJSON = ({url, callback, options}) => {
  options = options || {mode: "cors"};

  fetch(url, options)
    .then(status)
    .then(json)
    .then(function (data) {
      callback(data);
    }).catch(function (error) {
    console.log("Request failed", error);
  });
};

function getJSONData(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";
  xhr.onload = function () {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
}

var getLocation = () => {
  let location = MY_LOCATION;

  if (localStorage.getItem("home")) {
    location = JSON.parse(localStorage.getItem("home"));
  }

  getWeatherData({...location});
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

function clearChildElement(selector) {
  document.querySelector(selector).innerHTML = "";
}

function addChildElement(selector, element) {
  document.querySelector(selector).innerHTML += element;
}

/*Compares two objects to see if they are equivalent
* @param a {Object} - First object
* @param b {Object} - Second object */

function objectsAreEquivalent(a, b) {
  if(!a || !b){
    return false;
  }

  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
}
