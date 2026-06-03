import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Spinner } from 'react-bootstrap';
import { useAuth } from '../all_login/AuthContext';
import AdminHeader from './AdminHeader';
import AdminLeftNav from './AdminLeftNav';
import { API_BASE_URL } from '../../apiConfig';

const AdminDashboard = () => {
  const { logout, accessToken } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Department Management State
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/departments/`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setDepartments(res.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, [accessToken]);

  const handleLogout = () => {
    if (window.confirm("Confirm logout from Admin session?")) {
      logout();
      navigate('/Login');
    }
  };

  return (
    <div className="admin-dashboard-container d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <AdminLeftNav sidebarOpen={sidebarOpen} />

      {/* Main Content */}
      <main className="flex-grow-1 d-flex flex-column bg-light" style={{ overflowY: 'auto' }}>
        <AdminHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          handleLogout={handleLogout} 
        />

        <div className="content-body p-4">
          <h2 className="mb-4 fw-bold">Welcome to Admin Dashboard</h2>
          
          <div className="row g-4 mb-4">
            {/* All Departments Card */}
            <div className="col-md-6 col-lg-3">
              <div 
                className="card border-0 shadow-sm h-100" 
                style={{ cursor: 'pointer' }}
                onClick={() => setShowTable(!showTable)}
              >
                <div className="card-body d-flex align-items-center">
                  <div className="bg-primary-subtle rounded p-3 me-3 text-primary">
                    <i className="bi bi-building-fill fs-3"></i>
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0">
                      {loading ? <Spinner animation="border" size="sm" /> : departments.length}
                    </h4>
                    <p className="text-muted small mb-0">All Departments</p>
                  </div>
                </div>
              </div>
            </div>

            {[
              { label: 'Active Sessions', value: '87', icon: 'bi-activity', color: 'success' },
              { label: 'Pending Approvals', value: '12', icon: 'bi-hourglass-split', color: 'warning' },
              { label: 'System Health', value: 'Good', icon: 'bi-shield-check', color: 'info' }
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

          {showTable && (
            <div className="card border-0 shadow-sm p-4 mt-4 animate-fade-in">
              <h5 className="mb-4 fw-bold text-dark">Department List</h5>
              <Table responsive hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>English Name</th>
                    <th>Hindi Name</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.id}>
                      <td>{dept.id}</td>
                      <td>{dept.name_en}</td>
                      <td>{dept.name_hi}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {!showTable && (
            <div className="card border-0 shadow-sm p-4">
              <h6>Admin Activity Overview</h6>
              <p className="text-muted small">This section can display recent admin actions, system alerts, or other relevant information. Click on "All Departments" to view the list.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;