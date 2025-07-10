import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import SignDocument from './pages/SignDocument';

function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setAuth(JSON.parse(user));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/dashboard" element={<Dashboard auth={auth} setAuth={setAuth} />} />
       <Route path="/upload" element={<Upload />} />
       <Route path="/sign/:id" element={<SignDocument />} />



        <Route path="*" element={<Navigate to={auth ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
