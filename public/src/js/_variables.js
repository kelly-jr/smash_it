const WEATHER_API_KEY = "f47ae49c55b6fb4c7da781cd3ebd92a8";
const OPENCAGE_API_KEY = "77fb67b4922c4cb1ae1b56d22b65abeb";

const WEATHER_URL = `https://api.openweathermap.org/data/2.5/onecall?appid=${WEATHER_API_KEY}&units=metric`;
const CURRENT_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${WEATHER_API_KEY}&units=metric`;
const OPENCAGE_URL = `https://api.opencagedata.com/geocode/v1/json?key=${OPENCAGE_API_KEY}&q=`;

// Default weather location is Nairobi Kenya
var MY_LOCATION = {lat: -1.3025068, lng: 36.5672108};

var home = document.getElementById("home");
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
