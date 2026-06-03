import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, Modal, Form, Spinner, Card, Row, Col } from 'react-bootstrap';
import { useAuth } from '../all_login/AuthContext';
import { API_BASE_URL } from '../../apiConfig';
import DepartmentHeader from './DepartmentHeader';
import DepartmentLeftNav from './DepartmentLeftNav';

const AddWork = () => {
  const { logout, accessToken, departmentId } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data State
  const [divisions, setDivisions] = useState([]);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State for Adding Work
  const [formData, setFormData] = useState({
    division: '',
    vidhan_sabha: '',
    project_name: '',
    village_name: '',
    head_name: '',
    component: '',
    scheme_type: '',
    work_name: ''
  });

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWork, setEditingWork] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchDivisions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/divisions/?department=${departmentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setDivisions(res.data);
    } catch (err) {
      console.error("Error fetching divisions:", err);
    }
  };

  const fetchWorks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/works/?department=${departmentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setWorks(res.data);
    } catch (err) {
      console.error("Error fetching works:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (departmentId && accessToken) {
      fetchDivisions();
      fetchWorks();
    }
  }, [departmentId, accessToken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        department: parseInt(departmentId),
        division: parseInt(formData.division)
      };

      await axios.post(`${API_BASE_URL}/works/`, payload, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      alert("Work created successfully!");
      setFormData({
        division: '',
        vidhan_sabha: '',
        project_name: '',
        village_name: '',
        head_name: '',
        component: '',
        scheme_type: '',
        work_name: ''
      });
      fetchWorks();
    } catch (err) {
      alert("Failed to create work: " + (err.response?.data?.message || "Error occurred"));
    }
  };

  const handleEditClick = (work) => {
    setEditingWork(work);
    setEditFormData({
      id: work.id,
      project_name: work.project_name,
      village_name: work.village_name
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/works/`, editFormData, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      alert("Work updated successfully!");
      setShowEditModal(false);
      fetchWorks();
    } catch (err) {
      alert("Update failed.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this work?")) {
      try {
        await axios.delete(`${API_BASE_URL}/works/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          data: { id }
        });
        alert("Work deleted successfully!");
        fetchWorks();
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("Logout from Departmental Portal?")) {
      logout();
      navigate('/Login');
    }
  };

  return (
    <div className="dept-dashboard-container d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <DepartmentLeftNav sidebarOpen={sidebarOpen} />

      <main className="flex-grow-1 d-flex flex-column" style={{ overflowY: 'auto', backgroundColor: '#F8FAFC' }}>
        <DepartmentHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          handleLogout={handleLogout} 
        />

        <div className="content-body p-4">
          <Card className="shadow-sm mb-4" style={{ border: '1px solid #E2E8F0', borderRadius: '12px' }}>
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-4 d-flex align-items-center" style={{ color: '#1E293B', letterSpacing: '0.3px' }}>
                <i className="bi bi-plus-circle-fill me-2 text-primary"></i> CREATE NEW WORK ENTRY
              </h6>
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#475569' }}>Division <span className="text-danger">*</span></Form.Label>
                      <Form.Select size="sm" name="division" value={formData.division} onChange={handleChange} required className="border-slate-200 shadow-none" style={{ fontSize: '0.85rem' }}>
                        <option value="">Select Division</option>
                        {divisions.map(div => (
                          <option key={div.id} value={div.id}>{div.name_en}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#475569' }}>Vidhan Sabha <span className="text-danger">*</span></Form.Label>
                      <Form.Control size="sm" type="text" name="vidhan_sabha" placeholder="Enter Vidhan Sabha" value={formData.vidhan_sabha} onChange={handleChange} required className="border-slate-200 shadow-none" style={{ fontSize: '0.85rem' }} />
                    </Form.Group>
                  </Col>
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#475569' }}>Village Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control size="sm" type="text" name="village_name" placeholder="Enter Village Name" value={formData.village_name} onChange={handleChange} required className="border-slate-200 shadow-none" style={{ fontSize: '0.85rem' }} />
                    </Form.Group>
                  </Col>
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#475569' }}>Head Name</Form.Label>
                      <Form.Control size="sm" type="text" name="head_name" placeholder="Enter Head Name" value={formData.head_name} onChange={handleChange} className="border-slate-200 shadow-none" style={{ fontSize: '0.85rem' }} />
                    </Form.Group>
                  </Col>
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#475569' }}>Component</Form.Label>
                      <Form.Control size="sm" type="text" name="component" placeholder="Enter Component" value={formData.component} onChange={handleChange} className="border-slate-200 shadow-none" style={{ fontSize: '0.85rem' }} />
                    </Form.Group>
                  </Col>
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#475569' }}>Scheme Type <span className="text-danger">*</span></Form.Label>
                      <Form.Select size="sm" name="scheme_type" value={formData.scheme_type} onChange={handleChange} required className="border-slate-200 shadow-none" style={{ fontSize: '0.85rem' }}>
                        <option value="">Select Scheme</option>
                        <option value="State Scheme">State Scheme</option>
                        <option value="Central Scheme">Central Scheme</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#475569' }}>Project Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control size="sm" type="text" name="project_name" placeholder="Enter Project Name" value={formData.project_name} onChange={handleChange} required className="border-slate-200 shadow-none" style={{ fontSize: '0.85rem' }} />
                    </Form.Group>
                  </Col>
                  <Col lg={3} md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#475569' }}>Work Description <span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        size="sm"
                        as="textarea" 
                        placeholder="Describe the work..."
                        rows={1} 
                        name="work_name" 
                        value={formData.work_name} 
                        onChange={handleChange} 
                        required 
                        className="border-slate-200 shadow-none" 
                        style={{ resize: 'vertical', minHeight: '31px', fontSize: '0.85rem' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="mt-4 text-end">
                  <Button 
                    type="submit" 
                    style={{ backgroundColor: '#4F46E5', border: 'none', transition: 'transform 0.2s, box-shadow 0.2s' }} 
                    className="rounded-pill px-5 py-2 fw-bold shadow hover-lift"
                    onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
                    onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'; }}
                  >
                    <i className="bi bi-send-fill me-2"></i> SUBMIT WORK
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card className="shadow-sm" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
            <Card.Body className="p-0">
              <h6 className="fw-bold px-3 py-3 m-0 d-flex align-items-center" style={{ color: '#1E293B', fontSize: '0.85rem' }}>
                <i className="bi bi-list-task me-2 text-secondary"></i> MY DEPARTMENTAL WORKS
              </h6>
              {loading ? (
                <div className="text-center p-4"><Spinner animation="border" size="sm" /></div>
              ) : (
                works.length > 0 ? (
                  <Table responsive hover className="align-middle mb-0">
                    <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #F1F5F9' }}>
                      <tr className="text-muted" style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <th className="px-4 py-3">Work ID</th>
                        <th className="py-3">Division</th>
                        <th className="py-3">Project Details</th>
                        <th className="py-3">Village</th>
                        <th className="py-3">Scheme</th>
                        <th className="text-center py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: '0.85rem', color: '#334155' }}>
                      {works.map((work) => (
                      <tr key={work.id}>
                        <td className="px-4"><span className="badge bg-slate-100 text-slate-700 border fw-medium" style={{ backgroundColor: '#F1F5F9', color: '#475569' }}>{work.work_id}</span></td>
                        <td className="text-truncate" style={{ maxWidth: '120px' }}>{work.division_name_en}</td>
                        <td>
                          <div className="fw-bold" style={{ color: '#1E293B' }}>{work.project_name}</div>
                          <div className="text-muted x-small text-truncate" style={{ maxWidth: '250px', fontSize: '0.75rem' }}>{work.work_name}</div>
                        </td>
                        <td>{work.village_name}</td>
                        <td><span className="fw-medium text-indigo-600" style={{ color: '#4F46E5' }}>{work.scheme_type}</span></td>
                        <td className="text-center">
                          <Button variant="link" size="sm" className="text-primary p-0 me-3 shadow-none opacity-75 hover-opacity-100" onClick={() => handleEditClick(work)}>
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button variant="link" size="sm" className="text-danger p-0 shadow-none opacity-75 hover-opacity-100" onClick={() => handleDelete(work.id)}>
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-5">
                    <div className="mb-3 opacity-25">
                      <i className="bi bi-folder2-open" style={{ fontSize: '4rem', color: '#64748B' }}></i>
                    </div>
                    <h5 className="fw-bold" style={{ color: '#64748B' }}>No Work Records Found</h5>
                    <p className="text-muted small">Your department hasn't registered any work entries yet.</p>
                  </div>
                )
              )}
            </Card.Body>
          </Card>
        </div>
      </main>

      {/* Edit Work Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Update Work Info</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Project Name</Form.Label>
              <Form.Control 
                type="text" 
                value={editFormData.project_name || ''} 
                onChange={(e) => setEditFormData({...editFormData, project_name: e.target.value})} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Village Name</Form.Label>
              <Form.Control 
                type="text" 
                value={editFormData.village_name || ''} 
                onChange={(e) => setEditFormData({...editFormData, village_name: e.target.value})} 
                required 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AddWork;