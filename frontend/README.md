# Diabetes Prediction Frontend

This is the React frontend for the Diabetes Prediction Application. It provides a user-friendly interface for entering patient data and receiving diabetes predictions from the machine learning model.

## Features

- Form for entering patient information
- Real-time validation of input data
- Clear display of prediction results
- Responsive design for all device sizes

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from create-react-app

## API Connection

The frontend connects to the Flask backend API running on http://localhost:5000. Make sure the backend server is running before using the application.

## Technologies Used

- React.js
- React Bootstrap
- Axios for API requests