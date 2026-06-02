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


function AppContent() {
  const location = useLocation();

  const hideNavbarRoutes = ["/SupervisorDashBoard", "/DPODashboard", "/AnganwadiDashboard", "/CDPODashboard", "/DirectorDashboard"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <NavBar />}
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SupervisorDashBoard" element={<SupervisorDashBoard />} />
          <Route path="/DPODashBoard" element={<DPODashboard />} />
          <Route path="/AnganwadiDashBoard" element={<AnganwadiDashboard />} />
          <Route path="/CDPODashBoard" element={<CDPODashboard />} />
          <Route path="/DirectorDashboard" element={<DirectorDashboard />} />
          <Route path="/Login" element={<Login />} />
          
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
