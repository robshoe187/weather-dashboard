//variable declerations
var searchBtnEl = document.querySelector("#searchBtn")
var cityInputEl = document.querySelector("#searchCity");
var pastSearchEl = document.querySelector("#pastSearch")
var temperatureEl = document.querySelector("#temperature")
var cityEl = document.querySelector("#city")
var humidityEl = document.querySelector("#humidity")
var windEl = document.querySelector("#wind")
var uvEl = document.querySelector("#uv")
var fiveDayForecastEl = document.querySelector("#fiveDayForecast")
var weatherIconEl = document.querySelector("#weatherIcon")
var cityStr = localStorage.getItem("city")
if (cityStr == null) {
    var cityHist = []
} else {cityHist = cityStr.split(",")}

//function to get search and set to localstorage
var searchHandler = function() {
    event.preventDefault();

    var city = cityInputEl.value
    if (city) {
        getAPIData(city)
        cityHist.push(city)
        localStorage.setItem("city", cityHist)
        pastSearchEl.innerHTML += "<div>"+city+"</div>"
        cityInputEl.value = ""

    } else { 
        alert("Please enter a city name")

 }
}

//display the searched citys
var searchHistory = function() {
    for (let i = 0; i < cityHist.length; i++) {
        console.log(cityHist[i])
        //add innerHTML
        pastSearchEl.innerHTML += "<div>"+cityHist[i]+"</div>"
    }
}

//get location data from openweather map API
function getAPIData(search) {

    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+ search +"&limit=1&appid=9e35ef55fdd150a55bb7c4b8b31b4d48"

    fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        console.log(response);
        response.json().then(function(data) {
            var cityLat = data[0].lat
            var cityLon = data[0].lon
            getWeatherData(cityLat, cityLon, search)
        });
      } else {
        alert('Error');
      }
    })
}

//get weather data from openweather
function getWeatherData(lat, lon, search) {
    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&appid=9e35ef55fdd150a55bb7c4b8b31b4d48"
    fetch(weatherUrl)
    .then(function(weather) {
        // request was successful
        if (weather.ok) {
          console.log(weather);
          weather.json().then(function(data) {
            console.log(data)
            weatherIconEl.innerHTML = `<img src= "http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png" alt = "icon"</img>`
            cityEl.innerHTML = "City: " + search
            temperatureEl.innerHTML = "Temperature: " + data.current.temp +"F"
            humidityEl.innerHTML = "Humidity: "+ data.current.humidity + "%"
            windEl.innerHTML = "Wind Speed: " + data.current.wind_speed + "MPH"
            uvEl.innerHTML = "UV Index: " + data.current.uvi
            //Display 5-Day Forecast
            for (let i = 0; i < 5; i++) {
                milliseconds = (data.daily[i].dt)*1000
                d = new Date(milliseconds)
                humandate = d.toLocaleDateString("en-029")
                fiveDayForecastEl.innerHTML += `<li id="date"">Date: ${humandate} <img src = "http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png" alt="icon"</img></li>
                <li id="temperatureFive${i}">Temperature: ${data.daily[i].temp.max}F</li>
                <li id="humidityFive${i}">Humidity: ${data.daily[i].humidity}%</li>
                <li id="windFive${i}">Wind Speed: ${data.daily[i].wind_speed}MPH</li>
                <li id="uvFive${i}">UV Index: ${data.daily[i].uvi}</li>`
            }
          });
        } else {
          alert('Error');
        }
      })
  }

//Event Listener for search button
searchBtnEl.addEventListener("click", searchHandler)
//initial call to pull from localstorage
searchHistory()