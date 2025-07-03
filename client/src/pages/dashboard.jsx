import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:8080/user/api/dashboard", {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      alert("Not logged in");
      navigate("/login");
    }
  };

  const logout = async () => {
    await axios.get("http://localhost:8080/user/logout", {
      withCredentials: true,
    });
    navigate("/login");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <>
          <p>Welcome, {user.username}!</p>
          <p>Email: {user.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
