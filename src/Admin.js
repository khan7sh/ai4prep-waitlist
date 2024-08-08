import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './Admin.css';

function Admin() {
  const [users, setUsers] = useState([]);
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

export default Admin;