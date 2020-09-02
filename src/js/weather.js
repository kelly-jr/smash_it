function updateLocation(timezone) {
  let [geography, city] = timezone.split("/");
  updateValue(".current > .card-content > .card-title > .location", city);
}


function updateCurrentWeather(data) {

  let {temp, dt, feels_like, humidity, sunrise, sunset, uvi, wind_speed, visibility, weather: [{description, icon, main}]} = data;
  dt = moment.unix(dt).format("HH:MM");
  sunrise = moment.unix(sunrise).format("HH:MM");
  sunset = moment.unix(sunset).format("HH:MM");
  temp = Math.round(temp);
  feels_like = Math.round(feels_like);
  visibility = visibility/1000;
  console.log(data);

  updateValue(".current > .card-content > .card-title > .description", description);
  updateValue(".current > .card-content > .temperature > .value", temp);

  updateValue(".data_refresh > .updatable", dt);
  updateValue(".sunrise > .value > .updatable", sunrise);
  updateValue(".sunset > .value > .updatable", sunset);
  updateValue(".wind > .value > .updatable", wind_speed);
  updateValue(".feel > .value > .updatable", feels_like);
  updateValue(".vision > .value > .updatable", visibility);
  updateValue(".uvi > .value > .updatable", uvi);
}

function updateHourlyForecast(data) {
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

    addChildElement(".hourly", hour_element);
  });
}


function updateDailyForecast(data) {
  // Slice removes today from the list of forecast dates
  data.slice(1).map((row, index) => {
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
}


