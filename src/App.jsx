import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import Calendar from './admin/Calendar';
import Profile from './admin/Profile';
import Users from './admin/Users';
import Settings from './admin/Settings';
import Login from './admin/Login';
import GalleryManager from './admin/GalleryManager';
import Teachers from './admin/Teachers';
import Fees from './admin/Fees';
import Results from './admin/Results';
import EventManager from './admin/EventManager';
import EnquiryManager from './admin/EnquiryManager';
import TCManager from './admin/TCManager';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="profile" element={<Profile />} />
              <Route path="users" element={<Users />} />
              <Route path="teachers" element={<Teachers />} />
              <Route path="gallery" element={<GalleryManager />} />
              <Route path="fees" element={<Fees />} />
              <Route path="results" element={<Results />} />
              <Route path="events" element={<EventManager />} />
              <Route path="enquiries" element={<EnquiryManager />} />
              <Route path="tc" element={<TCManager />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
