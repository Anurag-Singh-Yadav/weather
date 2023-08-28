const api_key = "88b60e029409dafaef3086ad8ed47002";
let userTab = document.querySelector("[data-userWeather]");
let searchTab = document.querySelector("[data-searchWeather]");
let searchBar = document.querySelector(".search-bar");
let grandLocation = document.querySelector(".grand-location");
let userInforContainer = document.querySelector(".user-info-container");
let accessButton = document.querySelector('.access-button');
let errorImg = document.querySelector(".error-img");
let loadingContainer = document.querySelector(".loading-container");
let formContainer = document.querySelector(".form-container");
let input = formContainer.querySelector("input");
let currentTab = userTab;

window.onload = () => {
    // grandLocation.classList.remove("hide");
    // getLocation();
    getUserCoordinates();

}

currentTab.classList.add("current-tab");

async function fetchSearchWeatherDetails(city) {
  loadingContainer.classList.remove("hide");
  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`
    );

    let data = await response.json();

    if (data.message === "city not found") {
      throw new Error(data.message);
    }
    loadingContainer.classList.add("hide");
    console.log(data);
    removeErrorImg();
    renderWeather(data);
  } catch (e) {
    // console.log(e);
    loadingContainer.classList.add("hide");
    errorImg.classList.remove("hide");
  }
}

async function fetchYourWeatherDetails(corrdinates) {
  grandLocation.classList.add("hide");
  loadingContainer.classList.remove("hide");
  try {
    console.log(corrdinates);
    let lon = corrdinates.lon;
    let lat = corrdinates.lat;



    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`);
    let data = await response.json();
    // if (data. === "city not found") {
    //     throw new Error(data.message);
    // }
    loadingContainer.classList.add("hide");
    removeErrorImg();
    renderWeather(data);
  } catch (e) {
    // throw(e);
    errorImg.classList.remove("hide");
  }
}

// remove error img

function removeErrorImg() {
  errorImg.classList.add("hide");
}

// render weather

function renderWeather(data) {
  let cityName = document.querySelector("[data-cityName]");
  let countryIcon = document.querySelector("[data-countryIcon]");

  let weatherDisc = document.querySelector("[data-weatherDescription]");
  let weatherIcon = document.querySelector("[data-weatherIcon]");
  let weatherTemp = document.querySelector("[data-weatherTemp]");
  let weatherWind = document.querySelector("[data-weatherWind]");
  let weatherHumidity = document.querySelector("[data-weatherHumidity]");
  let weatherCloud = document.querySelector("[data-weatherCloud]");
  cityName.innerHTML = data?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;

  weatherDisc.innerHTML = data?.weather?.[0]?.main;

  weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;

  weatherTemp.innerHTML = `${data?.main?.temp} °C`;
  weatherWind.innerHTML = `${data?.wind?.speed.toFixed(2)}m/s`;
  weatherHumidity.innerHTML = `${data?.main?.humidity}%`;
  weatherCloud.innerHTML = `${data?.clouds?.all}%`;

  userInforContainer.classList.remove("hide");
}

function getUserCoordinates() {
  loadingContainer.classList.add("hide");
  let localcorrdinates = sessionStorage.getItem("user-corrdinates");
  if (!localcorrdinates) {
    grandLocation.classList.remove("hide");
  } else {
    grandLocation.classList.add("hide");
    const corrdinates = JSON.parse(localcorrdinates);
    fetchYourWeatherDetails(corrdinates);
  }
}

function switchTab(clickedTab) {
  if (currentTab != clickedTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");
    removeErrorImg();

    if (searchBar.classList.contains("hide")) {
      searchBar.classList.remove("hide");
      grandLocation.classList.add("hide");
      userInforContainer.classList.add("hide");
    } else {
      searchBar.classList.add("hide");
      // renderWeather();
      loadingContainer.classList.remove("hide");
      userInforContainer.classList.add("hide");
      getUserCoordinates();
    }
  }
}

function getLocation(){
    if(navigator.geolocation){
        // loadingContainer.classList.remove("hide");
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            let corrdinates = {lat, lon};
            sessionStorage.setItem("user-corrdinates", JSON.stringify(corrdinates));
            fetchYourWeatherDetails(corrdinates);
        });
    }
}

userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

formContainer.addEventListener("submit", (e) => {
  e.preventDefault();
  let city = input.value;
  if (city.length == 0) return;

  fetchSearchWeatherDetails(city);

  input.value = "";
});

accessButton.addEventListener("click", (e) => {
    e.preventDefault();
    grandLocation.classList.add("hide");
    getLocation();
});