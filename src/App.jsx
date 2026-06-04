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
import SupervisorDashBoard from "./components/supervisor_panel/SupervisorDashBoard";
import NavBar from './components/nav_bar/NavBar';
import Login from "./components/all_login/Login";
import DPODashboard from "./components/DPO_panel/DPODashboard";
import AnganwadiDashboard from "./components/anganwadi_panel/AnganwadiDashboard";
import CDPODashboard from "./components/CDPO_panel/CDPODashboard";
import DirectorDashboard from "./components/director_panel/DirectorDashboard";
import About from './components/pages/About';
import PhotoGallery from './components/pages/PhotoGallery'; // Import the new component
import ProtectedRoute from "./components/all_login/ProtectedRoute";
import AdminDashboard from "./components/admin_pannel/AdminDashboard";
import ITCellDashboard from "./components/it_cell_pannel/ITCellDashboard";
import DepartmentDashboard from "./components/department_pannel/DepartmentDashboard";
import AdminLeftNav from "./components/admin_pannel/AdminLeftNav"; // Import AdminLeftNav
import DepartmentDetailsManagement from "./components/it_cell_pannel/DepartmentDetailsManagement";
import AddWork from "./components/department_pannel/AddWork";
import AddWorkDetails from "./components/department_pannel/AddWorkDetails";
function AppContent() {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/SupervisorDashBoard", 
    "/DPODashBoard", 
    "/AnganwadiDashBoard", 
    "/CDPODashBoard", 
    "/DirectorDashboard",
    "/AdminDashboard",
    "/ITCellDashboard",
    "/DepartmentDashboard",
    "/ITCell/DepartmentDetails",
    "/AddWork",
    "/AddWorkDetails",
  ];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <NavBar />}
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          
          {/* Protected Routes */}
          <Route path="/SupervisorDashBoard" element={<ProtectedRoute allowedRoles={['supervisor']}><SupervisorDashBoard /></ProtectedRoute>} />
          <Route path="/DPODashBoard" element={<ProtectedRoute allowedRoles={['dpo']}><DPODashboard /></ProtectedRoute>} />
          <Route path="/AnganwadiDashBoard" element={<ProtectedRoute allowedRoles={['anganwadi']}><AnganwadiDashboard /></ProtectedRoute>} />
          <Route path="/CDPODashBoard" element={<ProtectedRoute allowedRoles={['cdpo']}><CDPODashboard /></ProtectedRoute>} />
          <Route path="/DirectorDashboard" element={<ProtectedRoute allowedRoles={['director']}><DirectorDashboard /></ProtectedRoute>} />
          <Route path="/AddWork" element={<ProtectedRoute allowedRoles={['department', 'it_cell', 'admin']}><AddWork /></ProtectedRoute>} />
          <Route path="/AddWorkDetails" element={<ProtectedRoute allowedRoles={['department']}><AddWorkDetails /></ProtectedRoute>} />
          <Route path="/AdminDashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/ITCellDashboard" element={<ProtectedRoute allowedRoles={['it_cell']}><ITCellDashboard /></ProtectedRoute>} />
          <Route path="/DepartmentDashboard" element={<ProtectedRoute allowedRoles={['department']}><DepartmentDashboard /></ProtectedRoute>} />
          <Route path="/ITCell/DepartmentDetails" element={<ProtectedRoute allowedRoles={['it_cell']}><DepartmentDetailsManagement /></ProtectedRoute>} />  
          <Route path="/Login" element={<Login />} />
          <Route path="/gallery" element={<PhotoGallery />} /> {/* Add a new route for the gallery */}
          
        </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
