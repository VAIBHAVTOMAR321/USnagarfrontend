import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Table, Button, Modal, Form, Spinner, Card, Row, Col } from 'react-bootstrap';
import { useAuth } from '../all_login/AuthContext';
import { API_BASE_URL } from '../../apiConfig';
import DepartmentHeader from './DepartmentHeader';
import DepartmentLeftNav from './DepartmentLeftNav';
import AdminLeftNav from '../admin_pannel/AdminLeftNav'; // Import AdminLeftNav
import ITCellLeftNav from '../it_cell_pannel/ITCellLeftNav';

const AddWork = () => {
  const { logout, accessToken, departmentId, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data State
  const [departments, setDepartments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [showForm, setShowForm] = useState(location.state?.openForm || false);

  // Form State for Adding Work
  const [formData, setFormData] = useState({
    department: '',
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

  // View Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingWork, setViewingWork] = useState(null);

  const handleViewClick = (work) => {
    setViewingWork(work);
    setShowViewModal(true);
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/departments/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const fetchDivisions = async (deptId) => {
    const targetDeptId = deptId || departmentId;
    if (!targetDeptId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/divisions/?department=${targetDeptId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setDivisions(res.data);
    } catch (err) {
      console.error("Error fetching divisions:", err);
    }
  };

  const fetchWorks = async () => {
    try {
      const url = role === 'department' ? `${API_BASE_URL}/works/?department=${departmentId}` : `${API_BASE_URL}/works/`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      // Ensure strict filtering for departmental users on the frontend to prevent data leakage
      if (role === 'department') {
        const filteredWorks = res.data.filter(w => String(w.department) === String(departmentId));
        setWorks(filteredWorks);
      } else {
        setWorks(res.data);
      }
    } catch (err) {
      console.error("Error fetching works:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      if (role === 'it_cell' || role === 'admin') {
        fetchDepartments();
      } else if (role === 'department' && departmentId) {
        fetchDivisions();
      }
      fetchWorks();
    }
  }, [departmentId, accessToken, role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'department' && role === 'it_cell') {
      fetchDivisions(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        department: role === 'it_cell' ? parseInt(formData.department) : parseInt(departmentId),
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
        department: '',
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
    if (role === 'it_cell') {
      fetchDivisions(work.department);
    }
    setEditFormData({
      id: work.id,
      department: work.department,
      division: work.division,
      vidhan_sabha: work.vidhan_sabha,
      village_name: work.village_name,
      head_name: work.head_name || '',
      component: work.component || '',
      scheme_type: work.scheme_type,
      project_name: work.project_name,
      work_name: work.work_name
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...editFormData,
        division: parseInt(editFormData.division),
        department: role === 'it_cell' ? parseInt(editFormData.department) : parseInt(departmentId)
      };

      await axios.put(`${API_BASE_URL}/works/`, payload, {
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
      {role === 'it_cell' ? (
        <ITCellLeftNav sidebarOpen={sidebarOpen} />
      ) : role === 'admin' ? (
        <AdminLeftNav sidebarOpen={sidebarOpen} />
      ) : (
        <DepartmentLeftNav sidebarOpen={sidebarOpen} />
      )}

      <main className="flex-grow-1 d-flex flex-column" style={{ overflowY: 'auto', backgroundColor: '#F8FAFC' }}>
        <DepartmentHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          handleLogout={handleLogout} 
        />

        <div className="content-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold m-0" style={{ color: '#1E293B' }}>
              {role === 'admin' ? 'Infrastructure Project Registry' : 'Works Management'}
            </h4>
            {role !== 'admin' && (
              <Button 
                variant={showForm ? "outline-secondary" : "primary"}
                className="rounded-pill px-4 shadow-sm fw-bold"
                style={!showForm ? { backgroundColor: '#4F46E5', border: 'none' } : {}}
                onClick={() => setShowForm(!showForm)}
              >
                <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-2`}></i>
                {showForm ? 'Cancel Entry' : 'Add New Work'}
              </Button>
            )}
          </div>

          {role !== 'admin' && showForm && (
            <Card className="shadow-sm mb-4" style={{ border: '1px solid #E2E8F0', borderRadius: '12px' }}>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    {role === 'it_cell' && (
                      <Col lg={3} md={6}>
                        <Form.Group>
                          <Form.Label className="small fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#475569' }}>Department <span className="text-danger">*</span></Form.Label>
                          <Form.Select size="sm" name="department" value={formData.department} onChange={handleChange} required className="border-slate-200 shadow-none" style={{ fontSize: '0.85rem' }}>
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                              <option key={dept.id} value={dept.id}>{dept.name_en}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    )}
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
          )}

          <Card className="shadow-sm" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
            <Card.Body className="p-0">
              <h6 className="fw-bold px-3 py-3 m-0 d-flex align-items-center" style={{ color: '#1E293B', fontSize: '0.85rem' }}>
                <i className="bi bi-list-task me-2 text-secondary"></i> {role === 'admin' ? 'ALL DEPARTMENTAL WORKS' : role === 'it_cell' ? 'INFRASTRUCTURE WORK ENTRIES' : 'MY DEPARTMENTAL WORKS'}
              </h6>
              {loading ? (
                <div className="text-center p-4"><Spinner animation="border" size="sm" /></div>
              ) : (
                works.length > 0 ? (
                  <Table responsive hover className="align-middle mb-0">
                    <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #F1F5F9' }}>
                      <tr className="text-muted" style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <th className="px-4 py-3">Work ID</th>
                        <th className="py-3">Department</th>
                        <th className="py-3">Division</th>
                        <th className="py-3">Vidhan Sabha</th>
                        <th className="py-3">Village</th>
                        <th className="py-3">Project Name</th>
                        <th className="py-3">Work Description</th>
                        <th className="py-3">Head</th>
                        <th className="py-3">Component</th>
                        <th className="py-3">Scheme</th>
                        <th className="text-center py-3" style={{ minWidth: '130px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: '0.85rem', color: '#334155' }}>
                      {works.map((work) => (
                      <tr key={work.id}>
                        <td className="px-4"><span className="badge bg-slate-100 text-slate-700 border fw-medium" style={{ backgroundColor: '#F1F5F9', color: '#475569' }}>{work.work_id}</span></td>
                        <td className="text-truncate fw-bold" style={{ maxWidth: '120px', color: '#4F46E5' }}>
                          {work.department_name_en || 
                           departments.find(d => d.id === work.department)?.name_en || 
                           `Dept ID: ${work.department}`}
                        </td>
                        <td className="text-truncate" style={{ maxWidth: '100px' }}>{work.division_name_en}</td>
                        <td>{work.vidhan_sabha}</td>
                        <td>{work.village_name}</td>
                        <td className="text-truncate" style={{ maxWidth: '150px' }}>{work.project_name}</td>
                        <td className="text-truncate" style={{ maxWidth: '150px' }}>{work.work_name}</td>
                        <td className="text-truncate" style={{ maxWidth: '100px' }}>{work.head_name || 'N/A'}</td>
                        <td>{work.component || 'N/A'}</td>
                        <td><span className="fw-medium" style={{ color: '#4F46E5' }}>{work.scheme_type}</span></td>
                        <td className="text-center">
                          <Button variant="link" size="sm" className="text-info p-0 me-2 shadow-none opacity-75 hover-opacity-100" title="View Details" onClick={() => handleViewClick(work)}>
                            <i className="bi bi-eye"></i>
                          </Button>
                          {role !== 'admin' && (
                            <>
                            <Button variant="link" size="sm" className="text-primary p-0 me-2 shadow-none opacity-75 hover-opacity-100" onClick={() => handleEditClick(work)}>
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button variant="link" size="sm" className="text-danger p-0 shadow-none opacity-75 hover-opacity-100" onClick={() => handleDelete(work.id)}>
                              <i className="bi bi-trash"></i>
                            </Button>
                            </>
                          )}
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

      {/* View Work Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 bg-light">
          <Modal.Title className="fw-bold text-primary d-flex align-items-center" style={{ fontSize: '1.25rem' }}>
            <i className="bi bi-info-circle-fill me-2"></i> Work Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {viewingWork && (
            <div className="detail-container">
              <Row className="g-3 mb-4">
                <Col md={4}>
                  <label className="text-secondary fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.75rem' }}>Work ID</label>
                  <div className="fw-bold text-dark p-2 bg-white rounded border border-slate-200" style={{ fontSize: '0.875rem' }}>{viewingWork.work_id}</div>
                </Col>
                <Col md={4}>
                  <label className="text-secondary fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.75rem' }}>Department</label>
                  <div className="fw-bold text-primary p-2 bg-white rounded border border-slate-200" style={{ fontSize: '0.875rem' }}>
                    {viewingWork.department_name_en || 
                     departments.find(d => d.id === viewingWork.department)?.name_en || 
                     `Dept ID: ${viewingWork.department}`}
                  </div>
                </Col>
                <Col md={4}>
                  <label className="text-secondary fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.75rem' }}>Division</label>
                  <div className="fw-semibold text-dark p-2 bg-white rounded border border-slate-200" style={{ fontSize: '0.875rem' }}>{viewingWork.division_name_en}</div>
                </Col>
                <Col md={4}>
                  <label className="text-secondary fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.75rem' }}>Vidhan Sabha</label>
                  <div className="fw-semibold text-dark p-2 bg-white rounded border border-slate-200" style={{ fontSize: '0.875rem' }}>{viewingWork.vidhan_sabha}</div>
                </Col>
                <Col md={4}>
                  <label className="text-secondary fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.75rem' }}>Village Name</label>
                  <div className="fw-semibold text-dark p-2 bg-white rounded border border-slate-200" style={{ fontSize: '0.875rem' }}>{viewingWork.village_name}</div>
                </Col>
                <Col md={4}>
                  <label className="text-secondary fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.75rem' }}>Head Name</label>
                  <div className="fw-semibold text-dark p-2 bg-white rounded border border-slate-200" style={{ fontSize: '0.875rem' }}>{viewingWork.head_name || 'N/A'}</div>
                </Col>
                <Col md={4}>
                  <label className="text-secondary fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.75rem' }}>Component</label>
                  <div className="fw-semibold text-dark p-2 bg-white rounded border border-slate-200" style={{ fontSize: '0.875rem' }}>{viewingWork.component || 'N/A'}</div>
                </Col>
                <Col md={4}>
                  <label className="text-secondary fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.75rem' }}>Scheme Type</label>
                  <div className="fw-semibold text-dark p-2 bg-white rounded border border-slate-200" style={{ fontSize: '0.875rem' }}>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle">{viewingWork.scheme_type}</span>
                  </div>
                </Col>
              </Row>
              <Row className="g-3">
                <Col md={12}>
                  <label className="text-secondary fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.75rem' }}>Project Name</label>
                  <div className="fw-bold text-dark p-3 border rounded shadow-sm bg-white" style={{ fontSize: '1rem' }}>{viewingWork.project_name}</div>
                </Col>
                <Col md={12}>
                  <label className="text-secondary fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.75rem' }}>Detailed Work Description</label>
                  <div className="p-3 bg-white rounded border" style={{ whiteSpace: 'pre-wrap', minHeight: '100px', fontSize: '0.9rem', color: '#334155' }}>
                    {viewingWork.work_name}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 bg-light">
          <Button variant="secondary" className="rounded-pill px-4 fw-bold shadow-sm btn-sm" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Work Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 bg-light">
          <Modal.Title className="fw-bold text-primary">
            <i className="bi bi-pencil-square me-2"></i> Update Work Details
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              {(role === 'it_cell' || role === 'admin') && (
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#475569' }}>Department <span className="text-danger">*</span></Form.Label>
                    <Form.Select 
                      size="sm" 
                      value={editFormData.department || ''} 
                      onChange={(e) => {
                        setEditFormData({...editFormData, department: e.target.value});
                        fetchDivisions(e.target.value);
                      }} 
                      required 
                      className="border-slate-200 shadow-none"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name_en}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              )}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#475569' }}>Division <span className="text-danger">*</span></Form.Label>
                  <Form.Select size="sm" value={editFormData.division || ''} onChange={(e) => setEditFormData({...editFormData, division: e.target.value})} required className="border-slate-200 shadow-none">
                    <option value="">Select Division</option>
                    {divisions.map(div => (
                      <option key={div.id} value={div.id}>{div.name_en}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#475569' }}>Vidhan Sabha <span className="text-danger">*</span></Form.Label>
                  <Form.Control size="sm" type="text" value={editFormData.vidhan_sabha || ''} onChange={(e) => setEditFormData({...editFormData, vidhan_sabha: e.target.value})} required className="border-slate-200 shadow-none" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#475569' }}>Village Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control size="sm" type="text" value={editFormData.village_name || ''} onChange={(e) => setEditFormData({...editFormData, village_name: e.target.value})} required className="border-slate-200 shadow-none" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#475569' }}>Head Name</Form.Label>
                  <Form.Control size="sm" type="text" value={editFormData.head_name || ''} onChange={(e) => setEditFormData({...editFormData, head_name: e.target.value})} className="border-slate-200 shadow-none" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#475569' }}>Component</Form.Label>
                  <Form.Control size="sm" type="text" value={editFormData.component || ''} onChange={(e) => setEditFormData({...editFormData, component: e.target.value})} className="border-slate-200 shadow-none" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#475569' }}>Scheme Type <span className="text-danger">*</span></Form.Label>
                  <Form.Select size="sm" value={editFormData.scheme_type || ''} onChange={(e) => setEditFormData({...editFormData, scheme_type: e.target.value})} required className="border-slate-200 shadow-none">
                    <option value="">Select Scheme</option>
                    <option value="State Scheme">State Scheme</option>
                    <option value="Central Scheme">Central Scheme</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#475569' }}>Project Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control size="sm" type="text" value={editFormData.project_name || ''} onChange={(e) => setEditFormData({...editFormData, project_name: e.target.value})} required className="border-slate-200 shadow-none" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#475569' }}>Work Description <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    size="sm"
                    as="textarea" 
                    rows={3} 
                    value={editFormData.work_name || ''} 
                    onChange={(e) => setEditFormData({...editFormData, work_name: e.target.value})} 
                    required 
                    className="border-slate-200 shadow-none" 
                    style={{ resize: 'vertical', fontSize: '0.85rem' }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 bg-light">
            <Button variant="secondary" className="rounded-pill px-4 btn-sm" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="primary" className="rounded-pill px-4 btn-sm fw-bold shadow-sm" type="submit" style={{ backgroundColor: '#4F46E5', border: 'none' }}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AddWork;