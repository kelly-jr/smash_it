let functionTimeout = null;

function getWeatherData({lat, lon, location}) {
  if (!lat && !lon && !location) {
    return;
  }

  let url = new URL(WEATHER_URL);
  let params = new URLSearchParams(url.search);

  if (lat && lon) {
    params.append("lat", lat);
    params.append("lon", lon);
    params.delete("q");
  }

  if (location && (!lat || !lon)) {
    params.delete("lat");
    params.delete("lon");
    params.append("q", location);
  }

  let updated_url = `${url.origin}${url.pathname}?${params.toString()}`;
  getJSON(updated_url, function (data) {
    updateWeatherData(data);
  });
}

function updateWeatherData(data) {
  let {current, daily, hourly, timezone} = data;

  updateWeatherForecast.location(timezone);
  updateWeatherForecast.current(current);
  updateWeatherForecast.daily(daily);
  updateWeatherForecast.hourly(hourly);
}

document.addEventListener("DOMContentLoaded", function () {
  getLocation();
  getWeatherData(MY_LOCATION);
  renderTooltips();
});


function filterBreakdown() {
  clearTimeout(functionTimeout);

  // Wait 1 secs after key press
  functionTimeout = setTimeout(() => {
    let input = document.getElementById("breakdown_search");
    let filter_value = input.value;
    // let search_endpoint = SEARCH_URL + filter_value;

    getJSON(OPENCAGE_URL, (data)=>{
      console.log(data);
    })

    console.log(filter_value);
  }, 1000);
}
