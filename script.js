var searchBtn = document.getElementById("searchBtn");
var countryInput = document.getElementById("countryInput");
var resultsDiv = document.getElementById("results");
var statusDiv = document.getElementById("status");

var overlay = document.getElementById("overlay");
var weatherTitle = document.getElementById("weatherTitle");
var weatherIcon = document.getElementById("weatherIcon");
var weatherTemp = document.getElementById("weatherTemp");
var weatherExtra = document.getElementById("weatherExtra");
var weatherCodeLine = document.getElementById("weatherCodeLine");
var closeBtn = document.getElementById("closeBtn");

searchBtn.onclick = function(){
    var countryName = countryInput.value;
    getCountryData(countryName);
};

function quickSearch(name){
    countryInput.value = name;
    getCountryData(name);
}

function getCountryData(countryName){

    statusDiv.innerHTML = "Searching for " + countryName + "...";
    resultsDiv.innerHTML = "";

    var url = "https://countries.dev/name/" + countryName;

    fetch(url)
    .then(res => res.json())
    .then(data => showCountries(data))
    .catch(err => statusDiv.innerHTML = "Country not found. Try another name.");

}

function showCountries(data){

    if (!Array.isArray(data)){
        data = [data];
    }

    statusDiv.innerHTML = data.length + " result(s) found";
    resultsDiv.innerHTML = "";

    for (var i = 0; i < data.length; i++){

        var country = data[i];
        var name = country.name;
        var capital = country.capital ? country.capital : "N/A";
        var population = country.population.toLocaleString();
        var region = country.region;
        var area = country.area.toLocaleString();
        var flag = country.flags.png;
        var lat = country.latlng[0];
        var lon = country.latlng[1];

        var currencyName = "N/A";
        if (country.currencies && country.currencies.length > 0){
            currencyName = country.currencies[0].name;
        }

        var languageList = "N/A";
        if (country.languages && country.languages.length > 0){
            var names = [];
            for (var j = 0; j < country.languages.length; j++){
                names.push(country.languages[j].name);
            }
            languageList = names.join(", ");
        }

        var card = document.createElement("div");
        card.className = "card";

        card.innerHTML =
            "<img src='" + flag + "'>" +
            "<div class='card-content'>" +
            "<h3>" + name + "</h3>" +
            "<p><b>Capital:</b> " + capital + "</p>" +
            "<p><b>Region:</b> " + region + "</p>" +
            "<p><b>Population:</b> " + population + "</p>" +
            "<p><b>Area:</b> " + area + " km2</p>" +
            "<p><b>Currency:</b> " + currencyName + "</p>" +
            "<p><b>Languages:</b> " + languageList + "</p>" +
            "<button class='detailsBtn'>More Details (Weather)</button>" +
            "</div>";

        var btn = card.querySelector(".detailsBtn");
        btn.onclick = function(cap, la, lo){
            return function(){
                getWeather(cap, la, lo);
            };
        }(capital, lat, lon);

        resultsDiv.appendChild(card);
    }
}

function getWeatherIcon(code){
    if (code == 0) return "☀️";
    if (code == 1 || code == 2) return "🌤️";
    if (code == 3) return "☁️";
    if (code == 45 || code == 48) return "🌫️";
    if (code >= 51 && code <= 65) return "🌧️";
    if (code >= 71 && code <= 75) return "❄️";
    if (code >= 80 && code <= 82) return "🌦️";
    if (code == 95) return "⛈️";
    return "🌡️";
}

function getWeather(capital, lat, lon){

    weatherTitle.innerHTML = capital + " Weather";
    weatherIcon.innerHTML = "";
    weatherTemp.innerHTML = "...";
    weatherExtra.innerHTML = "Loading...";
    weatherCodeLine.innerHTML = "";
    overlay.style.display = "flex";

    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current_weather=true";

    fetch(url)
    .then(res => res.json())
    .then(data => {

        var temp = data.current_weather.temperature;
        var wind = data.current_weather.windspeed;
        var code = data.current_weather.weathercode;

        weatherIcon.innerHTML = getWeatherIcon(code);
        weatherTemp.innerHTML = temp + " &#8451;";
        weatherExtra.innerHTML = "Wind Speed: " + wind + " km/h";
        weatherCodeLine.innerHTML = "Weather Code: " + code;

    })
    .catch(err => {
        weatherIcon.innerHTML = "⚠️";
        weatherTemp.innerHTML = "";
        weatherExtra.innerHTML = "Could not load weather data.";
        weatherCodeLine.innerHTML = "";
    });

}

closeBtn.onclick = function(){
    overlay.style.display = "none";
};
