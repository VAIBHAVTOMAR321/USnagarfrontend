import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { useAuth } from '../all_login/AuthContext';
import { API_BASE_URL } from '../../apiConfig';
import ITCellHeader from './ITCellHeader';
import ITCellLeftNav from './ITCellLeftNav';

const ITCellDashboard = () => {
  const { logout, accessToken } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Department Management State
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [formData, setFormData] = useState({ name_en: '', name_hi: '', password: '' });

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

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleEdit = (dept) => {
    setSelectedDept(dept);
    setFormData({ name_en: dept.name_en, name_hi: dept.name_hi, password: '' });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Prepare the update payload. partial=True on the backend allows 
      // us to send only the fields that need updating.
      const updateData = {
        name_en: formData.name_en,
        name_hi: formData.name_hi
      };

      // Only include password if the user provided a new one
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      await axios.put(`${API_BASE_URL}/departments/${selectedDept.id}/`, updateData, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json' 
        }
      });
      setShowModal(false);
      fetchDepartments();
      alert("Department updated successfully!");
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.detail || err.response?.data?.message || "Error occurred"));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This will delete the department and its associated user account.")) {
      try {
        await axios.delete(`${API_BASE_URL}/departments/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        fetchDepartments();
        alert("Department deleted successfully!");
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("Confirm logout from IT Cell session?")) {
      logout();
      navigate('/Login');
    }
  };

  return (
    <div className="it-dashboard-container d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <ITCellLeftNav sidebarOpen={sidebarOpen} />

      {/* Main Content */}
      <main className="flex-grow-1 d-flex flex-column bg-light" style={{ overflowY: 'auto' }}>
        <ITCellHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          handleLogout={handleLogout} 
        />

        <div className="content-body p-4">
          <div className="row g-4 mb-4">
            {/* Department Count Card */}
            <div className="col-md-6 col-lg-3">
              <div 
                className="card border-0 shadow-sm h-100 bg-primary text-white" 
                style={{ cursor: 'pointer' }}
                onClick={() => setShowTable(!showTable)}
              >
                <div className="card-body d-flex align-items-center">
                  <div className="bg-white bg-opacity-25 rounded p-3 me-3 text-white">
                    <i className="bi bi-building fs-3"></i>
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0">
                      {loading ? <Spinner animation="border" size="sm" /> : departments.length}
                    </h4>
                    <p className="small mb-0">Total Departments</p>
                  </div>
                </div>
              </div>
            </div>

            {[
              { label: 'CPU Usage', value: '24%', icon: 'bi-cpu', color: 'primary' },
              { label: 'Storage', value: '1.2 TB', icon: 'bi-hdd-stack', color: 'success' },
              { label: 'Network Latency', value: '12ms', icon: 'bi-reception-4', color: 'info' }
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
              <h5 className="mb-4 fw-bold text-dark">Department Management</h5>
              <Table responsive hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>English Name (Username)</th>
                    <th>Hindi Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.id}>
                      <td>{dept.id}</td>
                      <td>{dept.name_en}</td>
                      <td>{dept.name_hi}</td>
                      <td>
                        <Button variant="warning" size="sm" className="me-2 rounded-pill px-3" onClick={() => handleEdit(dept)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" className="rounded-pill px-3" onClick={() => handleDelete(dept.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {!showTable && (
            <div className="card border-0 shadow-sm p-4">
              <h6>System Activity Monitor</h6>
              <p className="text-muted small">Real-time infrastructure health monitoring is active. Click on "Total Departments" to view the list.</p>
            </div>
          )}
        </div>
      </main>

      {/* Edit Department Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Update Department</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body className="pt-4">
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">English Name</Form.Label>
              <Form.Control 
                type="text" 
                value={formData.name_en} 
                onChange={(e) => setFormData({...formData, name_en: e.target.value})} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Hindi Name</Form.Label>
              <Form.Control 
                type="text" 
                value={formData.name_hi} 
                onChange={(e) => setFormData({...formData, name_hi: e.target.value})} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">New Password (Optional)</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Leave blank to keep current"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="secondary" className="rounded-pill px-4" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" className="rounded-pill px-4" type="submit">Save Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ITCellDashboard;