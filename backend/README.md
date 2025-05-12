# Elite Holidays Backend

This is the backend server for the Elite Holidays application. It provides API endpoints for managing travel packages, reviews, offices, and other features of the application.

## Tech Stack

- Node.js
- Express.js
- MongoDB (with Mongoose)
- Cloudinary (for image storage)
- Clerk (for authentication)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Cloudinary account
- Clerk account

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory with the following variables:

```
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Development

To run the server in development mode with hot-reloading:

```bash
npm run dev
```

### Production Build

To create a production build:

```bash
npm run build
```

This will create a `dist` directory with all the necessary files for deployment.

### Running in Production

To run the production build:

1. Navigate to the `dist` directory
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the provided `.env.example`
4. Start the server:

```bash
npm start
```

## API Endpoints

The backend provides the following API endpoints:

- `/api/heroslides` - Hero slides management
- `/api/travelpackages` - Travel packages management
- `/api/reviews` - Reviews management
- `/api/features` - Features management
- `/api/statistics` - Statistics management
- `/api/groups` - Groups management
- `/api/about-us` - About us information management
- `/api/offices` - Offices management

## Folder Structure

- `controllers/` - Request handlers for each route
- `middleware/` - Express middleware functions
- `models/` - Mongoose models for MongoDB
- `routes/` - Express routes for API endpoints
- `scripts/` - Utility scripts
- `services/` - Service layer for business logic
- `utils/` - Utility functions