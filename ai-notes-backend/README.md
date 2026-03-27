# AI Notes Backend

A Node.js backend API for an AI-based handwritten notes digitizer built with Express.js.

## Project Structure

```
ai-notes-backend/
├── config/              # Configuration files
│   └── app.js          # Express app setup with middleware
├── controllers/         # Request handlers
│   └── healthController.js
├── routes/             # Route definitions
│   └── health.js
├── services/           # Business logic layer
├── models/             # Data models
├── utils/              # Utility functions
│   └── logger.js       # Logger utility
├── .env                # Environment variables (local)
├── .env.example        # Environment variables template
├── server.js           # Server entry point
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## Setup Instructions

### 1. Install Dependencies
Dependencies have already been installed:
- **express** - Web framework
- **cors** - Enable CORS
- **dotenv** - Environment variable support

### 2. Configure Environment
The `.env` file has been created with default development settings. Update it as needed:
```env
NODE_ENV=development
PORT=5000
API_VERSION=1.0.0
```

### 3. Start the Server

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` by default.

## API Endpoints

### Health Check
- **URL**: `/`
- **Method**: `GET`
- **Description**: Returns API health status and metadata
- **Response**:
```json
{
  "success": true,
  "message": "AI Notes Backend is running",
  "timestamp": "2026-03-27T11:25:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "version": "1.0.0"
}
```

## Features Implemented

✅ Express.js server setup
✅ MVC architecture with proper folder structure
✅ CORS enabled for cross-origin requests
✅ JSON body parsing middleware
✅ Dotenv support for environment variables
✅ Health check endpoint (/)
✅ Graceful shutdown handling
✅ Error handling middleware
✅ Logger utility
✅ 404 route handler

## Next Steps

1. **Create Models** - Define data models in `/models`
2. **Create Services** - Implement business logic in `/services`
3. **Create Additional Routes** - Add more API endpoints in `/routes`
4. **Create Controllers** - Implement request handlers in `/controllers`
5. **Add Authentication** - Implement JWT or session-based auth
6. **Add Database** - Connect to PostgreSQL, MongoDB, etc.
7. **Add Validation** - Implement request validation
8. **Add Tests** - Create unit and integration tests

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `API_VERSION` | API version | 1.0.0 |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | ai_notes_db |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `CORS_ORIGIN` | CORS allowed origin | http://localhost:3000 |

## Running the Server

```bash
npm start
```

Server will be available at: `http://localhost:5000`

## License

ISC
