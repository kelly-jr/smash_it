function getWeatherData() {
  getJSON(`https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=${WEATHER_API_KEY}`, function (status, data) {
    if (status === null) {
      console.log(data);
    }
  });
}


document.addEventListener("DOMContentLoaded", function () {
  getWeatherData();
});
