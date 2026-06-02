import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../all_login/AuthContext';
const ITCellDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    if (window.confirm("Confirm logout from IT Cell session?")) {
      logout();
      navigate('/Login');
    }
  };

  return (
    <div className="it-dashboard-container d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside 
        className={`bg-dark text-white p-3 flex-shrink-0 ${sidebarOpen ? 'd-block' : 'd-none'}`} 
        style={{ width: '260px', transition: 'all 0.3s ease' }}
      >
        <div className="d-flex align-items-center mb-4 pb-2 border-bottom border-secondary">
          <i className="bi bi-cpu-fill fs-3 me-2 text-info"></i>
          <h4 className="m-0 fw-bold">IT Cell</h4>
        </div>
        
        <nav className="nav flex-column gap-2">
          <Link to="/ITCellDashboard" className="nav-link text-white rounded bg-info bg-opacity-25 shadow-sm">
            <i className="bi bi-speedometer2 me-2"></i> System Health
          </Link>
          <Link to="#" className="nav-link text-white rounded opacity-75">
            <i className="bi bi-shield-check me-2"></i> Security Audit
          </Link>
          <Link to="#" className="nav-link text-white rounded opacity-75">
            <i className="bi bi-database-fill-gear me-2"></i> Data Backups
          </Link>
          <Link to="#" className="nav-link text-white rounded opacity-75">
            <i className="bi bi-terminal-fill me-2"></i> Console Logs
          </Link>
          <div className="mt-auto pt-4 border-top border-secondary">
            <Link to="#" className="nav-link text-white rounded opacity-75">
              <i className="bi bi-pc-display me-2"></i> Hardware Inventory
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 d-flex flex-column bg-light" style={{ overflowY: 'auto' }}>
        <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 shadow-sm py-2 sticky-top">
          <div className="container-fluid">
            <button className="btn btn-sm btn-outline-secondary me-3" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <i className={`bi ${sidebarOpen ? 'bi-chevron-left' : 'bi-list'}`}></i>
            </button>
            <h5 className="m-0 text-dark fw-bold">IT Technical Management Portal</h5>
            <div className="ms-auto d-flex align-items-center">
              <div className="text-end me-3 d-none d-sm-block">
                <p className="m-0 small fw-bold">Technical Lead</p>
                <span className="badge bg-info-subtle text-info border border-info-subtle px-2" style={{ fontSize: '0.7rem' }}>ROOT ACCESS</span>
              </div>
              <button className="btn btn-danger btn-sm rounded-pill px-3 shadow-sm" onClick={handleLogout}>
                <i className="bi bi-power me-1"></i> Logout
              </button>
            </div>
          </div>
        </header>

        <div className="content-body p-4">
          <div className="row g-4 mb-4">
            {[
              { label: 'CPU Usage', value: '24%', icon: 'bi-cpu', color: 'primary' },
              { label: 'Storage', value: '1.2 TB', icon: 'bi-hdd-stack', color: 'success' },
              { label: 'Network Latency', value: '12ms', icon: 'bi-reception-4', color: 'info' },
              { label: 'Failed Logins', value: '0', icon: 'bi-shield-exclamation', color: 'danger' }
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
          <div className="card border-0 shadow-sm p-4">
            <h6>System Activity Monitor</h6>
            <p className="text-muted small">Real-time infrastructure health monitoring is active.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ITCellDashboard;