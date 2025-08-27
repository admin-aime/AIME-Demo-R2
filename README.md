# Air Quality Monitoring and Analytics Platform

A comprehensive web-based platform for monitoring air quality data, providing real-time visualization, analytics, and compliance reporting.

## Features

### Core Functionality
- **Real-time Monitoring**: Live dashboard with current air quality conditions
- **Interactive Mapping**: Geospatial visualization with pollution overlays
- **Historical Analytics**: Trend analysis and data correlation tools
- **Sensor Management**: Device configuration and status monitoring
- **Alert System**: Configurable thresholds with multi-channel notifications
- **Compliance Reporting**: Automated regulatory report generation

### Technical Highlights
- **Modern Stack**: React frontend with Node.js/Express backend
- **Real-time Updates**: WebSocket integration for live data streaming
- **Responsive Design**: Mobile-friendly interface
- **Secure Authentication**: JWT-based user authentication
- **Data Validation**: Comprehensive quality control and anomaly detection
- **Scalable Architecture**: Modular design for easy expansion

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd air-quality-platform
npm install
```

2. **Environment setup:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start the application:**
```bash
npm run dev
```

4. **Access the platform:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Demo Login
- Username: `admin`
- Password: `password`

## Architecture

### Frontend (React)
- **Dashboard**: Real-time overview with key metrics
- **Map View**: Interactive geospatial visualization
- **Analytics**: Historical data analysis tools
- **Sensor Management**: Device configuration interface
- **Alert Configuration**: Threshold and notification settings
- **Reports**: Compliance and custom report generation

### Backend (Node.js/Express)
- **Authentication**: JWT-based user management
- **Data Ingestion**: RESTful APIs for sensor data
- **Real-time Communication**: Socket.IO for live updates
- **Alert Processing**: Automated threshold monitoring
- **Data Storage**: In-memory database (demo) / MongoDB (production)

### Key Components

#### Data Flow
1. **Sensor Data Ingestion** → API endpoints receive IoT sensor data
2. **Data Validation** → Quality control and anomaly detection
3. **Real-time Processing** → WebSocket broadcasting to connected clients
4. **Alert Generation** → Threshold-based alert creation and notification
5. **Historical Storage** → Time-series data storage for analytics

#### AQI Calculation
- EPA-standard Air Quality Index computation
- Support for PM2.5, PM10, O3, CO, NOx, SO2
- Color-coded visualization and health recommendations

## API Documentation

### Authentication
```bash
POST /api/auth/login
GET /api/auth/me
```

### Sensor Management
```bash
GET /api/sensors          # List all sensors
GET /api/sensors/:id      # Get sensor details
POST /api/sensors         # Add new sensor
PUT /api/sensors/:id      # Update sensor
DELETE /api/sensors/:id   # Remove sensor
```

### Data Operations
```bash
POST /api/data/ingest           # Receive sensor data
GET /api/data/current           # Current readings
GET /api/data/historical/:id    # Historical data
```

### Alert Management
```bash
GET /api/alerts           # List alerts
POST /api/alerts          # Create alert
```

## Configuration

### Environment Variables
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: JWT signing secret
- `CLIENT_URL`: Frontend URL for CORS
- `DATABASE_URL`: Database connection string

### Alert Thresholds
Default EPA-based thresholds:
- PM2.5: 35 μg/m³ (moderate), 55 μg/m³ (unhealthy)
- PM10: 150 μg/m³ (moderate), 250 μg/m³ (unhealthy)
- Battery: <20% (maintenance alert)

## Development

### Project Structure
```
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   └── utils/             # Utility functions
├── server/                # Backend Node.js application
│   ├── routes/            # API route handlers
│   ├── middleware/        # Express middleware
│   ├── services/          # Business logic
│   └── database/          # Database operations
└── public/                # Static assets
```

### Adding New Features

1. **New Sensor Types**: Extend data schema in `server/database/init.js`
2. **Custom Alerts**: Modify alert logic in `server/services/dataSimulation.js`
3. **Additional Visualizations**: Add components in `src/components/`
4. **New API Endpoints**: Create routes in `server/routes/`

## Deployment

### Production Setup
1. Set production environment variables
2. Configure external database (MongoDB/PostgreSQL)
3. Set up reverse proxy (nginx)
4. Enable HTTPS/SSL certificates
5. Configure monitoring and logging

### Docker Deployment
```bash
# Build and run with Docker
docker build -t air-quality-platform .
docker run -p 3000:3000 -p 5000:5000 air-quality-platform
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

---

Built with ❤️ for environmental monitoring and public health.
