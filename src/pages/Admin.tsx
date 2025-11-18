
import React, { useState } from 'react';
import { Navigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import AdminMembers from './AdminMembers';
import AdminGallery from './AdminGallery';
import AdminBlog from './AdminBlog';
import AdminBulletin from './AdminBulletin';
import AdminTestimonials from './AdminTestimonials';
import AdminLogin from './AdminLogin';
import AdminSettings from './AdminSettings';

// Simple auth management - in a real app, use a proper auth system
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });

  const logout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_username');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, logout };
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

const AdminPanel: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Don't show the admin nav on the login page
  const showNav = isAuthenticated && location.pathname !== '/admin/login';

  return (
    <div className="min-h-screen bg-background tech-gradient">
      {showNav && (
        <nav className="bg-primary text-primary-foreground p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-xl font-bold">
                E-Cell Admin
              </Link>
              
              <div className="flex space-x-4">
                <Link 
                  to="/admin/members" 
                  className={`px-3 py-2 rounded-md ${location.pathname === '/admin/members' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >
                  Team Members
                </Link>
                <Link 
                  to="/admin/gallery" 
                  className={`px-3 py-2 rounded-md ${location.pathname === '/admin/gallery' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >
                  Gallery
                </Link>
                <Link 
                  to="/admin/blog" 
                  className={`px-3 py-2 rounded-md ${location.pathname === '/admin/blog' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >
                  Blog
                </Link>
                <Link 
                  to="/admin/bulletin" 
                  className={`px-3 py-2 rounded-md ${location.pathname === '/admin/bulletin' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >
                  Announcements
                </Link>
                <Link 
                  to="/admin/testimonials" 
                  className={`px-3 py-2 rounded-md ${location.pathname === '/admin/testimonials' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >
                  Testimonials
                </Link>
                <Link 
                  to="/admin/settings" 
                  className={`px-3 py-2 rounded-md ${location.pathname === '/admin/settings' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >
                  Settings
                </Link>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </nav>
      )}

      <div className="max-w-7xl mx-auto p-4">
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/members" element={
            <ProtectedRoute>
              <AdminMembers />
            </ProtectedRoute>
          } />
          <Route path="/gallery" element={
            <ProtectedRoute>
              <AdminGallery />
            </ProtectedRoute>
          } />
          <Route path="/blog" element={
            <ProtectedRoute>
              <AdminBlog />
            </ProtectedRoute>
          } />
          <Route path="/bulletin" element={
            <ProtectedRoute>
              <AdminBulletin />
            </ProtectedRoute>
          } />
          <Route path="/testimonials" element={
            <ProtectedRoute>
              <AdminTestimonials />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/admin/members" replace />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminPanel;
