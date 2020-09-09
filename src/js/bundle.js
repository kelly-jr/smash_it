const WEATHER_API_KEY = "f47ae49c55b6fb4c7da781cd3ebd92a8";
const OPENCAGE_API_KEY = "77fb67b4922c4cb1ae1b56d22b65abeb";

const WEATHER_URL = `https://api.openweathermap.org/data/2.5/onecall?appid=${WEATHER_API_KEY}&units=metric`;
const CURRENT_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${WEATHER_API_KEY}&units=metric`;
const OPENCAGE_URL = `https://api.opencagedata.com/geocode/v1/json?key=${OPENCAGE_API_KEY}&q=`;

var MY_LOCATION = {lat: null, lng: null};

var home = document.getElementById("home");

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
  let location;

  if(localStorage.getItem("home")){
    location = JSON.parse(localStorage.getItem("home"));
  }

  if (!location) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // debugger;
        MY_LOCATION = {lat: position.coords.latitude, lng: position.coords.longitude};
      });
    }
    location = MY_LOCATION;
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

function addChildElement(selector, element) {
  document.querySelector(selector).innerHTML += element;
}

/*Compares two objects to see if they are equivalent
* @param a {Object} - First object
* @param b {Object} - Second object */

function objectsAreEquivalent(a, b) {
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

const updateWeatherForecast = {
  "current": function (data) {
    let {main:{temp, temp_max, temp_min, feels_like, humidity}, dt, sys:{sunrise, sunset}, wind: {speed: wind_speed}, visibility, weather:[{description, icon, main}]} = data;
    dt = moment.unix(dt).format("HH:MM");
    sunrise = moment.unix(sunrise).format("HH:MM");
    sunset = moment.unix(sunset).format("HH:MM");
    temp = Math.round(temp);
    feels_like = Math.round(feels_like);
    visibility = visibility / 1000;
    temp_max = Math.round(temp_max);
    temp_min = Math.round(temp_min);

    updateValue(".current > .card-content > .card-title > .description", description);
    updateValue(".current > .card-content > .temperature > .value", temp);

    updateValue(".high > p > .value", temp_max);
    updateValue(".low > p > .value", temp_min);

    updateValue(".data_refresh > .updatable", dt);
    updateValue(".sunrise > .value > .updatable", sunrise);
    updateValue(".sunset > .value > .updatable", sunset);
    updateValue(".wind > .value > .updatable", wind_speed);
    updateValue(".feel > .value > .updatable", feels_like);
    updateValue(".vision > .value > .updatable", visibility);
    updateValue(".humidity > .value > .updatable", humidity);
  },
  "hourly": function (data) {
    // Slice to only get 24hr predictions: Including current hr
    data.slice(0, 24).map((row, index) => {
      let {temp, dt, weather: [{description, id, icon, main}]} = row;
      let day_night = icon.slice(-1);
      temp = Math.round(temp);
      let hour = moment.unix(dt).format("HH");
      let hour_class = "normal";

      if (index === 0) {
        hour = "Now";
        hour_class = "bold";
      }

      let hour_element = `
        <div class="hourly__content" id="${hour}">
          <div class=" hour">
              <span class="updatable ${hour_class}">${hour}</span>
          </div>
          <div class=" icon"><i class="owf owf-${id}-${day_night}"></i></div>
          <div class=" temp">
              <span class="updatable">${temp}&deg;</span>
          </div>
        </div>
    `;

      addChildElement(".hourly > .hourly-wrapper", hour_element);
    });
  },
  "daily": function (data) {
    // Slice removes today from the list of forecast dates
    data.slice(1, 8).map((row, index) => {
      let {temp, dt, weather: [{description, id, icon, main}]} = row;
      let day_night = icon.slice(-1);
      let {min, max} = temp;
      let day = moment.unix(dt).format("dddd");

      let element = `
      <div class="col s12">
        <div class="forecast row valign-wrapper">
            <div class="col s4">
                <span class="day">${day}</span>
            </div>
            <div class="col s4 center-align">
                <span class="icon"><i class="owf owf-${id}-${day_night}"></i></span>
            </div>
            <div class="col s2 right-align">
                <span class="high">${Math.round(max)}</span>
            </div>
            <div class="col s2 right-align">
                <span class="low">${Math.round(min)}</span>
            </div>
        </div>
      </div>
    `;

      addChildElement(".daily-forecast", element);
    });
  },
  "location": function(city){
    updateValue(".current > .card-content > .card-title > .location", city);
  }
};


function renderTooltips(){
  tippy('.home', {
    content: "Click to set current location as your home",
    placement: "right"
  })
}

let functionTimeout = null;

function forecast_data(url) {
  getJSON({
    url: url,
    callback: function (data) {
      updateWeatherData(data);
    }
  });
}


function current_data(url) {
  getJSON({
    url: url,
    callback: function (data) {
      let name = data.name;
      let code = data.sys.country;

      updateWeatherForecast.location(`${name}, ${code}`);
      updateWeatherForecast.current(data);
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  getLocation();
  renderTooltips();
});

home.addEventListener("click", setHome);

function checkIfHome() {
  let home_location = JSON.parse(localStorage.getItem("home"));
  let current_location = MY_LOCATION;

  if (objectsAreEquivalent(home_location, current_location)) {
    setHome();
  } else {
    removeHome();
  }
}

function getWeatherData({lat, lng}) {
  if (!lat && !lng) {
    return;
  }

  let url = new URL(WEATHER_URL);
  let current_url = new URL(CURRENT_WEATHER_URL);

  let params = new URLSearchParams(url.search);
  let current_params = new URLSearchParams(url.search);

  if (lat && lng) {
    params.append("lat", lat);
    params.append("lon", lng);

    current_params.append("lat", lat);
    current_params.append("lon", lng);
  }

  let updated_url = `${url.origin}${url.pathname}?${params.toString()}`;
  let current_updated_url = `${current_url.origin}${current_url.pathname}?${current_params.toString()}`;

  // Runs both current and forecast data in parallel
  Promise.all([current_data(current_updated_url), forecast_data(updated_url)]);

  MY_LOCATION = {...MY_LOCATION, lat, lng};
  checkIfHome();
}


function updateWeatherData(data) {
  let {daily, hourly, timezone} = data;

  updateWeatherForecast.daily(daily);
  updateWeatherForecast.hourly(hourly);
}

function setHome() {
  if (!home.classList.contains("active")) {
    home.classList.add("active");
  }

  // Save location to localStorage
  localStorage.setItem("home", JSON.stringify(MY_LOCATION));
}

function removeHome() {
  if (home.classList.contains("active")) {
    home.classList.remove("active");
  }
}

function filterBreakdown() {
  clearTimeout(functionTimeout);

  // Wait 1 secs after key press
  functionTimeout = setTimeout(() => {
    let input = document.getElementById("breakdown_search");

    if (!input) {
      return;
    }

    let filter_value = input.value;
    let search_endpoint = OPENCAGE_URL + filter_value;

    getJSONData(search_endpoint, function (status, data) {
      if (status !== null) {
        console.log("Opencage failed");
      } else {
        let geometry = data.results[0].geometry;

        MY_LOCATION = {...MY_LOCATION, ...geometry};
        getWeatherData({...geometry});
      }
    });
  }, 500);
}
