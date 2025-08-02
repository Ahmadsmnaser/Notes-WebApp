import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotesProvider } from './contexts/NotesContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CreateUserPage from './pages/CreateUserPage';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <NotesProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/create-user" element={<CreateUserPage />} />
            </Routes>
          </Router>
        </NotesProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
