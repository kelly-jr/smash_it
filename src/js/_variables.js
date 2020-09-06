const WEATHER_API_KEY = "f47ae49c55b6fb4c7da781cd3ebd92a8";
const OPENCAGE_API_KEY = "77fb67b4922c4cb1ae1b56d22b65abeb";

const WEATHER_URL = `https://api.openweathermap.org/data/2.5/onecall?appid=${WEATHER_API_KEY}&units=metric`;
const OPENCAGE_URL =`https://api.opencagedata.com/geojson/v1/geocode?key=${OPENCAGE_API_KEY}&q=London`

const SEARCH_URL = `api.openweathermap.org/data/2.5/weather?q=London&appid=${WEATHER_API_KEY}`;
var MY_LOCATION = {lat: null, lon: null, location: null};
const MY_LOCATION_HANDLER = {
  set(target, key, value) {
    target[key] = value;
    if (MY_LOCATION.lat && MY_LOCATION.lon) {
      getWeatherData({...target});
    }
  }
};
const LOCATION_TRACKER = new Proxy(MY_LOCATION, MY_LOCATION_HANDLER);


const LOGGING = document.getElementById("logging");

