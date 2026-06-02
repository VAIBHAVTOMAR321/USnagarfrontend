import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../all_login/AuthContext';

const DepartmentDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    if (window.confirm("Logout from Departmental Portal?")) {
      logout();
      navigate('/Login');
    }
  };

  return (
    <div className="dept-dashboard-container d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside 
        className={`bg-dark text-white p-3 flex-shrink-0 ${sidebarOpen ? 'd-block' : 'd-none'}`} 
        style={{ width: '260px', transition: 'all 0.3s ease' }}
      >
        <div className="d-flex align-items-center mb-4 pb-2 border-bottom border-secondary">
          <i className="bi bi-building-fill fs-3 me-2 text-warning"></i>
          <h4 className="m-0 fw-bold">Department</h4>
        </div>
        
        <nav className="nav flex-column gap-2">
          <Link to="/DepartmentDashboard" className="nav-link text-white rounded bg-warning bg-opacity-25 shadow-sm">
            <i className="bi bi-clipboard-data me-2"></i> Operations
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

      {/* Main Content */}
      <main className="flex-grow-1 d-flex flex-column bg-light" style={{ overflowY: 'auto' }}>
        <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 shadow-sm py-2 sticky-top">
          <div className="container-fluid">
            <button className="btn btn-sm btn-outline-secondary me-3" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <i className={`bi ${sidebarOpen ? 'bi-chevron-left' : 'bi-list'}`}></i>
            </button>
            <h5 className="m-0 text-dark fw-bold">Departmental Services Portal</h5>
            <div className="ms-auto d-flex align-items-center">
              <div className="text-end me-3 d-none d-sm-block">
                <p className="m-0 small fw-bold">HOD / Officer</p>
                <span className="badge bg-warning-subtle text-dark border border-warning-subtle px-2" style={{ fontSize: '0.7rem' }}>OPERATIONAL</span>
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
              { label: 'Pending Apps', value: '18', icon: 'bi-hourglass-split', color: 'warning' },
              { label: 'Approved', value: '142', icon: 'bi-check-circle', color: 'success' },
              { label: 'Resources', value: '09', icon: 'bi-box-seam', color: 'primary' },
              { label: 'Staff Online', value: '12', icon: 'bi-person-badge', color: 'info' }
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
            <h6>Recent Departmental Requests</h6>
            <p className="text-muted small">No new requests in the last 24 hours.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DepartmentDashboard;