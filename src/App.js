import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate  } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './App.css';



console.log('App.js is running');

const firebaseConfig = {
  apiKey: "AIzaSyBzq0AsPw4NiyfsLcd8Hx5azzJspMCZccw",
  authDomain: "ai4prep.firebaseapp.com",
  projectId: "ai4prep",
  storageBucket: "ai4prep.appspot.com",
  messagingSenderId: "292263987065",
  appId: "1:292263987065:web:20be9e93244e31855b91a8",
  measurementId: "G-D6HYE298T8"
};

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
      <img src="/logo.png" alt="AI4PREP Logo" className="logo animate-pulse" />
      <h1 className="animate-fade-in">Join the AI4PREP Waitlist</h1>
      <form onSubmit={handleSubmit} className="animate-slide-up">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="animate-input"
        />
        <button type="submit" className="submit-button">Join Waitlist</button>
      </form>
      {submitted && <p className="success-message animate-fade-in">Thank you for joining our waitlist!</p>}
      {error && <p className="error-message animate-fade-in">{error}</p>}
      <div className="social-media animate-fade-in">
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

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (error) {
      console.error("Login error:", error);
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="animate-fade-in">Admin Login</h2>
      <form onSubmit={handleLogin} className="animate-slide-up">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="animate-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="animate-input"
        />
        <button type="submit" className="submit-button">Login</button>
      </form>
      {error && <p className="error-message animate-fade-in">{error}</p>}
    </div>
  );
}

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? children : null;
}

function Admin() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const querySnapshot = await getDocs(collection(db, "waitlist"));
        const userList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
      }
    }
    fetchUsers();
  }, [db]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/login');
    }).catch((error) => {
      console.error("Logout error:", error);
    });
  };

  const exportToCSV = () => {
    if (users.length === 0) {
      alert("No users to export.");
      return;
    }
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Timestamp\n"
      + users.map(user => `${user.email},${user.timestamp?.toDate?.().toISOString() || ''}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "waitlist_users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-container animate-fade-in">
      <h1>Admin Dashboard</h1>
      <h2>Signed Up Users: {users.length}</h2>
      {error && <p className="error-message">Error: {error}</p>}
      <button onClick={exportToCSV} className="submit-button">Export to CSV</button>
      <button onClick={handleLogout} className="submit-button">Logout</button>
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
    return <div className="error-container animate-fade-in">An error occurred: {error.message}</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
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