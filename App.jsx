import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../src/components/LoginPage';
import DashboardPage from '../src/components/DashboardPage';
import Navbar from '../src/components/Navbar';
function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route 
          path="/dashboard/*" 
          element={user ? <DashboardPage user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route path="/" element={<Navigate to={user ? "/dashboard/live" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard/live" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
