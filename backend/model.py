import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# Create models directory if it doesn't exist
os.makedirs('models', exist_ok=True)

# Load the dataset
print("Loading dataset...")
data_path = os.path.join('..', 'diabetes_prediction_dataset.csv')
df = pd.read_csv(data_path)

# Display basic information about the dataset
print("\nDataset Information:")
print(f"Shape: {df.shape}")
print("\nColumns:")
print(df.columns.tolist())
print("\nData Types:")
print(df.dtypes)
print("\nMissing Values:")
print(df.isnull().sum())

# Display basic statistics
print("\nBasic Statistics:")
print(df.describe())

# Display distribution of target variable
print("\nTarget Variable Distribution:")
print(df['diabetes'].value_counts())
print(df['diabetes'].value_counts(normalize=True) * 100)

# Data Preprocessing
print("\nPreprocessing data...")

# Handle missing values if any
df = df.dropna()

# Define features and target
X = df.drop('diabetes', axis=1)
y = df['diabetes']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define categorical and numerical features
categorical_features = ['gender', 'smoking_history']
numerical_features = ['age', 'hypertension', 'heart_disease', 'bmi', 'HbA1c_level', 'blood_glucose_level']

# Create preprocessing pipelines for both numerical and categorical data
numerical_transformer = Pipeline(steps=[
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

# Combine preprocessing steps
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numerical_transformer, numerical_features),
        ('cat', categorical_transformer, categorical_features)
    ])

# Create and train the model pipeline
model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

print("Training model...")
model.fit(X_train, y_train)

# Make predictions and evaluate the model
print("\nEvaluating model...")
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.4f}")

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
cm = confusion_matrix(y_test, y_pred)
print(cm)

# Plot confusion matrix
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
            xticklabels=['No Diabetes', 'Diabetes'],
            yticklabels=['No Diabetes', 'Diabetes'])
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix')
plt.savefig('models/confusion_matrix.png')

# Feature importance
if hasattr(model[-1], 'feature_importances_'):
    # Get feature names after one-hot encoding
    ohe = model.named_steps['preprocessor'].named_transformers_['cat'].named_steps['onehot']
    feature_names = numerical_features + list(ohe.get_feature_names_out(categorical_features))
    
    # Get feature importances
    importances = model[-1].feature_importances_
    
    # Sort feature importances in descending order
    indices = np.argsort(importances)[::-1]
    
    # Print the feature ranking
    print("\nFeature ranking:")
    for f in range(len(feature_names)):
        if f < len(indices):
            print(f"{f + 1}. {feature_names[indices[f]]} ({importances[indices[f]]:.4f})")
    
    # Plot feature importances
    plt.figure(figsize=(10, 6))
    plt.title("Feature Importances")
    plt.bar(range(len(indices)), importances[indices], align="center")
    plt.xticks(range(len(indices)), [feature_names[i] for i in indices], rotation=90)
    plt.tight_layout()
    plt.savefig('models/feature_importance.png')

# Save the model
print("\nSaving model...")
joblib.dump(model, 'models/diabetes_model.joblib')

# Save the column names for later use in the API
joblib.dump({'numerical_features': numerical_features, 'categorical_features': categorical_features},
           'models/feature_names.joblib')

print("\nModel training and evaluation completed!")
print("Model saved as 'models/diabetes_model.joblib'")