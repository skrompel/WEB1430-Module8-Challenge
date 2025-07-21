'use strict';

const API_KEY = 'd8f13f20903049979b543629252007';

// Function to fetch weather from API
async function fetchWeather(city, unit) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`
    );

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Please enter a valid city name.');
      } else {
        throw new Error('Failed to fetch weather data.');
      }
    }

    const data = await response.json();
    const location = data.location;
    const current = data.current;
    const temp = unit === 'C' ? current.temp_c : current.temp_f;
    const unitSymbol = unit === 'C' ? '°C' : '°F';

    return `
      <h2>Weather in ${location.name}, ${location.country}</h2>
      <p><strong>Condition:</strong> ${current.condition.text}</p>
      <p><strong>Temperature:</strong> ${temp}${unitSymbol}</p>
      <p><strong>Humidity:</strong> ${current.humidity}%</p>
      <img src="https:${current.condition.icon}" />
    `;
  } catch (error) {
    return `<p class="error-message"><strong>Error:</strong> ${error.message}</p>`;
  }
}

// DOM Elements
const cityInput = document.getElementById('city');
const searchBtn = document.getElementById('searchBtn');
const weatherResult = document.getElementById('weatherResult');
const unitSelect = document.getElementById('unitSelect');

// Event Listener for search
searchBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    const unit = unitSelect.value;

    if (!city) {
        weatherResult.innerHTML = `<p class="error-message">Please enter a city name.</p>`;
        return;
    }

    // Store last searched city and user preference
    localStorage.setItem('lastCity', city);
    localStorage.setItem('preferredUnit', unit);

    weatherResult.innerHTML = 'Loading...';
    const weather = await fetchWeather(city, unit);
    weatherResult.innerHTML = weather;
});

// Load weather on page load
window.addEventListener('DOMContentLoaded', async () => {
    const lastCity = localStorage.getItem('lastCity');
    const preferredUnit = localStorage.getItem('preferredUnit');

    unitSelect.value = preferredUnit;

    if (lastCity) {
        cityInput.value = lastCity;
        weatherResult.innerHTML = 'Loading...';
        const weather = await fetchWeather(lastCity, preferredUnit);
        weatherResult.innerHTML = weather;
    }
});
