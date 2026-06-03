import React from 'react';
import { Link } from 'react-router-dom';

const ITCellLeftNav = ({ sidebarOpen }) => {
  return (
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
          <i className="bi bi-speedometer2 me-2"></i> Admin Dashboard
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
  );
};

export default ITCellLeftNav;