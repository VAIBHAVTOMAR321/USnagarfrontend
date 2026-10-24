import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLeftNav = ({ sidebarOpen }) => {
  const location = useLocation();

  return (
    <aside 
      className={`bg-dark text-white p-3 flex-shrink-0 ${sidebarOpen ? 'd-block' : 'd-none'}`} 
      style={{ width: '260px', transition: 'all 0.3s ease' }}
    >
      <div className="d-flex align-items-center mb-4 pb-2 border-bottom border-secondary">
        <i className="bi bi-person-workspace fs-3 me-2 text-primary"></i>
        <h4 className="m-0 fw-bold">Admin Panel</h4>
      </div>
      
      <nav className="nav flex-column gap-2 align-items-start">
        <Link 
          to="/AdminDashboard" 
          className={`nav-link text-white rounded ${location.pathname === '/AdminDashboard' ? 'bg-primary bg-opacity-25 shadow-sm active fw-bold' : 'opacity-75'}`}
        >
          <i className="bi bi-speedometer2 me-2"></i> Admin Dashboard
        </Link>
         <Link 
          to="/GalleryManagement" 
          className={`nav-link text-white rounded ${location.pathname === '/GalleryManagement' ? 'bg-primary bg-opacity-25 shadow-sm active fw-bold' : 'opacity-75'}`}
        >
          <i className="bi bi-speedometer2 me-2"></i> Gallery
        </Link>
         <Link 
          to="/AboutUsManagement" 
          className={`nav-link text-white rounded ${location.pathname === '/AboutUsManagement' ? 'bg-primary bg-opacity-25 shadow-sm active fw-bold' : 'opacity-75'}`}
        >
          <i className="bi bi-speedometer2 me-2"></i> About Us
        </Link>
         <Link 
          to="/AddDemartment" 
          className={`nav-link text-white rounded ${location.pathname === '/AddDemartment' ? 'bg-primary bg-opacity-25 shadow-sm active fw-bold' : 'opacity-75'}`}
        >
          <i className="bi bi-speedometer2 me-2"></i> Add Demartment
        </Link>
       
        <Link 
          to="/ContactQuery" 
          className={`nav-link text-white rounded ${location.pathname === '/ContactQuery' ? 'bg-primary bg-opacity-25 shadow-sm active fw-bold' : 'opacity-75'}`}
        >
          <i className="bi bi-speedometer2 me-2"></i> Contact Query
        </Link>
       
      </nav>
    </aside>
  );
};

export default AdminLeftNav;