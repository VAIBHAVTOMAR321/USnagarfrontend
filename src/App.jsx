import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


import Home from './components/pages/Home';
import { AuthProvider } from './components/all_login/AuthContext';
import NavBar from './components/nav_bar/NavBar';
import Login from "./components/all_login/Login";
import About from './components/pages/About';
import PhotoGallery from './components/pages/PhotoGallery'; // Import the new component
import ProtectedRoute from "./components/all_login/ProtectedRoute";
import AdminDashboard from "./components/admin_pannel/AdminDashboard";
import GalleryManagement from "./components/admin_pannel/GalleryManagement";
import AdminLeftNav from "./components/admin_pannel/AdminLeftNav"; // Import AdminLeftNav
import AboutUsManagement from "./components/admin_pannel/AboutUsManagement";
import Footer from "./components/footer/Footer";
import ContactUs from "./components/pages/ContactUs";
import AddDemartment from "./components/admin_pannel/AddDemartment";
import ContactQuery from "./components/admin_pannel/ContactQuery";
function AppContent() {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/AdminDashboard",
    "/GalleryManagement",
    "/AboutUsManagement",
    "/AddDemartment",
    "/ContactQuery"
  ];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  const hideFooterRoutes = [
    "/AdminDashboard",
    "/GalleryManagement",
    "/AboutUsManagement",
    "/AddDemartment",
    "/ContactQuery"
  ];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <NavBar />}
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          
          {/* Protected Routes */}
          <Route path="/AdminDashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/AddDemartment" element={<ProtectedRoute allowedRoles={['admin']}><AddDemartment /></ProtectedRoute>} />
          <Route path="/ContactQuery" element={<ProtectedRoute allowedRoles={['admin']}><ContactQuery /></ProtectedRoute>} />
          <Route path="/GalleryManagement" element={<ProtectedRoute allowedRoles={['admin']}><GalleryManagement /></ProtectedRoute>} />
          <Route path="/AboutUsManagement" element={<ProtectedRoute allowedRoles={['admin']}><AboutUsManagement /></ProtectedRoute>} />
          <Route path="/Login" element={<Login />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/gallery" element={<PhotoGallery />} /> {/* Add a new route for the gallery */}
          
        </Routes>
           {!shouldHideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router basename="/pauripargati">
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
