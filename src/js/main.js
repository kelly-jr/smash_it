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
