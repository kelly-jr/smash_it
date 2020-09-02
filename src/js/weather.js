function updateLocation(timezone) {
  let [geography, city] = timezone.split("/");
  updateValue(".current > .card-content > .card-title > .location", city);
}


function updateCurrentWeather(data) {
  let {temp, weather: [{description, icon, main}]} = data;
  temp = Math.round(temp);
  updateValue(".current > .card-content > .card-title > .description", description);
  updateValue(".current > .card-content > .temperature > .value", temp);
}

function updateDailyForecast(data) {
}

function updateHourlyForecast(data) {
  data.slice(0, 24).map((row, index) => {
    let {temp, dt, weather: [{description, id, icon, main}]} = row;
    let day_night = icon.slice(-1)
    temp = Math.round(temp);
    let hour = moment.unix(dt).format("HH");
    let hour_class = "normal";

    if (index === 0) {
      hour = "Now";
      hour_class = "bold";
    }

    let hour_element = `
<div class="hourly__content" id="${hour}">
  <div class=" hour ${hour_class}">
      <span class="updatable">${hour}</span>
  </div>
  <div class=" icon"><i class="owf owf-${id}-${day_night}"></i></div>
  <div class=" temp">
      <span class="updatable">${temp}&deg;</span>
  </div>
</div>
    `;

    addHourlyChild(hour_element);
  });
}

function addHourlyChild(element) {
  document.querySelector(".hourly").innerHTML += element;
}


