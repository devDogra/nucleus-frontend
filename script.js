const API_KEY = "794ee95e63c5a32aaf88cd813fa2e425";

const countryCardTemplate = document.querySelector("#country-card-template");
const container = document.querySelector(".container");

const weatherInfo = document.querySelector(".weather-info");
const weatherInfoHeading = weatherInfo.querySelector("h3");
const tempSpan = weatherInfo.querySelector(".temperature");
const humiditySpan = weatherInfo.querySelector(".humidity");
const windSpan = weatherInfo.querySelector(".wind-data");

async function fetchCountries() {
  const response = await fetch("https://countriesnow.space/api/v0.1/countries");
  let countriesJSON = await response.json();
  let countries = countriesJSON.data;

  displayCountries(countries);
}

fetchCountries();

//---------------------------------------------------------------------------------------
// Creates cards for each country and appends them to the container
// Cards hold the country name, and a button for checking its weather
function displayCountries(countries) {
  for (let country of countries) {
    let countryCard = createNewCard(country);
    container.appendChild(countryCard);
  }
}

function createNewCard(countryObject) {
  let countryCardTemplateClone =
    countryCardTemplate.content.firstElementChild.cloneNode(true);

  let countryNameSpan = countryCardTemplateClone.querySelector(".country-name");
  let countryName = countryObject.country;
  countryNameSpan.innerText = countryName;
  countryCardTemplateClone.id = countryName;

  return countryCardTemplateClone;
}
//---------------------------------------------------------------------------------------

// Logic for showing the weather information window for each country
// Shows the country's weather information if it's not showing already
// If it is already showing, it closes it

document.addEventListener("click", (e) => {
  if (e.target.matches(".country-weather-btn")) {
    let countryCardDiv = e.target.closest(".country-card");
    let countryName = countryCardDiv.id;

    // Update weather info window with the currently clicked country's information
    weatherInfoHeading.innerText = countryName;
    weatherInfo.dataset.country = countryName;

    weatherInfo.toggleAttribute("showing");

    fetchWeatherInfo(countryName).then((weather) => {
      tempSpan.innerText = "Temperature: " + weather.main.temp;
      humiditySpan.innerText = "Humidity: " + weather.main.humidity;
      windSpan.innerText = "Wind speed: " + weather.wind.speed + " kmph";
    });
  } else {
    if (weatherInfo.hasAttribute("showing")) {
      weatherInfo.removeAttribute("showing");
      weatherInfo.dataset.country = "";
    }
  }
});

async function fetchWeatherInfo(countryName) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${countryName}&APPID=${API_KEY}`;
  console.log(url);
  const response = await fetch(url);
  let weatherJSON = await response.json();

  return weatherJSON;
}

fetchWeatherInfo("Algeria");
