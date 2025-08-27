import React, { useState, useEffect } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import GoogleMapComponent from './GoogleMapComponent';
import { 
  Activity, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  Wind,
  Thermometer,
  Droplets,
  Eye
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [currentData, setCurrentData] = useState({
    sensors: [],
    alerts: [],
    weatherData: {},
    historicalData: []
  });

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockSensors = [
      {
        id: 1,
        name: 'Downtown Station',
        latitude: 40.7589,
        longitude: -73.9851,
        aqi: 85,
        pm25: 35.2,
        pm10: 45.8,
        no2: 28.5,
        o3: 42.1,
        co: 1.2,
        so2: 8.3,
        status: 'online',
        lastUpdate: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Central Park',
        latitude: 40.7829,
        longitude: -73.9654,
        aqi: 42,
        pm25: 18.5,
        pm10: 25.2,
        no2: 15.8,
        o3: 38.9,
        co: 0.8,
        so2: 4.2,
        status: 'online',
        lastUpdate: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Industrial Zone',
        latitude: 40.7282,
        longitude: -74.0776,
        aqi: 156,
        pm25: 68.4,
        pm10: 89.7,
        no2: 45.2,
        o3: 28.6,
        co: 2.1,
        so2: 18.9,
        status: 'online',
        lastUpdate: new Date().toISOString()
      },
      {
        id: 4,
        name: 'Residential Area',
        latitude: 40.7505,
        longitude: -73.9934,
        aqi: 63,
        pm25: 24.8,
        pm10: 32.1,
        no2: 19.4,
        o3: 35.7,
        co: 1.0,
        so2: 6.8,
        status: 'maintenance',
        lastUpdate: new Date(Date.now() - 3600000).toISOString()
      }
    ];

    const mockHistoricalData = Array.from({ length: 24 }, (_, i) => ({
      time: `${23 - i}:00`,
      aqi: Math.floor(Math.random() * 100) + 20,
      pm25: Math.floor(Math.random() * 50) + 10,
      pm10: Math.floor(Math.random() * 80) + 15
    }));

    const mockAlerts = [
      {
        id: 1,
        type: 'warning',
        message: 'PM2.5 levels elevated in Industrial Zone',
        timestamp: new Date().toISOString(),
        sensor: 'Industrial Zone'
      },
      {
        id: 2,
        type: 'maintenance',
        message: 'Sensor offline: Residential Area',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        sensor: 'Residential Area'
      }
    ];

    setCurrentData({
      sensors: mockSensors,
      alerts: mockAlerts,
      weatherData: {
        temperature: 22,
        humidity: 65,
        windSpeed: 12,
        visibility: 8.5
      },
      historicalData: mockHistoricalData
    });
  }, []);

  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { label: 'Good', color: 'text-green-600', bg: 'bg-green-100' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-600', bg: 'bg-red-100' };
    if (aqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-600', bg: 'bg-purple-100' };
    return { label: 'Hazardous', color: 'text-red-800', bg: 'bg-red-200' };
  };

  const averageAQI = currentData.sensors.reduce((sum, sensor) => sum + sensor.aqi, 0) / currentData.sensors.length || 0;
  const aqiStatus = getAQIStatus(Math.round(averageAQI));

  const render = (status) => {
    if (status === 'LOADING') return <div>Loading...</div>;
    if (status === 'FAILURE') return <div>Error loading Google Maps</div>;
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Air Quality Monitor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average AQI</p>
                <p className="text-3xl font-bold text-gray-900">{Math.round(averageAQI)}</p>
                <p className={`text-sm ${aqiStatus.color}`}>{aqiStatus.label}</p>
              </div>
              <div className={`p-3 rounded-full ${aqiStatus.bg}`}>
                <Activity className={`h-6 w-6 ${aqiStatus.color}`} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sensors</p>
                <p className="text-3xl font-bold text-gray-900">
                  {currentData.sensors.filter(s => s.status === 'online').length}
                </p>
                <p className="text-sm text-gray-500">of {currentData.sensors.length} total</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-3xl font-bold text-gray-900">{currentData.alerts.length}</p>
                <p className="text-sm text-orange-600">Requires attention</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Data Quality</p>
                <p className="text-3xl font-bold text-gray-900">98.5%</p>
                <p className="text-sm text-green-600">Excellent</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Real-time Monitoring Map</h2>
                <p className="text-sm text-gray-600">Live air quality data from sensor network</p>
              </div>
              <div className="p-6">
                <div style={{ height: '500px' }}>
                  <Wrapper 
                    apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} 
                    render={render}
                  >
                    <GoogleMapComponent
                      sensors={currentData.sensors}
                      selectedSensor={selectedSensor}
                      onSensorSelect={setSelectedSensor}
                      center={{ lat: 40.7589, lng: -73.9851 }}
                      zoom={11}
                    />
                  </Wrapper>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather Conditions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Weather Conditions</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-600">Temperature</span>
                  </div>
                  <span className="text-sm font-medium">{currentData.weatherData.temperature}°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Humidity</span>
                  </div>
                  <span className="text-sm font-medium">{currentData.weatherData.humidity}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Wind Speed</span>
                  </div>
                  <span className="text-sm font-medium">{currentData.weatherData.windSpeed} km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Visibility</span>
                  </div>
                  <span className="text-sm font-medium">{currentData.weatherData.visibility} km</span>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {currentData.alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Sensor Details */}
            {selectedSensor && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedSensor.name}</h3>
                  <p className="text-sm text-gray-600">Detailed sensor readings</p>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">AQI</span>
                    <span className="text-sm font-medium">{selectedSensor.aqi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">PM2.5</span>
                    <span className="text-sm font-medium">{selectedSensor.pm25} μg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">PM10</span>
                    <span className="text-sm font-medium">{selectedSensor.pm10} μg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">NO₂</span>
                    <span className="text-sm font-medium">{selectedSensor.no2} ppb</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">O₃</span>
                    <span className="text-sm font-medium">{selectedSensor.o3} ppb</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">CO</span>
                    <span className="text-sm font-medium">{selectedSensor.co} ppm</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Historical Trends */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Historical Trends</h3>
              <p className="text-sm text-gray-600">AQI trends over time</p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={currentData.historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="aqi" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pollutant Levels */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Current Pollutant Levels</h3>
              <p className="text-sm text-gray-600">Average across all sensors</p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: 'PM2.5', value: currentData.sensors.reduce((sum, s) => sum + s.pm25, 0) / currentData.sensors.length },
                  { name: 'PM10', value: currentData.sensors.reduce((sum, s) => sum + s.pm10, 0) / currentData.sensors.length },
                  { name: 'NO₂', value: currentData.sensors.reduce((sum, s) => sum + s.no2, 0) / currentData.sensors.length },
                  { name: 'O₃', value: currentData.sensors.reduce((sum, s) => sum + s.o3, 0) / currentData.sensors.length },
                  { name: 'CO', value: currentData.sensors.reduce((sum, s) => sum + s.co, 0) / currentData.sensors.length },
                  { name: 'SO₂', value: currentData.sensors.reduce((sum, s) => sum + s.so2, 0) / currentData.sensors.length }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
