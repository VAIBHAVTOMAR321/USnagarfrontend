import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ITCellLeftNav = ({ sidebarOpen }) => {
  const location = useLocation();

  return (
    <aside 
      className={`bg-dark text-white p-3 flex-shrink-0 ${sidebarOpen ? 'd-block' : 'd-none'}`} 
      style={{ width: '260px', transition: 'all 0.3s ease' }}
    >
      <div className="d-flex align-items-center mb-4 pb-2 border-bottom border-secondary">
        <i className="bi bi-cpu-fill fs-3 me-2 text-info"></i>
        <h4 className="m-0 fw-bold">IT Cell Panel</h4>
      </div>
      
      <nav className="nav flex-column gap-2">
        <Link 
          to="/ITCellDashboard" 
          className={`nav-link text-white rounded ${location.pathname === '/ITCellDashboard' ? 'bg-info bg-opacity-25 shadow-sm active fw-bold' : 'opacity-75'}`}
        >
          <i className="bi bi-speedometer2 me-2"></i> IT Cell Dashboard
        </Link>
        <Link 
          to="/ITCell/DepartmentDetails" 
          className={`nav-link text-white rounded ${location.pathname === '/ITCell/DepartmentDetails' ? 'bg-info bg-opacity-25 shadow-sm active fw-bold' : 'opacity-75'}`}
        >
          <i className="bi bi-building-fill me-2"></i> Department Details
        </Link>
        <Link 
          to="/AddWork" 
          className={`nav-link text-white rounded ${location.pathname === '/AddWork' ? 'bg-info bg-opacity-25 shadow-sm active fw-bold' : 'opacity-75'}`}
        >
          <i className="bi bi-plus-square me-2"></i> Add/Manage Works
        </Link>
        <Link to="#" className="nav-link text-white rounded opacity-75">
          <i className="bi bi-envelope-paper me-2"></i> Manage Requests
        </Link>
        <Link to="#" className="nav-link text-white rounded opacity-75">
          <i className="bi bi-gear-fill me-2"></i> Settings
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

export default ITCellLeftNav;