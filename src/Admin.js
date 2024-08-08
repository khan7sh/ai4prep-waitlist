import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

function Admin() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

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
  }, [db]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/login');
    }).catch((error) => {
      console.error("Logout error:", error);
    });
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Timestamp\n"
      + users.map(user => `${user.email},${user.timestamp?.toDate().toISOString() || ''}`).join("\n");
    
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
      <button onClick={exportToCSV} className="submit-button">Export to CSV</button>
      <ul className="user-list animate-slide-up">
        {users.map(user => (
          <li key={user.id}>{user.email} - {user.timestamp?.toDate().toLocaleString() || 'No timestamp'}</li>
        ))}
      </ul>
      <button onClick={handleLogout} className="submit-button">Logout</button>
    </div>
  );
}

export default Admin;