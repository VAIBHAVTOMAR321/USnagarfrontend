import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../all_login/AuthContext';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate('/Login');
    }
  };

  return (
    <div className="admin-dashboard-container d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar - Left Navigation */}
      <aside 
        className={`bg-dark text-white p-3 flex-shrink-0 ${sidebarOpen ? 'd-block' : 'd-none'}`} 
        style={{ width: '260px', transition: 'all 0.3s ease' }}
      >
        <div className="d-flex align-items-center mb-4 pb-2 border-bottom border-secondary">
          <i className="bi bi-shield-lock-fill fs-3 me-2 text-warning"></i>
          <h4 className="m-0 fw-bold">Admin Panel</h4>
        </div>
        
        <nav className="nav flex-column gap-2">
          <Link to="/AdminDashboard" className="nav-link text-white rounded bg-primary shadow-sm">
            <i className="bi bi-grid-1x2-fill me-2"></i> Dashboard Home
          </Link>
          <Link to="#" className="nav-link text-white rounded opacity-75">
            <i className="bi bi-people-fill me-2"></i> User Management
          </Link>
          <Link to="#" className="nav-link text-white rounded opacity-75">
            <i className="bi bi-building-gear me-2"></i> Department Setup
          </Link>
          <Link to="#" className="nav-link text-white rounded opacity-75">
            <i className="bi bi-file-earmark-bar-graph me-2"></i> Activity Logs
          </Link>
          <div className="mt-auto pt-4 border-top border-secondary">
            <Link to="#" className="nav-link text-white rounded opacity-75">
              <i className="bi bi-gear-fill me-2"></i> System Settings
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow-1 d-flex flex-column bg-light" style={{ overflowY: 'auto' }}>
        
        {/* Top Header */}
        <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 shadow-sm py-2 sticky-top">
          <div className="container-fluid">
            <button className="btn btn-sm btn-outline-secondary me-3" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <i className={`bi ${sidebarOpen ? 'bi-chevron-left' : 'bi-list'}`}></i>
            </button>
            
            <h5 className="m-0 text-dark fw-bold">District Administration Portal</h5>

            <div className="ms-auto d-flex align-items-center">
              <div className="text-end me-3 d-none d-sm-block">
                <p className="m-0 small fw-bold">Administrator</p>
                <span className="badge bg-success-subtle text-success border border-success-subtle px-2" style={{ fontSize: '0.7rem' }}>ACTIVE SESSION</span>
              </div>
              <button className="btn btn-danger btn-sm rounded-pill px-3 shadow-sm" onClick={handleLogout}>
                <i className="bi bi-power me-1"></i> Logout
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Body Content */}
        <div className="content-body p-4">
          <div className="row g-4 mb-4">
            {/* Quick Summary Cards */}
            {[
              { label: 'Active Users', value: '142', icon: 'bi-people', color: 'primary' },
              { label: 'Open Tasks', value: '28', icon: 'bi-clipboard-check', color: 'info' },
              { label: 'Alerts', value: '03', icon: 'bi-exclamation-triangle', color: 'warning' },
              { label: 'Server Load', value: '12%', icon: 'bi-cpu', color: 'success' }
            ].map((stat, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex align-items-center">
                    <div className={`bg-${stat.color}-subtle rounded p-3 me-3 text-${stat.color}`}>
                      <i className={`bi ${stat.icon} fs-3`}></i>
                    </div>
                    <div>
                      <h4 className="fw-bold mb-0">{stat.value}</h4>
                      <p className="text-muted small mb-0">{stat.label}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;