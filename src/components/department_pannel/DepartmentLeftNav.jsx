import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DepartmentLeftNav = ({ sidebarOpen }) => {
  const location = useLocation();

  return (
    <aside 
      className={`bg-dark text-white p-3 flex-shrink-0 ${sidebarOpen ? 'd-block' : 'd-none'}`} 
      style={{ width: '260px', transition: 'all 0.3s ease' }}
    >
      <div className="d-flex align-items-center mb-4 pb-2 border-bottom border-secondary">
        <i className="bi bi-building-fill fs-3 me-2 text-warning"></i>
        <h4 className="m-0 fw-bold">Department</h4>
      </div>
      
      <nav className="nav flex-column gap-2">
        <Link 
          to="/DepartmentDashboard" 
          className={`nav-link text-white rounded ${location.pathname === '/DepartmentDashboard' ? 'bg-warning bg-opacity-25 shadow-sm active fw-bold' : 'opacity-75'}`}
        >
          <i className="bi bi-speedometer2 me-2"></i> Department Dashboard
        </Link>
        <Link 
          to="/AddWork" 
          className={`nav-link text-white rounded ${location.pathname === '/AddWork' ? 'bg-warning bg-opacity-25 shadow-sm active fw-bold' : 'opacity-75'}`}
        >
          <i className="bi bi-plus-square me-2"></i> Add/Manage Works
        </Link>
        <Link 
          to="/AddWorkDetails" 
          className={`nav-link text-white rounded ${location.pathname === '/AddWorkDetails' ? 'bg-warning bg-opacity-25 shadow-sm active fw-bold' : 'opacity-75'}`}
        >
          <i className="bi bi-file-earmark-plus me-2"></i> Add Work Details
        </Link>
        <Link to="#" className="nav-link text-white rounded opacity-75">
          <i className="bi bi-envelope-paper me-2"></i> My Requests
        </Link>
        <Link to="#" className="nav-link text-white rounded opacity-75">
          <i className="bi bi-people-fill me-2"></i> Staff Directory
        </Link>
        <Link to="#" className="nav-link text-white rounded opacity-75">
          <i className="bi bi-file-earmark-pdf me-2"></i> Departmental Reports
        </Link>
        <div className="mt-auto pt-4 border-top border-secondary">
          <Link to="#" className="nav-link text-white rounded opacity-75">
            <i className="bi bi-info-circle me-2"></i> Help & Support
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default DepartmentLeftNav;