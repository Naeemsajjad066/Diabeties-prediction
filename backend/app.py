from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model and feature names
model_path = os.path.join('models', 'diabetes_model.joblib')
feature_names_path = os.path.join('models', 'feature_names.joblib')

# Check if model exists, if not, inform user to train the model first
if not os.path.exists(model_path) or not os.path.exists(feature_names_path):
    print("Model files not found. Please run 'python model.py' to train the model first.")
    model = None
    feature_names = None
else:
    model = joblib.load(model_path)
    feature_names = joblib.load(feature_names_path)
    print("Model loaded successfully!")

@app.route('/')
def home():
    return jsonify({
        'status': 'API is running',
        'message': 'Welcome to the Diabetes Prediction API',
        'model_loaded': model is not None
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({
            'error': 'Model not loaded. Please train the model first by running "python model.py"'
        }), 500
    
    try:
        # Get data from request
        data = request.get_json()
        
        # Create a DataFrame with the input data
        input_data = pd.DataFrame({
            'gender': [data['gender']],
            'age': [float(data['age'])],
            'hypertension': [int(data['hypertension'])],
            'heart_disease': [int(data['heart_disease'])],
            'smoking_history': [data['smoking_history']],
            'bmi': [float(data['bmi'])],
            'HbA1c_level': [float(data['HbA1c_level'])],
            'blood_glucose_level': [float(data['blood_glucose_level'])]
        })
        
        # Make prediction
        prediction = model.predict(input_data)[0]
        prediction_proba = model.predict_proba(input_data)[0]
        
        # Return prediction result
        return jsonify({
            'prediction': int(prediction),
            'probability': float(prediction_proba[1]),  # Probability of having diabetes (class 1)
            'message': 'Diabetes detected' if prediction == 1 else 'No diabetes detected'
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 400

@app.route('/api/features', methods=['GET'])
def get_features():
    if feature_names is None:
        return jsonify({
            'error': 'Feature names not loaded. Please train the model first by running "python model.py"'
        }), 500
    
    # Return the feature names and their possible values for categorical features
    return jsonify({
        'numerical_features': feature_names['numerical_features'],
        'categorical_features': feature_names['categorical_features'],
        'gender_options': ['Male', 'Female', 'Other'],
        'smoking_history_options': ['never', 'former', 'current', 'ever', 'No Info']
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)