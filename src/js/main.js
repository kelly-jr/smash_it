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

  updateLocation(timezone)
  updateCurrentWeather(current);
  updateDailyForecast(daily);
  updateHourlyForecast(hourly);
}

document.addEventListener("DOMContentLoaded", function () {
  getLocation();
  getWeatherData(MY_LOCATION);
});
