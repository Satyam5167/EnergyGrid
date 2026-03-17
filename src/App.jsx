import { useState, useCallback, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './index.css';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Landing from './pages/Landing';
import Login from './pages/Login';
import { ToastProvider } from './contexts/ToastContext';

// 1. Auth Context
const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  // Simple auth state mock - forcing authenticated for now to bypass missing login
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 2. Protected Route Wrapper (Still kept for future use)
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

// 3. Layout Wrapper for Navbar
function AppLayout({ children }) {
  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      <Navbar />
      {children}
    </div>
  );
}

// 4. Main App Component
export default function App() {
  // const [toast, setToast] = useState({ show: false, icon: '✓', msg: '' });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // const showToast = useCallback((icon, msg) => {
  //   setToast({ show: true, icon, msg });
  //   setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
  // }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Main Entry Points */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } />

            <Route path="/marketplace" element={
              <AppLayout>
                <Marketplace />
              </AppLayout>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
