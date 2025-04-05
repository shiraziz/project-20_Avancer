import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Stores from './pages/Stores';
import Users from './pages/Users';
import Reports from './pages/Reports';
import GestOrders from './pages/GestOrder';
import AffectOrders from './pages/AffectOreder';

import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // const { user } = useAuth();
  // if (!user) return <Navigate to="/login" />;
  // return <>{children}</>;
};

function App() {
  return (
     <AuthProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dash" element={
            //<ProtectedRoute>
            <Dashboard />
           // </ProtectedRoute>
            } />
            <Route path="/orders" element={
            /* <ProtectedRoute>*/
            <Orders />
            /* </ProtectedRoute>*/
            } />
            <Route path="/stores" element={
            /* <ProtectedRoute>*/
            <Stores />
            /* </ProtectedRoute>*/
            } />
            <Route path="/users" element={
            /* <ProtectedRoute>*/
            <Users />
            /* </ProtectedRoute>*/
            } />
            <Route path="/reports" element={
            /* <ProtectedRoute>*/
            <Reports />
            /* </ProtectedRoute>*/
            } />
            <Route path="/gestOrder" element={
            /* <ProtectedRoute>*/
            <GestOrders />
            /* </ProtectedRoute>*/
            } />
            <Route path="/affectOrder" element={
            /* <ProtectedRoute>*/
            <AffectOrders />
            /* </ProtectedRoute>*/
            } />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;