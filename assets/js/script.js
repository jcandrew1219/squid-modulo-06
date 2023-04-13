var formSearch = document.querySelector('#input-form');
var inputSearch = document.querySelector('#city-input');
var buttonContainer = document.querySelector('.btn-container')
var weatherOutput = document.querySelector('#display-weather');
var APIKey = "1a0b0dbacbeec596fd87fce5f25ce1bc";
var buttonList = [];

//fetches geo coordinates for city
function getGeoCoordinates(input) {
  var geoUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + input + "&limit=5&appid=" + APIKey;

  fetch(geoUrl) 
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var cityData = data[0];
      //console.log(cityData);
      var latitude = cityData.lat;
      var longitude = cityData.lon;
      //console.log(longitude);
      getCityWeather(latitude, longitude);
    })
}

//fetches weather for input city and displays weather
function getCityWeather(latitude, longitude) {
  var weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + APIKey;

  fetch(weatherUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
        console.log(data);
        var listLength = data.list;
        weatherOutput.innerHTML = " ";
        
        //local storage
        handleSetLocal(data);
        
        //dynamic elements for weather output
        for(var i = 0; i < listLength.length; i++) {
            var timeTxt = data.list[i].dt_txt;
            
            //creates element if time is === to noon or current time (0)
            if(timeTxt.includes("12:00:00") || i === 0) {
                var weatherContainer = document.createElement('div');
                var dateEl = document.createElement('h3');
                var iconEl = document.createElement('img');
                var tempEl = document.createElement('p');
                var windEl = document.createElement('p');
                var humidityEl = document.createElement('p');
                if(i === 0) {
                  var futureForecastEl = document.createElement('h3')
                }

                //assigns text to each element
                var dateTxt = timeTxt.split(" ");
                if(i === 0) {
                    dateEl.textContent = data.city.name + "(" + dateTxt[0] + ") ";
                    futureForecastEl.textContent = "5 Day Forecast :";
                } else {
                    dateEl.textContent = "(" + dateTxt[0] + ") ";
                }
                tempEl.textContent = "Temp: " + data.list[i].main.temp + "°F";
                windEl.textContent = "Wind: " + data.list[i].wind.speed + " MPH";
                humidityEl.textContent = "Humidity: " + data.list[i].main.humidity + "%";
                
                //sets attributes based on current or forecasted data
                weatherOutput.setAttribute("style", "align-content: center;");
                if(i === 0) {
                    weatherContainer.setAttribute("style", "border: 2px solid black; width: 100%; padding: 7px; justify-content: space-evenly;");
                    dateEl.setAttribute("style", "display: inline; font-size: 30px; vertical-align: top;");
                    iconEl.setAttribute("style", "display: inline; vertical-align: text-top;");
                    windEl.setAttribute("style", "margin: 4px 0px;");
                    futureForecastEl.setAttribute("style","padding-top: 10px;");
                } else {
                    weatherContainer.setAttribute("style", "background-color: #021530; color: white; width: 19%; margin: 7px 0.5%; padding: 5px; display: inline-block; position: relative; ");
                    dateEl.setAttribute("style", "display: inline; font-size: 20px; vertical-align: top;");
                    iconEl.setAttribute("style", "display: inline; vertical-align: text-top; width: 30px; height: auto;");
                    tempEl.setAttribute("style", "margin: 7px 0px;");
                    windEl.setAttribute("style", "margin: 7px 0px;");
                    humidityEl.setAttribute("style", "margin: 7px 0px;");
                }
                
                iconEl.setAttribute("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png")
                //console.log(data.list[0].dt_txt);
                //console.log(dateEl.textContent);

                //appends elements to the weather output
                weatherOutput.appendChild(weatherContainer);
                if(i === 0) {
                  weatherOutput.appendChild(futureForecastEl);
                }
                weatherContainer.appendChild(dateEl);
                weatherContainer.appendChild(iconEl);
                weatherContainer.appendChild(tempEl);
                weatherContainer.appendChild(windEl);
                weatherContainer.appendChild(humidityEl);
            }
        }


    })
}

//retrieves stored city if there is any
function getStoredCities() {
  var storedCities = [];
  storedCities = JSON.parse(localStorage.getItem("cities"));
  if(storedCities !== null) {
    buttonList = storedCities;
  } 

  renderButtons();
}

function handleSetLocal(data) {
  var cityStore = data.city.name;
  console.log(cityStore);
  if(buttonList.length < 10) {
    buttonList.push(cityStore);
    console.log(buttonList);
    localStorage.setItem("cities", JSON.stringify(buttonList));
    renderButtons();
  } else {
    buttonList.push(cityStore);
    buttonList.shift();
    console.log(buttonList);
    localStorage.setItem("cities", JSON.stringify(buttonList));
    renderButtons();
  }
}

//renders the saved buttons
function renderButtons() {
  buttonContainer.innerHTML = "";

  for(var i = 0; i < buttonList.length; i++) {
    var city = buttonList[i];
    var savedCitiesButton = document.createElement("button");
    savedCitiesButton.textContent = city;
    savedCitiesButton.setAttribute("class", "city-button");
    savedCitiesButton.setAttribute("type", "submit");
    //console.log(savedCitiesButton);
    //console.log(city);
    //console.log(buttonContainer);
    buttonContainer.appendChild(savedCitiesButton);
  }
}

//handles text input
function formSearchHandler(event) {
  //window.location.reload();
  event.preventDefault();
  //console.log(event);
  var input = inputSearch.value;
  if(input == "") {
    alert("Please enter a valid city:");
    return;
  }

  getGeoCoordinates(input);

}

//handles button input
function buttonSearchHandler(btn) {
  //window.location.reload();
  console.log(btn);
  getGeoCoordinates(btn.textContent);

}

getStoredCities();

formSearch.addEventListener('submit', formSearchHandler);

buttonContainer.addEventListener('click', function (event) {
  console.log(event.target);
  if (event.target.type == 'submit') {
    var btnClicked = event.target
    buttonSearchHandler(btnClicked);
  }
})
