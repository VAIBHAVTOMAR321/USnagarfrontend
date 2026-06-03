import React from 'react';

const AdminHeader = ({ sidebarOpen, setSidebarOpen, handleLogout }) => {
  return (
    <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 shadow-sm py-2 sticky-top">
      <div className="container-fluid">
        <button 
          className="btn btn-sm btn-outline-secondary me-3" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Sidebar"
        >
          <i className={`bi ${sidebarOpen ? 'bi-chevron-left' : 'bi-list'}`}></i>
        </button>
        <h5 className="m-0 text-dark fw-bold">Admin Management Panel</h5>
        <div className="ms-auto d-flex align-items-center">
          <div className="text-end me-3 d-none d-sm-block">
            <p className="m-0 small fw-bold">Administrator</p>
            <span className="badge bg-success-subtle text-success border border-success-subtle px-2" style={{ fontSize: '0.7rem' }}>FULL ACCESS</span>
          </div>
          <button className="btn btn-danger btn-sm rounded-pill px-3 shadow-sm" onClick={handleLogout}>
            <i className="bi bi-power me-1"></i> Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;