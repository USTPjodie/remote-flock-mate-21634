import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { DashboardHome } from "@/pages/DashboardHome";
import { DataEntry } from "@/pages/DataEntry";
import { Reports } from "@/pages/Reports";
import { Profile } from "@/pages/Profile";

export const DashboardRouter = () => {
  const [user, setUser] = useState<{ name: string; role: 'grower' | 'technician' } | null>(null);
  const location = useLocation();

  // Simulate getting user data from localStorage or context
  useEffect(() => {
    // In a real app, this would come from your auth system
    const savedUser = localStorage.getItem('poultrywatch_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Default user for demo purposes
      const defaultUser = { name: "Maria Rodriguez", role: 'grower' as const };
      setUser(defaultUser);
      localStorage.setItem('poultrywatch_user', JSON.stringify(defaultUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('poultrywatch_user');
    window.location.href = '/';
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <MobileLayout user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/data-entry" element={<DataEntry userRole={user.role} />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
        <Route path="/*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </MobileLayout>
  );
};