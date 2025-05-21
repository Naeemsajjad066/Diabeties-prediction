import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner, Navbar, Nav } from 'react-bootstrap';
import axios from 'axios';
import './App.css';

function App() {
  // State for form data
  const [formData, setFormData] = useState({
    gender: 'Male',
    age: '',
    hypertension: '0',
    heart_disease: '0',
    smoking_history: 'never',
    bmi: '',
    HbA1c_level: '',
    blood_glucose_level: ''
  });

  // State for prediction result
  const [prediction, setPrediction] = useState(null);
  
  // State for loading status
  const [loading, setLoading] = useState(false);
  
  // State for error message
  const [error, setError] = useState(null);
  
  // State for feature options
  const [featureOptions, setFeatureOptions] = useState({
    gender_options: ['Male', 'Female', 'Other'],
    smoking_history_options: ['never', 'former', 'current', 'ever', 'No Info']
  });

  // State for API status
  const [apiStatus, setApiStatus] = useState({
    running: false,
    modelLoaded: false
  });

  // Fetch feature options from the API when component mounts
  useEffect(() => {
    // Check if API is running
    axios.get('/api/features')
      .then(response => {
        setFeatureOptions({
          gender_options: response.data.gender_options,
          smoking_history_options: response.data.smoking_history_options
        });
        setApiStatus({
          running: true,
          modelLoaded: true
        });
      })
      .catch(error => {
        console.error('Error fetching features:', error);
        setApiStatus({
          running: error.response ? true : false,
          modelLoaded: false
        });
      });
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.post('/api/predict', formData);
      setPrediction(response.data);
    } catch (error) {
      console.error('Error making prediction:', error);
      setError(error.response?.data?.error || 'An error occurred while making the prediction');
    } finally {
      setLoading(false);
    }
  };

  // Reset form and prediction
  const handleReset = () => {
    setFormData({
      gender: 'Male',
      age: '',
      hypertension: '0',
      heart_disease: '0',
      smoking_history: 'never',
      bmi: '',
      HbA1c_level: '',
      blood_glucose_level: ''
    });
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="app-wrapper">
      {/* Navbar */}
      <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="custom-navbar">
        <Container>
          <Navbar.Brand href="#home">Diabetes Prediction App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#prediction">Prediction</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div className="hero-section" id="home">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="text-center text-lg-start">
              <h1 className="hero-title">Diabetes Risk Assessment</h1>
              <p className="hero-subtitle">Use our AI-powered tool to assess your risk of diabetes based on health parameters</p>
              <Button variant="light" size="lg" href="#prediction" className="hero-button">Get Started</Button>
            </Col>
            <Col lg={6} className="text-center mt-4 mt-lg-0">
              <img src="https://cdn.pixabay.com/photo/2020/07/08/04/12/work-5382501_1280.jpg" alt="Healthcare illustration" className="hero-image img-fluid rounded shadow" />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <div className="features-section py-5" id="features">
        <Container>
          <h2 className="text-center mb-5">Key Features</h2>
          <Row>
            <Col md={4} className="mb-4">
              <div className="feature-card text-center p-4">
                <div className="feature-icon mb-3">📊</div>
                <h3>Accurate Predictions</h3>
                <p>Our model is trained on extensive medical data to provide accurate diabetes risk assessment</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="feature-card text-center p-4">
                <div className="feature-icon mb-3">🔒</div>
                <h3>Secure & Private</h3>
                <p>Your health data remains private and is not stored after prediction</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="feature-card text-center p-4">
                <div className="feature-icon mb-3">⚡</div>
                <h3>Instant Results</h3>
                <p>Get your diabetes risk assessment in seconds with our fast prediction engine</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Prediction Form Section */}
      <div className="prediction-section py-5" id="prediction">
        <Container className="py-3">
          <Row className="justify-content-center mb-4">
            <Col md={10} lg={8}>
              <Card className="shadow prediction-card">
                <Card.Header className="bg-primary text-white text-center">
                  <h2 className="h3 mb-0">Diabetes Prediction</h2>
                </Card.Header>
                <Card.Body>
                  {!apiStatus.running && (
                    <Alert variant="danger">
                      The API server is not running. Please start the Flask backend server.
                    </Alert>
                  )}
                  
                  {apiStatus.running && !apiStatus.modelLoaded && (
                    <Alert variant="warning">
                      The model is not loaded. Please run <code>python model.py</code> in the backend directory to train the model.
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Gender</Form.Label>
                          <Form.Select 
                            name="gender" 
                            value={formData.gender} 
                            onChange={handleChange}
                            required
                          >
                            {featureOptions.gender_options.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Age</Form.Label>
                          <Form.Control 
                            type="number" 
                            name="age" 
                            value={formData.age} 
                            onChange={handleChange} 
                            placeholder="Enter age"
                            min="0"
                            max="120"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Hypertension</Form.Label>
                          <Form.Select 
                            name="hypertension" 
                            value={formData.hypertension} 
                            onChange={handleChange}
                            required
                          >
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Heart Disease</Form.Label>
                          <Form.Select 
                            name="heart_disease" 
                            placeholder=""
                            value={formData.heart_disease} 
                            onChange={handleChange}
                            required
                          >
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Smoking History</Form.Label>
                          <Form.Select 
                            name="smoking_history" 
                            value={formData.smoking_history} 
                            onChange={handleChange}
                            required
                          >
                            {featureOptions.smoking_history_options.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>BMI</Form.Label>
                          <Form.Control 
                            type="number" 
                            name="bmi" 
                            value={formData.bmi} 
                            onChange={handleChange} 
                            placeholder="Enter BMI"
                            step="0.01"
                            min="10"
                            max="60"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>HbA1c Level</Form.Label>
                          <Form.Control 
                            type="number" 
                            name="HbA1c_level" 
                            value={formData.HbA1c_level} 
                            onChange={handleChange} 
                            placeholder="Enter HbA1c level"
                            step="0.1"
                            min="3"
                            max="9"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Blood Glucose Level</Form.Label>
                          <Form.Control 
                            type="number" 
                            name="blood_glucose_level" 
                            value={formData.blood_glucose_level} 
                            onChange={handleChange} 
                            placeholder="Enter blood glucose level"
                            min="70"
                            max="300"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                      <Button variant="secondary" onClick={handleReset} className="me-md-2">
                        Reset
                      </Button>
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading || !apiStatus.running || !apiStatus.modelLoaded}
                      >
                        {loading ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            <span className="ms-2">Predicting...</span>
                          </>
                        ) : 'Predict'}
                      </Button>
                    </div>
                  </Form>

                  {error && (
                    <Alert variant="danger" className="mt-4">
                      {error}
                    </Alert>
                  )}

                  {prediction && (
                    <Card className={`mt-4 ${prediction.prediction === 1 ? 'border-danger' : 'border-success'}`}>
                      <Card.Header className={prediction.prediction === 1 ? 'bg-danger text-white' : 'bg-success text-white'}>
                        <h5 className="mb-0">Prediction Result</h5>
                      </Card.Header>
                      <Card.Body>
                        <h4 className="text-center mb-4">
                          {prediction.prediction === 1 ? 'Diabetes Detected' : 'No Diabetes Detected'}
                        </h4>
                        <p className="mb-0">
                          <strong>Probability of Diabetes:</strong> {(prediction.probability * 100).toFixed(2)}%
                        </p>
                      </Card.Body>
                    </Card>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* About Section */}
      <div className="about-section py-5 bg-light" id="about">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h2 className="mb-4">About This Project</h2>
              <p className="lead">
                This diabetes prediction application uses machine learning to help identify potential diabetes risk based on various health parameters. Early detection is crucial for managing diabetes effectively.
              </p>
              <p>
                The model is trained on a comprehensive dataset and provides an assessment based on factors like age, BMI, blood glucose levels, and other health indicators.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <footer className="footer py-4 bg-dark text-white">
        <Container>
          <Row>
            <Col md={6} className="text-center text-md-start">
              <h5>Diabetes Prediction App</h5>
              <p className="small">A machine learning tool for diabetes risk assessment</p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <p className="mb-0 small">© 2023 Diabetes Prediction. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}

export default App;
