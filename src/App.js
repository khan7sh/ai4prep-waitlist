import React, { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);

    try {
      console.log('Submitting email:', email);
      const response = await fetch('/.netlify/functions/submit-email', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (response.ok) {
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (err) {
          console.error('Error parsing JSON:', err);
          throw new Error('Invalid response from server');
        }
        console.log('Response data:', responseData);
        setSubmitted(true);
        setEmail('');
      } else {
        throw new Error(`Failed to submit email: ${responseText}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="App">
      <div className="form-container">
        <img src="/logo.png" alt="AI4PREP Logo" className="logo" />
        <h1>Join the AI4PREP Waitlist</h1>
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
        {submitted && <p className="success-message">Thank you for joining our waitlist!</p>}
        {error && <p className="error-message">{error}</p>}
        <div className="social-media">
          <a 
            href="https://www.instagram.com/ai4prep?igsh=eDkycDUzYWR6ZHJq" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Follow us on Instagram
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;