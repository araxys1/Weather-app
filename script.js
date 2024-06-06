const apiKey = 'a646760a8emsh43f2863d94cd3b7p126560jsn61dfaffee0ed';
const apiHost = 'visual-crossing-weather.p.rapidapi.com';

async function fetchWeather(city) {
    const currentDate = new Date();
    const pastDate = new Date(currentDate);
    pastDate.setDate(pastDate.getDate() - 7);

    const currentUrl = `https://visual-crossing-weather.p.rapidapi.com/forecast?aggregateHours=24&location=${city}%2CIlocos%20Norte%2CPhilippines&contentType=json&unitGroup=metric&shortColumnNames=0`;
    const historyUrl = `https://visual-crossing-weather.p.rapidapi.com/history?aggregateHours=24&location=${city}%2CIlocos%20Norte%2CPhilippines&startDateTime=${formatDate(pastDate)}T00%3A00%3A00&endDateTime=${formatDate(currentDate)}T00%3A00%3A00&contentType=json&unitGroup=metric&shortColumnNames=0`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': apiHost
        }
    };

    try {
        const [currentResponse, historyResponse] = await Promise.all([fetch(currentUrl, options), fetch(historyUrl, options)]);
        const [currentResult, historyResult] = await Promise.all([currentResponse.json(), historyResponse.json()]);
        displayWeather(currentResult, historyResult);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weather').innerText = 'Error fetching weather data.';
    }
}

function displayWeather(currentData, historyData) {
const weatherDiv = document.getElementById('weather');
weatherDiv.innerHTML = '';

if (currentData && currentData.locations && historyData && historyData.locations) {
const currentLocationKey = Object.keys(currentData.locations)[0];
const historyLocationKey = Object.keys(historyData.locations)[0];

if (currentLocationKey && historyLocationKey) {
    const currentForecast = currentData.locations[currentLocationKey].values[0];
    const historyForecast = historyData.locations[historyLocationKey].values;

    const currentDateTime = currentForecast.datetimeStr.split('T');
    const currentDate = currentDateTime[0];
    const currentTime = formatTime12Hour(currentDateTime[1].split('+')[0]);

    weatherDiv.innerHTML += `
        <div class="weather-section current-weather">
            <h2>Current Weather</h2>
            <p>City/Town: ${currentLocationKey}</p>
            <p>Date: ${currentDate}</p>
            <p>Time: ${currentTime}</p>
            <p>Temperature: ${currentForecast.temp.toFixed(1)} °C</p>
            <p>Wind Speed: ${currentForecast.wspd} m/s</p>
            <p>Humidity: ${currentForecast.humidity}%</p>
        </div>
    `;

    let forecastHTML = `<div class="weather-section"><h2>Previous Week's Weather</h2><div class="forecast">`;
    historyForecast.forEach(forecast => {

        if (forecast.datetimeStr.split('T')[0] !== currentDate) {
            const forecastDateTime = forecast.datetimeStr.split('T');
            const forecastDate = forecastDateTime[0];
            const forecastTime = formatTime12Hour(forecastDateTime[1].split('+')[0]);

            forecastHTML += `
                <div class="forecast-day">
                    <p>Date: ${forecastDate}</p>
                    <p>Time: ${forecastTime}</p>
                    <p>Temperature: ${forecast.temp.toFixed(1)} °C</p>
                    <p>Wind Speed: ${forecast.wspd} m/s</p>
                    <p>Humidity: ${forecast.humidity}%</p>
                </div>
            `;
        }
    });
    forecastHTML += `</div></div>`;
    weatherDiv.innerHTML += forecastHTML;
} else {
    weatherDiv.innerText = 'No weather data available.';
}
} else {
weatherDiv.innerText = 'No weather data available.';
}
}


function formatTime12Hour(time24) {
let [hours, minutes] = time24.split(':');
hours = parseInt(hours, 10);
const ampm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12 || 12;
return `${hours}:${minutes} ${ampm}`;
}

function searchWeather() {
const cityInput = document.getElementById('city');
const city = cityInput.value.trim();
const errorDiv = document.getElementById('error');
errorDiv.innerText = '';

if (city) {
const validCities = [
    "Adams", "Bacarra", "Badoc", "Bangui", "Banna", "Batac",
    "Burgos", "Carasi", "Currimao", "Dingras", "Dumalneg",
    "Laoag", "Marcos", "Nueva Era", "Pagudpud", "Paoay",
    "Piddig", "Pinili", "San Nicolas", "Sarrat", "Solsona", "Vintar",
    "laoag city", "batac city", "Laoag City", "Batac City",
    "Laoag city", "Batac city",  
    "adams", "bacarra", "badoc", "bangui", "banna", "batac",
    "burgos", "carasi", "currimao", "dingras", "dumalneg",
    "laoag", "marcos", "nueva era", "pagudpud", "paoay",
    "piddig", "pinili", "san nicolas", "sarrat", "solsona", "vintar"
];

if (validCities.includes(city)) {
    fetchWeather(city);
} else {
    errorDiv.innerText = 'Please enter a valid city in Ilocos Norte.';
    
    alert('Please enter a valid city in Ilocos Norte.');
 
    cityInput.value = cityInput.defaultValue;
}
} else {
errorDiv.innerText = 'Please enter a city name.';
}
}


function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function preventNumbers(event) {
const input = event.target.value;
const regex = /\d/;
if (regex.test(input)) {
event.target.value = input.replace(regex, '');
}
}