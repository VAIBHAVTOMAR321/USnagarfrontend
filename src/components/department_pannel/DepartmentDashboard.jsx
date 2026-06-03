import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { useAuth } from '../all_login/AuthContext';
import { API_BASE_URL } from '../../apiConfig';
import DepartmentHeader from './DepartmentHeader';
import DepartmentLeftNav from './DepartmentLeftNav';

const DepartmentDashboard = () => {
  const { logout, accessToken, departmentId } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Department Management State
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [formData, setFormData] = useState({ name_en: '', name_hi: '', password: '' });

  // Division Management State
  const [divisions, setDivisions] = useState([]);
  const [showDivisionsTable, setShowDivisionsTable] = useState(false);
  const [showAddDivisionModal, setShowAddDivisionModal] = useState(false);
  const [divisionFormData, setDivisionFormData] = useState({ name_en: '', name_hi: '' });
  
  // Bulk Update State
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [showBulkHeadModal, setShowBulkHeadModal] = useState(false);
  const [bulkHeadName, setBulkHeadName] = useState('');

  // New state for total works
  const [totalWorksCount, setTotalWorksCount] = useState(0);
  const [loadingWorks, setLoadingWorks] = useState(true);

  const fetchTotalWorks = async () => {
    if (!departmentId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/works/?department=${departmentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      // Filter response to strictly count only this department's works
      const departmentWorks = res.data.filter(w => String(w.department) === String(departmentId));
      setTotalWorksCount(departmentWorks.length);
    } catch (err) {
      console.error("Error fetching total works:", err);
    } finally {
      setLoadingWorks(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const url = departmentId ? `${API_BASE_URL}/departments/${departmentId}/` : `${API_BASE_URL}/departments/`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      // If departmentId is set, the API returns a single object; wrap it in an array for component compatibility
      setDepartments(departmentId ? [res.data] : res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDivisions = async () => {
    try {
      const url = departmentId ? `${API_BASE_URL}/divisions/?department=${departmentId}` : `${API_BASE_URL}/divisions/`;
      const res = await axios.get(url, {
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
    fetchTotalWorks();
  }, [accessToken, departmentId]);

  const handleEdit = (dept) => {
    setSelectedDept(dept);
    setFormData({ name_en: dept.name_en, name_hi: dept.name_hi, password: '' });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        name_en: formData.name_en,
        name_hi: formData.name_hi
      };

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

  const handleAddDivision = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...divisionFormData,
        department: selectedDept.id
      };
      await axios.post(`${API_BASE_URL}/divisions/`, payload, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json' 
        }
      });
      setShowAddDivisionModal(false);
      setDivisionFormData({ name_en: '', name_hi: '' });
      fetchDivisions();
      alert("Division created successfully!");
    } catch (err) {
      alert("Failed to create division: " + (err.response?.data?.message || "Error occurred"));
    }
  };

  const handleBulkUpdateHead = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/divisions/bulk-update-head/`, {
        division_ids: selectedDivisions,
        head_name: bulkHeadName
      }, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json' 
        }
      });
      setShowBulkHeadModal(false);
      setSelectedDivisions([]);
      setBulkHeadName('');
      fetchDivisions();
      alert("Bulk update successful!");
    } catch (err) {
      alert("Bulk update failed.");
    }
  };

  const toggleDivisionSelection = (id) => {
    setSelectedDivisions(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
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

      {/* Main Content */}
      <main className="flex-grow-1 d-flex flex-column bg-light" style={{ overflowY: 'auto' }}>
        <DepartmentHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          handleLogout={handleLogout} 
        />

        <div className="content-body p-4">
          <div className="row g-4 mb-4">
            {/* Total Departments Card (Toggle Table) */}
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
                    <h4 className={`fw-bold mb-0 ${showTable ? 'text-primary' : 'text-dark'}`}>
                      {loading ? <Spinner animation="border" size="sm" /> : departments.length}
                    </h4>
                    <p className="text-muted small mb-0">{departmentId ? 'My Department' : 'Total Departments'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Divisions Card (Toggle Table) */}
            <div className="col-md-6 col-lg-3">
              <div 
                className={`card border-0 shadow-sm h-100 transition-all ${showDivisionsTable ? 'bg-success-subtle' : 'bg-white'}`} 
                style={{ cursor: 'pointer' }}
                onClick={() => setShowDivisionsTable(!showDivisionsTable)}
              >
                <div className="card-body d-flex align-items-center">
                  <div className={`${showDivisionsTable ? 'bg-white' : 'bg-success-subtle'} rounded p-3 me-3 text-success shadow-sm`}>
                    <i className="bi bi-diagram-3-fill fs-3"></i>
                  </div>
                  <div>
                    <h4 className={`fw-bold mb-0 ${showDivisionsTable ? 'text-success' : 'text-dark'}`}>{divisions.length}</h4>
                    <p className="text-muted small mb-0">{departmentId ? 'My Divisions' : 'Total Divisions'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* My Works Card */}
            <div className="col-md-6 col-lg-3">
              <div
                className="card border-0 shadow-sm h-100 bg-white" 
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/AddWork')}
              >
                <div className="card-body d-flex align-items-center">
                  <div className="bg-info-subtle rounded p-3 me-3 text-info shadow-sm">
                    <i className="bi bi-list-task fs-3"></i>
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0 text-dark">
                      {loadingWorks ? <Spinner animation="border" size="sm" /> : totalWorksCount}
                    </h4>
                    <p className="text-muted small mb-0">My Works</p>
                  </div>
                </div>
              </div>
            </div>

            {[
              { label: 'Pending Apps', value: '18', icon: 'bi-hourglass-split', color: 'warning' },
              { label: 'Approved', value: '142', icon: 'bi-check-circle', color: 'success' },
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

          {showTable && (
            <div className="card border-0 shadow-sm p-4 mt-4 animate-fade-in">
              <h5 className="mb-4 fw-bold text-dark">{departmentId ? 'My Department Details' : 'Department Management'}</h5>
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
                        <Button variant="info" size="sm" className="me-2 rounded-pill px-3 text-white" onClick={() => { setSelectedDept(dept); setShowAddDivisionModal(true); }}>
                          Add Division
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

          {showDivisionsTable && (
            <div className="card border-0 shadow-sm p-4 mt-4 animate-fade-in">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-dark m-0">Division Management</h5>
                {selectedDivisions.length > 0 && (
                  <Button variant="primary" size="sm" onClick={() => setShowBulkHeadModal(true)}>
                    Assign Head to Selected ({selectedDivisions.length})
                  </Button>
                )}
              </div>
              <Table responsive hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Select</th>
                    <th>ID</th>
                    <th>English Name</th>
                    <th>Hindi Name</th>
                    <th>Head Name</th>
                    <th>Department ID</th>
                  </tr>
                </thead>
                <tbody>
                  {divisions.map((div) => (
                    <tr key={div.id}>
                      <td>
                        <Form.Check 
                          type="checkbox" 
                          checked={selectedDivisions.includes(div.id)}
                          onChange={() => toggleDivisionSelection(div.id)}
                        />
                      </td>
                      <td>{div.id}</td>
                      <td>{div.name_en}</td>
                      <td>{div.name_hi}</td>
                      <td>{div.head_name || 'N/A'}</td>
                      <td>{div.department}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {!showTable && !showDivisionsTable && (
            <div className="card border-0 shadow-sm p-4">
              <h6>Recent Departmental Requests</h6>
              <p className="text-muted small">No new requests. Click on cards above to manage Departments or Divisions.</p>
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

      {/* Add Division Modal */}
      <Modal show={showAddDivisionModal} onHide={() => setShowAddDivisionModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Add Division to {selectedDept?.name_en}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddDivision}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Division Name (English)</Form.Label>
              <Form.Control 
                type="text" 
                value={divisionFormData.name_en} 
                onChange={(e) => setDivisionFormData({...divisionFormData, name_en: e.target.value})} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Division Name (Hindi)</Form.Label>
              <Form.Control 
                type="text" 
                value={divisionFormData.name_hi} 
                onChange={(e) => setDivisionFormData({...divisionFormData, name_hi: e.target.value})} 
                required 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="secondary" onClick={() => setShowAddDivisionModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Create Division</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Bulk Update Head Modal */}
      <Modal show={showBulkHeadModal} onHide={() => setShowBulkHeadModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Bulk Assign Head</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleBulkUpdateHead}>
          <Modal.Body>
            <p className="text-muted small">You are assigning a head to {selectedDivisions.length} divisions.</p>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">New Head Name</Form.Label>
              <Form.Control 
                type="text" 
                value={bulkHeadName} 
                onChange={(e) => setBulkHeadName(e.target.value)} 
                required 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="secondary" onClick={() => setShowBulkHeadModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Apply Update</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentDashboard;