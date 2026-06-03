import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Spinner, Badge } from 'react-bootstrap';
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

  // Division Management State
  const [divisions, setDivisions] = useState([]);
  const [viewDetails, setViewDetails] = useState({ type: null, deptId: null });

  // New state for total works
  const [totalWorksCount, setTotalWorksCount] = useState(0);
  const [loadingWorks, setLoadingWorks] = useState(true);
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

    const fetchDivisions = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/divisions/`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setDivisions(res.data);
      } catch (err) {
        console.error("Error fetching divisions:", err);
      }
    };

    // New function to fetch total works
    const fetchTotalWorks = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/works/`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setTotalWorksCount(res.data.length); // Assuming res.data is an array of works
      } catch (err) {
        console.error("Error fetching total works:", err);
      } finally {
        setLoadingWorks(false);
      }
    };

    fetchDepartments();
    fetchDivisions();
    fetchTotalWorks(); // Call the new fetch function
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
                className={`card border-0 shadow-sm h-100 transition-all ${showTable ? 'bg-primary-subtle' : 'bg-white'}`} 
                style={{ cursor: 'pointer' }}
                onClick={() => setShowTable(!showTable)}
              >
                <div className="card-body d-flex align-items-center">
                  <div className={`${showTable ? 'bg-white' : 'bg-primary-subtle'} rounded p-3 me-3 text-primary shadow-sm`}>
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

            {/* New All Works Card */}
            <div className="col-md-6 col-lg-3">
              <div
                className="card border-0 shadow-sm h-100 bg-white" 
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/AddWork')} // Navigate to AddWork component
              >
                <div className="card-body d-flex align-items-center">
                  <div className="bg-info-subtle rounded p-3 me-3 text-info shadow-sm">
                    <i className="bi bi-list-task fs-3"></i> {/* Icon for tasks/works */}
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0 text-dark">
                      {loadingWorks ? <Spinner animation="border" size="sm" /> : totalWorksCount}
                    </h4>
                    <p className="text-muted small mb-0">All Works</p>
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
                    <th>Divisions</th>
                    <th>Heads</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => {
                    const deptDivisions = divisions.filter(d => d.department === dept.id);
                    const uniqueHeadsCount = new Set(deptDivisions.filter(d => d.head_name).map(d => d.head_name)).size;
                    const isExpanded = viewDetails.deptId === dept.id;

                    return (
                      <React.Fragment key={dept.id}>
                        <tr>
                          <td>{dept.id}</td>
                          <td>{dept.name_en}</td>
                          <td>{dept.name_hi}</td>
                          <td>
                            <Badge 
                              bg="primary" 
                              className="p-2 cursor-pointer shadow-sm" 
                              style={{ cursor: 'pointer' }}
                              onClick={() => setViewDetails(isExpanded && viewDetails.type === 'divisions' ? { type: null, deptId: null } : { type: 'divisions', deptId: dept.id })}
                            >
                              {deptDivisions.length} Divisions
                            </Badge>
                          </td>
                          <td>
                            <Badge 
                              bg="success" 
                              className="p-2 cursor-pointer shadow-sm" 
                              style={{ cursor: 'pointer' }}
                              onClick={() => setViewDetails(isExpanded && viewDetails.type === 'heads' ? { type: null, deptId: null } : { type: 'heads', deptId: dept.id })}
                            >
                              {uniqueHeadsCount} Heads
                            </Badge>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={5} className="bg-light p-0">
                              <div className="p-3 border-start border-end border-bottom animate-fade-in">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <h6 className="fw-bold m-0 text-secondary">
                                    {viewDetails.type === 'divisions' ? 'Division List' : 'Head Assignments'} — {dept.name_en}
                                  </h6>
                                  <button 
                                    className="btn btn-sm btn-outline-secondary border-0"
                                    onClick={() => setViewDetails({ type: null, deptId: null })}
                                  >
                                    <i className="bi bi-x-lg"></i>
                                  </button>
                                </div>
                                <Table size="sm" bordered hover className="bg-white mb-0 shadow-sm">
                                  <thead className="table-secondary">
                                    <tr>
                                      <th>Division (English)</th>
                                      <th>Division (Hindi)</th>
                                      <th>Head Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {deptDivisions.length > 0 ? deptDivisions.map(div => (
                                      <tr key={div.id}>
                                        <td>{div.name_en}</td>
                                        <td>{div.name_hi}</td>
                                        <td className="fw-bold">{div.head_name || <span className="text-muted">No Head Assigned</span>}</td>
                                      </tr>
                                    )) : (
                                      <tr>
                                        <td colSpan={3} className="text-center py-2 text-muted italic">No divisions found for this department.</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </Table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
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