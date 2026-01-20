import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/authProvider';
import PrivateRoute from './routes/PrivateRoute';
import {Login} from './pages/Login'
import { DashboardAdmin } from "./pages/admin/DashboardAdmin";
import {UsuariosAdmin} from './pages/admin/UsuariosAdmin'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/login'/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard-admin" element={
              <PrivateRoute>
                <DashboardAdmin />
              </PrivateRoute>
            }
          />
          <Route path='usuarios-admin' element={
              <PrivateRoute>
                <UsuariosAdmin />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;