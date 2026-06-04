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
          to="/AddWork" 
          className={`nav-link text-white rounded ${location.pathname === '/AddWork' ? 'bg-primary bg-opacity-25 shadow-sm active fw-bold' : 'opacity-75'}`}
        >
          <i className="bi bi-list-task me-2"></i> All Works
        </Link>
        <Link to="#" className="nav-link text-white rounded opacity-75">
          <i className="bi bi-people-fill me-2"></i> Manage Users
        </Link>
        <Link to="#" className="nav-link text-white rounded opacity-75">
          <i className="bi bi-gear-fill me-2"></i> System Settings
        </Link>
        <div className="mt-auto pt-4 border-top border-secondary">
          <Link to="#" className="nav-link text-white rounded opacity-75">
            <i className="bi bi-info-circle me-2"></i> Audit Logs
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default AdminLeftNav;