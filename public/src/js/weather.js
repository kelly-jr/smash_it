const updateWeatherForecast = {
  "current": function (data) {
    let {main: {temp, temp_max, temp_min, feels_like, humidity}, dt, sys: {sunrise, sunset}, wind: {speed: wind_speed}, visibility, weather: [{description, icon, main}]} = data;

    let dt_date = new Date(dt * 1000);
    let sunrise_date = new Date(sunrise * 1000);
    let sunset_date =   new Date( sunset * 1000);

    dt = `${dt_date.getUTCHours().toString().padStart(2, "0")}:${dt_date.getUTCMinutes().toString().padStart(2, "0")}`;
    sunrise = `${sunrise_date.getUTCHours().toString().padStart(2, '0')}:${sunrise_date.getUTCMinutes().toString().padStart(2, '0')}`
    sunset = `${sunset_date.getUTCHours().toString().padStart(2, '0')}:${sunset_date.getUTCMinutes().toString().padStart(2, '0')}`

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
    clearChildElement(".hourly > .hourly-wrapper");
    data.slice(0, 24).map((row, index) => {
      let {temp, dt, weather: [{description, id, icon, main}]} = row;
      let day_night = icon.slice(-1);
      temp = Math.round(temp);
      let dt_date = new Date(dt * 1000);

      let hour = `${dt_date.getUTCHours().toString().padStart(2, '0')}`
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
    clearChildElement(".daily-forecast");
    data.slice(1, 8).map((row, index) => {
      let {temp, dt, weather: [{description, id, icon, main}]} = row;
      let day_night = icon.slice(-1);
      let {min, max} = temp;
      let dt_date = new Date(dt * 1000);

      let day = days[dt_date.getDay()];

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
  "location": function (city) {
    updateValue(".current > .card-content > .card-title > .location", city);
  }
};


