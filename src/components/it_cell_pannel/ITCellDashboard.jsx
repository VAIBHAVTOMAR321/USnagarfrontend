import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, Modal, Form, Spinner, Card, Row, Col } from 'react-bootstrap';
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

  // Division Tracking
  const [divisions, setDivisions] = useState([]);
  const [viewDetails, setViewDetails] = useState({ type: null, deptId: null });

  // Division/Head Editing State
  const [showDivModal, setShowDivModal] = useState(false);
  const [showHeadModal, setShowHeadModal] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [divFormData, setDivFormData] = useState({ name_en: '', name_hi: '' });
  const [headFormData, setHeadFormData] = useState({ head_name: '' });

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

  useEffect(() => {
    fetchDepartments();
    fetchDivisions();
  }, []);

  const handleEdit = (dept) => {
    setSelectedDept(dept);
    setFormData({ name_en: dept.name_en, name_hi: dept.name_hi, password: '' });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name_en: formData.name_en,
        name_hi: formData.name_hi
      };

      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      if (selectedDept) {
        // Update existing department
        await axios.put(`${API_BASE_URL}/departments/${selectedDept.id}/`, payload, {
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
        });
        alert("Department updated successfully!");
      } else {
        // Create new department
        await axios.post(`${API_BASE_URL}/departments/create/`, payload, {
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
        });
        alert("Department created successfully!");
      }

      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      alert("Operation failed: " + (err.response?.data?.detail || err.response?.data?.message || "Error occurred"));
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

  const handleEditDivision = (div) => {
    setSelectedDivision(div);
    setDivFormData({ name_en: div.name_en, name_hi: div.name_hi });
    setShowDivModal(true);
  };

  const handleEditHead = (div) => {
    setSelectedDivision(div);
    setHeadFormData({ head_name: div.head_name || '' });
    setShowHeadModal(true);
  };

  const handleUpdateDivision = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/divisions/${selectedDivision.id}/`, divFormData, {
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
      });
      setShowDivModal(false);
      fetchDivisions();
      alert("Division names updated successfully!");
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.detail || err.response?.data?.message || "Error occurred"));
    }
  };

  const handleUpdateHead = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/divisions/bulk-update-head/`, {
        division_ids: [selectedDivision.id],
        head_name: headFormData.head_name
      }, {
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
      });
      setShowHeadModal(false);
      fetchDivisions();
      alert("Head assigned successfully!");
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.detail || err.response?.data?.message || "Error occurred"));
    }
  };

  const handleDeleteDivision = async (id) => {
    if (window.confirm("Are you sure you want to delete this division?")) {
      try {
        await axios.delete(`${API_BASE_URL}/divisions/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        fetchDivisions();
        alert("Division deleted successfully!");
      } catch (err) {
        alert("Delete failed: " + (err.response?.data?.detail || "Error occurred"));
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="m-0 fw-bold">IT Infrastructure Dashboard</h2>
            <Button 
              variant="success" 
              className="rounded-pill px-4 shadow-sm fw-bold"
              onClick={() => {
                setSelectedDept(null);
                setFormData({ name_en: '', name_hi: '', password: '' });
                setShowModal(true);
              }}
            >
              <i className="bi bi-plus-lg me-2"></i>
              Add New Department
            </Button>
          </div>

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
              <Row className="g-2">
                {departments.map((dept) => {
                  const deptDivisions = divisions.filter(d => d.department === dept.id);
                  // Treat identical head names as one for counting unique leaders
                  const uniqueHeadsCount = new Set(deptDivisions.filter(d => d.head_name).map(d => d.head_name)).size;

                  return (
                    <Col xs={12} sm={6} md={4} lg={2} key={dept.id}>
                      <Card className="h-100 border-0 shadow-sm hover-shadow transition-all border-start border-4 border-primary">
                        <Card.Body className="p-2">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="bg-primary bg-opacity-10 p-1 rounded text-primary shadow-sm" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="bi bi-building fs-6"></i>
                            </div>
                            <span className="badge bg-light text-muted fw-normal border">ID: {dept.id}</span>
                          </div>
                          <h6 className="fw-bold text-dark mb-1 text-truncate">{dept.name_en}</h6>
                          <p className="text-secondary small mb-3">{dept.name_hi}</p>
                          
                          <Row className="g-2 text-center mb-3">
                            <Col xs={6}>
                              <div 
                                className="p-2 bg-light rounded border border-light-subtle h-100 shadow-none" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => setViewDetails({ type: 'divisions', deptId: dept.id })}
                              >
                                <div className="h6 fw-bold text-primary mb-0">{deptDivisions.length}</div>
                                <div className="text-uppercase text-muted fw-semibold" style={{ fontSize: '0.55rem', letterSpacing: '0.5px' }}>Divisions</div>
                              </div>
                            </Col>
                            <Col xs={6}>
                              <div 
                                className="p-2 bg-light rounded border border-light-subtle h-100 shadow-none"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setViewDetails({ type: 'heads', deptId: dept.id })}
                              >
                                <div className="h6 fw-bold text-success mb-0">{uniqueHeadsCount}</div>
                                <div className="text-uppercase text-muted fw-semibold" style={{ fontSize: '0.55rem', letterSpacing: '0.5px' }}>Heads</div>
                              </div>
                            </Col>
                          </Row>

                          <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm" className="flex-grow-1 border-0 bg-primary bg-opacity-10 text-primary fw-semibold rounded-pill py-0" style={{ fontSize: '0.75rem' }} onClick={() => handleEdit(dept)}>
                              <i className="bi bi-pencil-square me-1"></i> Edit
                            </Button>
                            <Button variant="outline-danger" size="sm" className="flex-grow-1 border-0 bg-danger bg-opacity-10 text-danger fw-semibold rounded-pill py-0" style={{ fontSize: '0.75rem' }} onClick={() => handleDelete(dept.id)}>
                              <i className="bi bi-trash me-1"></i> Delete
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>

              {/* Detailed View Section */}
              {viewDetails.deptId && (
                <div className="mt-4 p-3 border-0 rounded-3 bg-white shadow animate-fade-in border-top border-primary border-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h6 className="m-0 fw-bold text-dark">
                        {viewDetails.type === 'divisions' ? 'Departmental Divisions' : 'Division Head Mapping'} 
                      </h6>
                      <p className="text-muted text-uppercase fw-semibold mb-0" style={{ fontSize: '0.65rem' }}>
                        <i className="bi bi-info-circle me-1"></i> {departments.find(d => d.id === viewDetails.deptId)?.name_en}
                      </p>
                    </div>
                    <Button variant="light" size="sm" className="rounded-circle border p-1 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }} onClick={() => setViewDetails({ type: null, deptId: null })}>
                      <i className="bi bi-x fs-6"></i>
                    </Button>
                  </div>
                  <div className="table-responsive">
                    <Table size="sm" hover className="align-middle mb-0 custom-table">
                      <thead className="bg-light">
                        <tr>
                          <th className="border-0 px-2 py-2 small">Division Details</th>
                          <th className="border-0 px-2 py-2 small">Head Name</th>
                          <th className="border-0 px-2 py-2 small text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {divisions.filter(d => d.department === viewDetails.deptId).map(div => (
                          <tr key={div.id}>
                            <td className="px-2 py-2">
                              <div className="fw-semibold text-dark small">{div.name_en}</div>
                              <div className="text-muted" style={{ fontSize: '0.7rem' }}>{div.name_hi}</div>
                            </td>
                            <td className="px-2 py-2">
                              {div.head_name ? (
                                <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill" style={{ fontSize: '0.7rem' }}>
                                  <i className="bi bi-person-fill me-1"></i> {div.head_name}
                                </span>
                              ) : (
                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded-pill" style={{ fontSize: '0.7rem' }}>
                                  <i className="bi bi-person-x-fill me-1"></i> Not Assigned
                                </span>
                              )}
                            </td>
                            <td className="px-2 py-2 text-end">
                              <div className="d-flex gap-1 justify-content-end">
                                {viewDetails.type === 'divisions' ? (
                                  <Button variant="outline-primary" size="sm" className="border-0 bg-primary bg-opacity-10 p-1 d-flex align-items-center justify-content-center" style={{ width: '26px', height: '26px' }} onClick={() => handleEditDivision(div)}>
                                    <i className="bi bi-pencil-square" style={{ fontSize: '0.8rem' }}></i>
                                  </Button>
                                ) : (
                                  <Button variant="outline-success" size="sm" className="border-0 bg-success bg-opacity-10 p-1 d-flex align-items-center justify-content-center" style={{ width: '26px', height: '26px' }} onClick={() => handleEditHead(div)}>
                                    <i className="bi bi-person-gear" style={{ fontSize: '0.8rem' }}></i>
                                  </Button>
                                )}
                                <Button variant="outline-danger" size="sm" className="border-0 bg-danger bg-opacity-10 p-1 d-flex align-items-center justify-content-center" style={{ width: '26px', height: '26px' }} onClick={() => handleDeleteDivision(div.id)}>
                                  <i className="bi bi-trash" style={{ fontSize: '0.8rem' }}></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              )}
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
          <Modal.Title className="fw-bold">{selectedDept ? "Update Department" : "Create New Department"}</Modal.Title>
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
              <Form.Label className="small fw-bold">Password {selectedDept ? "(Optional)" : ""}</Form.Label>
              <Form.Control 
                type="password" 
                placeholder={selectedDept ? "Leave blank to keep current" : "Enter initial password"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required={!selectedDept}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="secondary" className="rounded-pill px-4" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" className="rounded-pill px-4" type="submit">{selectedDept ? "Save Changes" : "Create Department"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Division Names Modal */}
      <Modal show={showDivModal} onHide={() => setShowDivModal(false)} centered size="sm">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold" style={{ fontSize: '1rem' }}>Update Division Names</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateDivision}>
          <Modal.Body className="pt-3">
            <Form.Group className="mb-2">
              <Form.Label className="fw-bold mb-1" style={{ fontSize: '0.7rem' }}>English Name</Form.Label>
              <Form.Control 
                size="sm"
                type="text" 
                value={divFormData.name_en} 
                onChange={(e) => setDivFormData({...divFormData, name_en: e.target.value})} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="fw-bold mb-1" style={{ fontSize: '0.7rem' }}>Hindi Name</Form.Label>
              <Form.Control 
                size="sm"
                type="text" 
                value={divFormData.name_hi} 
                onChange={(e) => setDivFormData({...divFormData, name_hi: e.target.value})} 
                required 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="secondary" size="sm" className="rounded-pill px-3" onClick={() => setShowDivModal(false)}>Cancel</Button>
            <Button variant="primary" size="sm" className="rounded-pill px-3" type="submit">Update</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Update Head Name Modal */}
      <Modal show={showHeadModal} onHide={() => setShowHeadModal(false)} centered size="sm">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold" style={{ fontSize: '1rem' }}>Assign Division Head</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateHead}>
          <Modal.Body className="pt-3">
            <Form.Group className="mb-2">
              <Form.Label className="fw-bold mb-1" style={{ fontSize: '0.7rem' }}>Head Member Name</Form.Label>
              <Form.Control 
                size="sm"
                type="text" 
                value={headFormData.head_name} 
                onChange={(e) => setHeadFormData({...headFormData, head_name: e.target.value})} 
                required 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="secondary" size="sm" className="rounded-pill px-3" onClick={() => setShowHeadModal(false)}>Cancel</Button>
            <Button variant="primary" size="sm" className="rounded-pill px-3" type="submit">Assign</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ITCellDashboard;