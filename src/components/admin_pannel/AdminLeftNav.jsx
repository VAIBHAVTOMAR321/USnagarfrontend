import React from 'react';
import { Link } from 'react-router-dom';

const AdminLeftNav = ({ sidebarOpen }) => {
  return (
    <aside 
      className={`bg-dark text-white p-3 flex-shrink-0 ${sidebarOpen ? 'd-block' : 'd-none'}`} 
      style={{ width: '260px', transition: 'all 0.3s ease' }}
    >
      <div className="d-flex align-items-center mb-4 pb-2 border-bottom border-secondary">
        <i className="bi bi-person-gear fs-3 me-2 text-warning"></i>
        <h4 className="m-0 fw-bold">Admin Panel</h4>
      </div>
      
      <nav className="nav flex-column gap-2">
        <Link to="/AdminDashboard" className="nav-link text-white rounded bg-warning bg-opacity-25 shadow-sm">
          <i className="bi bi-speedometer2 me-2"></i> Dashboard Overview
        </Link>
        <Link to="#" className="nav-link text-white rounded opacity-75">
          <i className="bi bi-people-fill me-2"></i> Manage Users
        </Link>
        <Link to="#" className="nav-link text-white rounded opacity-75">
          <i className="bi bi-building me-2"></i> Manage Departments
        </Link>
        <Link to="#" className="nav-link text-white rounded opacity-75">
          <i className="bi bi-file-earmark-text me-2"></i> System Logs
        </Link>
        <div className="mt-auto pt-4 border-top border-secondary">
          <Link to="#" className="nav-link text-white rounded opacity-75">
            <i className="bi bi-gear me-2"></i> Settings
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default AdminLeftNav;