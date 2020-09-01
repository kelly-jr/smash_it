function getWeatherData({lat, lon, location}) {
  let url = new URL(WEATHER_URL);
  let params = new URLSearchParams(url.search);

  if (lat && lon) {
    params.append("lat", lat);
    params.append("lon", lon);
    params.delete("q");
  }

  if (location && !(lat || lon)) {
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
  // Todo: Update dom content
  LOGGING.innerText = `${data.name}`;
  console.log(data);
}


document.addEventListener("DOMContentLoaded", function () {
  getLocation();
  getWeatherData(MY_LOCATION);
});
