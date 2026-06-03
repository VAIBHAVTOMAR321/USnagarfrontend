import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Card, Spinner, Alert, Table } from 'react-bootstrap';
import { useAuth } from '../all_login/AuthContext';
import ITCellHeader from './ITCellHeader';
import ITCellLeftNav from './ITCellLeftNav';
import { API_BASE_URL } from '../../apiConfig';

const DepartmentDetailsManagement = () => {
  const { logout, accessToken } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [departments, setDepartments] = useState([]); // Stores the list of all departments
  const [departmentDetails, setDepartmentDetails] = useState(null); // Stores the department currently being edited
  const [formData, setFormData] = useState({ // Form data for editing/creating
    name_en: '',
    name_hi: '',
    hod_name: '',
    designation: ''
  });
  const [isEditing, setIsEditing] = useState(false); // Controls view/edit mode
  const [loading, setLoading] = useState(true); // Loading state for initial fetch and form submission
  const [error, setError] = useState(null); // Error message state
  const [successMessage, setSuccessMessage] = useState(null); // Success message state

  // Function to fetch department data
  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Attempt to fetch a list of departments.
      // For simplicity, we'll assume the IT Cell manages a single "main" department,
      // or we'll take the first one if multiple are returned.
      const listRes = await axios.get(`${API_BASE_URL}/departments/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      setDepartments(listRes.data || []);
      setIsEditing(false);
    } catch (err) {
      console.error("Error fetching department details:", err);
      setError("Failed to load department details. " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Setup edit mode for a specific department
  const handleEdit = (dept) => {
    setDepartmentDetails(dept);
    setFormData({
      name_en: dept.name_en,
      name_hi: dept.name_hi,
      hod_name: dept.hod_name || '',
      designation: dept.designation || ''
    });
    setIsEditing(true);
  };

  useEffect(() => {
    fetchDepartmentData();
  }, [accessToken]);

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (departmentDetails && departmentDetails.id) {
        // Update existing department
        await axios.put(`${API_BASE_URL}/departments/${departmentDetails.id}/`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        setSuccessMessage("Department details updated successfully!");
      } else {
        // Create new department (assuming POST /api/departments/ is the endpoint for creation)
        // The prompt implies creation is possible if no data is present.
        // If the backend only supports PUT for update and no POST for create, this part needs clarification.
        await axios.post(`${API_BASE_URL}/departments/`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        setSuccessMessage("New department created successfully! Refreshing data...");
      }
      setDepartmentDetails(null);
      setIsEditing(false); // Exit editing mode
      fetchDepartmentData(); // Re-fetch data to update UI and get new ID if created
    } catch (err) {
      console.error("Error saving department:", err);
      setError("Failed to save department details. " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
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

      <main className="flex-grow-1 d-flex flex-column bg-light" style={{ overflowY: 'auto' }}>
        <ITCellHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          handleLogout={handleLogout}
        />

        <div className="content-body p-4">
          <h2 className="mb-4 fw-bold">Department Details Management</h2>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Card className="border-0 shadow-sm p-4">
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                {!isEditing ? (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="fw-bold text-dark m-0">
                        <i className="bi bi-info-circle-fill me-2 text-primary"></i>
                        Department Configuration Records
                      </h5>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="rounded-pill px-4 shadow-sm" 
                        onClick={() => {
                          setDepartmentDetails(null);
                          setFormData({ name_en: '', name_hi: '', hod_name: '', designation: '' });
                          setIsEditing(true);
                        }}
                      >
                        <i className="bi bi-plus-circle me-2"></i>Add New Entry
                      </Button>
                    </div>
                    
                    <div className="table-responsive">
                      <Table bordered hover className="align-middle shadow-sm">
                        <thead className="table-light text-uppercase small fw-bold">
                          <tr>
                            <th style={{ width: '80px' }}>ID</th>
                            <th>English Name</th>
                            <th>Hindi Name</th>
                            <th>HOD Name</th>
                            <th>Designation</th>
                            <th className="text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {departments.length > 0 ? departments.map((dept) => (
                            <tr key={dept.id}>
                              <td><span className="badge bg-secondary-subtle text-secondary border">#{dept.id}</span></td>
                              <td className="fw-semibold text-primary">{dept.name_en}</td>
                              <td>{dept.name_hi}</td>
                              <td>{dept.hod_name || <span className="text-muted fst-italic small">N/A</span>}</td>
                              <td>{dept.designation || <span className="text-muted fst-italic small">N/A</span>}</td>
                              <td className="text-center">
                                <Button variant="outline-primary" size="sm" className="rounded-pill px-3" onClick={() => handleEdit(dept)}>
                                  <i className="bi bi-pencil-square me-1"></i> Edit
                                </Button>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={6} className="text-center py-5 text-muted">
                                <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                                No department entries found. Click "Add New Entry" to start.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </>
                ) : (
                  <>
                    <h5 className="fw-bold text-dark mb-4">
                      <i className="bi bi-pencil-fill me-2 text-warning"></i>
                      {departmentDetails ? 'Update Department Configuration' : 'Initial Department Setup'}
                    </h5>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">English Name (System Identifier)</Form.Label>
                        <Form.Control
                          type="text"
                          name="name_en"
                          value={formData.name_en}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Hindi Name (Display Name)</Form.Label>
                        <Form.Control
                          type="text"
                          name="name_hi"
                          value={formData.name_hi}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">HOD Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="hod_name"
                          value={formData.hod_name}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Current Designation</Form.Label>
                        <Form.Control
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <div className="d-flex gap-2 mt-4">
                        <Button variant="success" type="submit" className="rounded-pill px-4 shadow-sm" disabled={loading}>
                          {loading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
                        </Button>
                        <Button variant="outline-secondary" className="rounded-pill px-4" onClick={() => setIsEditing(false)} disabled={loading}>
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  </>
                )}
              </Card.Body>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default DepartmentDetailsManagement;