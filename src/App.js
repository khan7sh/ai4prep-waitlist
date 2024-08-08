import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './App.css';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

console.log('App.js is running');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzq0AsPw4NiyfsLcd8Hx5azzJspMCZccw",
  authDomain: "ai4prep.firebaseapp.com",
  projectId: "ai4prep",
  storageBucket: "ai4prep.appspot.com",
  messagingSenderId: "292263987065",
  appId: "1:292263987065:web:20be9e93244e31855b91a8",
  measurementId: "G-D6HYE298T8"
};


// Initialize Firebase
let app, auth, db;
try {
  console.log('Initializing Firebase');
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);

    try {
      const response = await fetch('/.netlify/functions/submit-email', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit email');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
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
  );
}

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
    } catch (error) {
      setError('Failed to log in');
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function Admin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const querySnapshot = await getDocs(collection(db, "waitlist"));
      const userList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
    }
    fetchUsers();
  }, []);

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <h2>Signed Up Users:</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  console.log('App component is rendering');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('App useEffect is running');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User is logged in' : 'User is logged out');
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            {isAuthenticated && (
              <>
                <li><Link to="/admin">Admin</Link></li>
                <li><button onClick={() => signOut(auth)}>Logout</button></li>
              </>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;