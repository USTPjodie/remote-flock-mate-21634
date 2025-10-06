import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Auth } from "@/components/Auth";

const Index = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('poultrywatch_user');
    setIsLoggedIn(!!savedUser);
    setIsChecking(false);
  }, []);

  const handleLogin = (userData: { name: string; role: 'grower' | 'technician' }) => {
    localStorage.setItem('poultrywatch_user', JSON.stringify(userData));
    navigate('/dashboard');
  };

  if (isChecking) {
    return null;
  }

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Auth onLogin={handleLogin} />
    </div>
  );
};

export default Index;