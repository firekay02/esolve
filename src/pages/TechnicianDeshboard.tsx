import React, { useState } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { AuthForm } from '../components/AuthForm';
import { Dashboard } from '../components/Deshboard';
import { useAuth } from '../context/AuthContext';

const TechnicianDashboardContent: React.FC = () => {
  const { user } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  if (!user) {
    return (
      <AuthForm 
        mode={authMode} 
        onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')} 
      />
    );
  }

  return <Dashboard />;
};

export const TechnicianDashboard: React.FC = () => {
  return (
    <AuthProvider>
      <TechnicianDashboardContent />
    </AuthProvider>
  );
};