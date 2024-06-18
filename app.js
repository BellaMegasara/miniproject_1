const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar__menu')

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
})

// weather //
document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'b892ac431f7804b056b3bc9d4a0f97ed';
    const city = 'Fremantle,AU';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    console.log('Fetching 4-day weather forecast from:', apiUrl);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Received forecast data:', data);

            const weatherForecastDiv = document.getElementById('weather-forecast');
            weatherForecastDiv.innerHTML = '';

            const forecastMap = new Map();

            data.list.forEach(item => {
                const date = new Date(item.dt * 1000).toLocaleDateString();
                if (!forecastMap.has(date)) {
                    forecastMap.set(date, []);
                }
                forecastMap.get(date).push(item);
            });

            // Extract the next 4 days
            const dates = Array.from(forecastMap.keys()).slice(0, 4);

            dates.forEach(date => {
                const forecastForDate = forecastMap.get(date);
                const tempData = forecastForDate.map(f => f.main.temp);
                const avgTemp = (tempData.reduce((sum, temp) => sum + temp, 0) / tempData.length).toFixed(2);

                const weatherDescription = forecastForDate[0].weather[0].description;

                weatherForecastDiv.innerHTML += `
                    <div class="forecast-item">
                        <h3>${date}</h3>
                        <p><strong>Average Temperature:</strong> ${avgTemp}°C</p>
                        <p><strong>Condition:</strong> ${weatherDescription}</p>
                    </div>
                `;
            });
        })
        .catch(error => {
            const weatherForecastDiv = document.getElementById('weather-forecast');
            weatherForecastDiv.innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
            console.error('Error fetching weather data:', error);
        });
});