import React, { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // For now, we'll just simulate a successful submission
      // In a real app, you'd make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      setError('');
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="App">
      <div className="form-container">
        <img src="/logo.png" alt="AI4PREP Logo" className="logo" />
        <h1>Join the AI4PREP Waitlist</h1>
        {submitted ? (
          <p className="success-message">Thank you for joining our waitlist!</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <button type="submit">Join Waitlist</button>
          </form>
        )}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default App;