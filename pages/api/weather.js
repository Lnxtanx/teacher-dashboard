import axios from 'axios';

export default async function handler(req, res) {
  // Get latitude and longitude from query params
  const { lat, lon } = req.query;
  
  // If lat and lon are not provided, return an error
  if (!lat || !lon) {
    return res.status(400).json({ 
      error: 'Missing location parameters', 
      message: 'Please provide both latitude (lat) and longitude (lon) parameters' 
    });
  }
  
  try {
    // Get API key from environment variables
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    
    if (!API_KEY) {
      console.error('OpenWeather API key is not defined in environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error', 
        message: 'Weather API key is not configured' 
      });
    }
    
    // Make request to OpenWeatherMap API
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    const data = response.data;
    
    // Return formatted weather data
    return res.status(200).json({
      city: data.name,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      icon: getWeatherIcon(data.weather[0].id),
      // You can also use OpenWeatherMap's icons directly:
      // iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    });
  } catch (error) {
    console.error('Weather API Error:', error);
    return res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch weather data',
      message: error.message 
    });
  }
}

// Helper function to map weather condition codes to emoji icons
function getWeatherIcon(conditionCode) {
  // Weather condition mapping based on OpenWeatherMap API condition codes
  // https://openweathermap.org/weather-conditions
  if (conditionCode >= 200 && conditionCode < 300) return '⛈️'; // Thunderstorm
  if (conditionCode >= 300 && conditionCode < 400) return '🌧️'; // Drizzle
  if (conditionCode >= 500 && conditionCode < 600) return '🌧️'; // Rain
  if (conditionCode >= 600 && conditionCode < 700) return '❄️'; // Snow
  if (conditionCode >= 700 && conditionCode < 800) return '🌫️'; // Atmosphere (fog, mist)
  if (conditionCode === 800) return '☀️'; // Clear
  if (conditionCode > 800) return '⛅'; // Clouds
  
  return '☀️'; // Default
}