import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RubricsPage from './pages/RubricsPage';
import NewRubricPage from './pages/NewRubricPage';
import AllEssaysPage from './pages/AllEssaysPage';
import UploadEssayPage from './pages/UploadEssayPage';
import EssayResultPage from './pages/EssayResultPage';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/rubrics" element={<PrivateRoute><RubricsPage /></PrivateRoute>} />
      <Route path="/rubrics/new" element={<PrivateRoute><NewRubricPage /></PrivateRoute>} />
      <Route path="/rubrics/edit/:id" element={<PrivateRoute><NewRubricPage /></PrivateRoute>} />
      <Route path="/essays" element={<PrivateRoute><AllEssaysPage /></PrivateRoute>} />
      <Route path="/essays/upload" element={<PrivateRoute><UploadEssayPage /></PrivateRoute>} />
      <Route path="/essays/:id" element={<PrivateRoute><EssayResultPage /></PrivateRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
