import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_KEY = "your_openweathermap_api_key";

const WeatherPage = () => {
  const { cityName } = useParams(); // Get cityName from the route parameters
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(""); // Clear any previous error
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const weatherData = response.data;

      setWeather({
        temp: weatherData.main.temp,
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        pressure: weatherData.main.pressure,
      });
    } catch (err) {
      setError("Failed to fetch weather data.");
    }
    setLoading(false);
  }, [cityName]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!weather) {
    return <div>No weather data available</div>;
  }

  return (
    <div>
      <h1>Weather in {cityName}</h1>
      <p>Temperature: {weather.temp}°C</p>
      <p>Description: {weather.description}</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Wind Speed: {weather.windSpeed} m/s</p>
      <p>Pressure: {weather.pressure} hPa</p>
    </div>
  );
};

export default WeatherPage;
