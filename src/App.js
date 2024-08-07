import React, { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submittedEmails, setSubmittedEmails] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulating a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      setError('');
      setSubmittedEmails([...submittedEmails, email]);
      setEmail('');
    } catch (err) {
      setError('An error occurred. Please try again.');
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
          <a href="https://www.instagram.com/ai4prep?igsh=eDkycDUzYWR6ZHJq" target="_blank" rel="noopener noreferrer">
            Follow us on Instagram
          </a>
        </div>
        {submittedEmails.length > 0 && (
          <div className="submitted-emails">
            <h2>Submitted Emails:</h2>
            <ul>
              {submittedEmails.map((email, index) => (
                <li key={index}>{email}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;