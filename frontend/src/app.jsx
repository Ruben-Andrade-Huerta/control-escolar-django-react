import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/authProvider';
import PrivateRoute from './routes/PrivateRoute';
import {Login} from './pages/Login'
import {Dashboard} from './pages/DashboardAdmin';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/login'/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          {/* Otras rutas */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;