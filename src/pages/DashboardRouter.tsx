import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { DashboardHome } from "@/pages/DashboardHome";
import { DataEntry } from "@/pages/DataEntry";
import { Reports } from "@/pages/Reports";
import { Profile } from "@/pages/Profile";

export const DashboardRouter = () => {
  const [user, setUser] = useState<{ name: string; role: 'grower' | 'technician' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('poultrywatch_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      const defaultUser = { name: "Maria Rodriguez", role: 'grower' as const };
      setUser(defaultUser);
      localStorage.setItem('poultrywatch_user', JSON.stringify(defaultUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('poultrywatch_user');
    window.location.href = '/';
  };

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <MobileLayout user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="data-entry" element={<DataEntry userRole={user.role} />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<Profile user={user} onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </MobileLayout>
  );
};