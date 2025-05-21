# Diabetes Prediction Application

This is a full-stack application that uses machine learning to predict diabetes based on user input. The application consists of a Flask backend for the machine learning model and API, and a React frontend for user interaction.

## Project Structure

```
AI Project/
├── diabetes_prediction_dataset.csv  # Original dataset
├── README.md                        # Project documentation
├── backend/                         # Flask backend
│   ├── app.py                       # Main Flask application
│   ├── model.py                     # ML model training script
│   ├── requirements.txt             # Python dependencies
│   └── models/                      # Directory to store trained models
└── frontend/                        # React frontend
    ├── public/                      # Public assets
    ├── src/                         # Source code
    ├── package.json                 # Node.js dependencies
    └── README.md                    # Frontend documentation
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   venv\Scripts\activate  # On Windows
   ```

3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Train the model:
   ```
   python model.py
   ```

5. Run the Flask application:
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Usage

Once both the backend and frontend servers are running, you can access the application at http://localhost:3000. Enter the required information in the form and click "Predict" to get a prediction about diabetes risk.

## Technologies Used

- **Backend**: Flask, Pandas, Scikit-learn, NumPy
- **Frontend**: React, Bootstrap, Axios
- **Machine Learning**: Classification algorithms for diabetes prediction