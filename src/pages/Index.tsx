import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Auth } from "@/components/Auth";

const Index = () => {
  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('poultrywatch_user');
    if (savedUser) {
      // Redirect to dashboard if already logged in
      window.location.href = '/dashboard';
    }
  }, []);

  const handleLogin = (userData: { name: string; role: 'grower' | 'technician' }) => {
    localStorage.setItem('poultrywatch_user', JSON.stringify(userData));
    window.location.href = '/dashboard';
  };

  // Check if user is logged in
  const savedUser = localStorage.getItem('poultrywatch_user');
  if (savedUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Auth onLogin={handleLogin} />
    </div>
  );
};

export default Index;