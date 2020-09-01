const WEATHER_API_KEY = "f47ae49c55b6fb4c7da781cd3ebd92a8";
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${WEATHER_API_KEY}`;
var MY_LOCATION = {lat: "", lon: "", location: "Nairobi, ke"};
const MY_LOCATION_HANDLER = {
  set(target, key, value) {
    target[key] = value;
    getWeatherData({...target});
  }
};
const LOCATION_TRACKER = new Proxy(MY_LOCATION, MY_LOCATION_HANDLER);


const LOGGING = document.getElementById("logging");

