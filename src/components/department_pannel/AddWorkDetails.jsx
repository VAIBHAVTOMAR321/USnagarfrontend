import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Spinner, Card, Form, Row, Col } from 'react-bootstrap';
import { useAuth } from '../all_login/AuthContext';
import { API_BASE_URL } from '../../apiConfig';
import DepartmentHeader from './DepartmentHeader';
import DepartmentLeftNav from './DepartmentLeftNav';

const AddWorkDetails = () => {
  const { logout, accessToken, departmentId } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the detailed progress form
  const [selectedWork, setSelectedWork] = useState(null);
  const [progressFormData, setProgressFormData] = useState({
    sanction_date: '',
    estimated_cost: '',
    approved_outlay: '',
    dm_level_funds: '',
    released_amount: '',
    balance_as_on_date: '',
    surrendered_amount: '',
    work_start_date: '',
    physical_target: '',
    unit: '',
    latitude: '',
    longitude: '',
    phase_1_img: null,
    phase_2_img: null,
    phase_3_img: null,
    phase_4_img: null,
  });

  const [detailsExist, setDetailsExist] = useState(false);
  const [fetchedImages, setFetchedImages] = useState({}); // { 1: {url, id}, 2: {url, id} }
  // Separate loading states for different actions
  const [submittingDetails, setSubmittingDetails] = useState(false);
  const [uploadingPhase, setUploadingPhase] = useState(null); // Tracks phase number being uploaded

  const fetchWorks = async () => {
    try {
      const url = `${API_BASE_URL}/works/?department=${departmentId}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      // Strict filtering for departmental users on the frontend
      const filteredWorks = res.data.filter(w => String(w.department) === String(departmentId));
      setWorks(filteredWorks);
    } catch (err) {
      console.error("Error fetching works:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && departmentId) {
      fetchWorks();
    }
  }, [accessToken, departmentId]);

  const fetchExistingDetails = async (workId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/work-details/?work_id=${workId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      // Find the specific details for this work_id if the API returns a list
      const details = Array.isArray(res.data) ? res.data.find(d => d.work_id === workId) : (res.data?.work_id === workId ? res.data : null);
      
      if (details) {
        setDetailsExist(true);
        setProgressFormData(prev => ({
          ...prev,
          sanction_date: details.sanction_date || '',
          estimated_cost: details.estimated_cost || '',
          approved_outlay: details.approved_outlay || '',
          dm_level_funds: details.dm_level_funds || '',
          released_amount: details.released_amount || '',
          balance_as_on_date: details.balance_as_on_date || '',
          surrendered_amount: details.surrendered_amount || '',
          work_start_date: details.work_start_date || '',
          physical_target: details.physical_target || '',
          unit: details.unit || '',
          latitude: details.latitude || '',
          longitude: details.longitude || '',
        }));
      } else {
        setDetailsExist(false);
      }
    } catch (err) {
      console.error("Error fetching existing details:", err);
      setDetailsExist(false);
    }
  };

  const fetchExistingImages = async (workId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/work-images/?work_id=${workId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const imagesMap = {};
      res.data.forEach(img => {
        imagesMap[img.phase_number] = img;
      });
      setFetchedImages(imagesMap);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProgressFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setProgressFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleAddDetailsClick = (work) => {
    setSelectedWork(work);
    setDetailsExist(false);
    // Reset form data state to clear any previous work's values
    setProgressFormData({
      sanction_date: '',
      estimated_cost: '',
      approved_outlay: '',
      dm_level_funds: '',
      released_amount: '',
      balance_as_on_date: '',
      surrendered_amount: '',
      work_start_date: '',
      physical_target: '',
      unit: '',
      latitude: '',
      longitude: '',
      phase_1_img: null,
      phase_2_img: null,
      phase_3_img: null,
      phase_4_img: null,
    });
    fetchExistingDetails(work.work_id);
    fetchExistingImages(work.work_id);
  };

  const handleBackToTable = () => {
    setSelectedWork(null);
    setDetailsExist(false);
    setFetchedImages({});
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    setSubmittingDetails(true);
    try {
      const payload = {
        work_id: selectedWork.work_id, // Sending the string identifier from the table (e.g. WORK-001)
        sanction_date: progressFormData.sanction_date,
        estimated_cost: parseFloat(progressFormData.estimated_cost) || 0,
        approved_outlay: parseFloat(progressFormData.approved_outlay) || 0,
        dm_level_funds: parseFloat(progressFormData.dm_level_funds) || 0,
        released_amount: parseFloat(progressFormData.released_amount) || 0,
        balance_as_on_date: parseFloat(progressFormData.balance_as_on_date) || 0,
        surrendered_amount: parseFloat(progressFormData.surrendered_amount) || 0,
        work_start_date: progressFormData.work_start_date,
        physical_target: progressFormData.physical_target,
        unit: progressFormData.unit,
        latitude: parseFloat(progressFormData.latitude) || 0,
        longitude: parseFloat(progressFormData.longitude) || 0,
      };

      await axios.post(`${API_BASE_URL}/work-details/`, payload, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      alert("Financial and Physical details recorded successfully!");
      fetchExistingDetails(selectedWork.work_id);
    } catch (err) {
      console.error("Error saving work details:", err);
      alert("Failed to save project details. Please check the inputs.");
    } finally {
      setSubmittingDetails(false);
    }
  };

  const handleImageUpload = async (phaseNum) => {
    const imgFile = progressFormData[`phase_${phaseNum}_img`];
    if (!imgFile) {
      alert(`Please select an image for Phase ${phaseNum} first.`);
      return;
    }

    setUploadingPhase(phaseNum);
    try {
      const formData = new FormData();
      formData.append('work_id', selectedWork.work_id); // Sending the string identifier from the table (e.g. WORK-001)
      formData.append('phase_number', phaseNum);
      formData.append('image', imgFile);

      await axios.post(`${API_BASE_URL}/work-images/`, formData, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert(`Phase ${phaseNum} image uploaded successfully!`);
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Image upload failed.");
    } finally {
      setUploadingPhase(null);
      fetchExistingImages(selectedWork.work_id);
    }
  };

  const handleImageDelete = async (phaseNum) => {
    if (window.confirm(`Are you sure you want to delete the image for Phase ${phaseNum}?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/work-images/`, {
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          data: {
            work_id: selectedWork.work_id,
            phase_number: phaseNum
          }
        });
        alert("Image deleted successfully!");
        fetchExistingImages(selectedWork.work_id);
      } catch (err) {
        console.error("Error deleting image:", err);
        alert("Delete failed.");
      }
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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold m-0" style={{ color: '#1E293B', fontSize: '1rem' }}>
              Work Progress Documentation
            </h5>
          </div>

          {selectedWork ? (
            /* Detailed Progress Update Form */
            <Card className="shadow-sm border-0 animate-fade-in" style={{ borderRadius: '12px' }}>
              <Card.Header className="bg-white border-bottom py-2 d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold mb-0" style={{ color: '#1e293b', fontSize: '0.85rem' }}>
                    <i className="bi bi-file-earmark-diff-fill me-2"></i>
                    Work Progress Update Form
                  </h6>
                  <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Pauri District Portal — Admin || Department View</small>
                </div>
                <Button variant="outline-secondary" size="sm" className="rounded-pill px-3" onClick={handleBackToTable}>
                  <i className="bi bi-arrow-left me-1"></i> Back to Registry
                </Button>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="alert bg-primary-subtle border-0 mb-3 py-2 px-3 text-primary d-flex align-items-center" style={{ borderRadius: '8px', fontSize: '0.8rem' }}>
                  <i className="bi bi-info-circle-fill me-2" style={{ fontSize: '1.1rem' }}></i>
                  <div>
                    <strong>Updating Project:</strong> {selectedWork.project_name} 
                    <span className="badge bg-primary ms-2" style={{ fontSize: '0.65rem' }}>{selectedWork.work_id}</span>
                  </div>
                </div>

                <Form onSubmit={handleProgressSubmit}>
                  {/* Section 1: Financial Details */}
                  <div className="mb-4">
                    <h6 className="fw-semibold text-uppercase d-flex align-items-center justify-content-center mb-3" style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '0.5px' }}>
                      <span className="bg-primary rounded-circle me-2" style={{ width: '8px', height: '8px', display: 'inline-block' }}></span>
                      Financial Details (वित्तीय विवरण)
                    </h6>
                    <Row className="g-3 mb-3">
                      <Col md={12}>
                        <Form.Group className="mb-0">
                          <Form.Label className="text-start d-block mb-1" style={{ fontSize: '0.7rem', fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase' }}>Work Identifier (कार्य पहचान)</Form.Label>
                          <Form.Control type="text" size="sm" value={selectedWork.work_id} readOnly className="bg-light border-slate-200 fw-bold shadow-none" style={{ color: '#4F46E5' }} />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="g-2">
                      <Col md={3}>
                        <Form.Group className="h-100">
                          <Form.Label className="text-start d-block mb-1 text-truncate" style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569' }}>Sanctioned Date (स्वीकृत तिथि)</Form.Label>
                          <Form.Control type="date" size="sm" name="sanction_date" value={progressFormData.sanction_date} onChange={handleInputChange} className="border-slate-200 shadow-none" readOnly={detailsExist} style={{ backgroundColor: detailsExist ? '#f1f5f9' : 'white' }} />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="h-100">
                          <Form.Label className="text-start d-block mb-1 text-truncate" style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569' }}>Est. Cost (अनुमानित लागत) [Lakhs]</Form.Label>
                          <Form.Control type="number" step="0.01" size="sm" placeholder="0.00" name="estimated_cost" value={progressFormData.estimated_cost} onChange={handleInputChange} className="border-slate-200 shadow-none" readOnly={detailsExist} style={{ backgroundColor: detailsExist ? '#f1f5f9' : 'white' }} />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="h-100">
                          <Form.Label className="text-start d-block mb-1 text-truncate" style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569' }}>Approved Outlay (अनुमोदित परिव्यय)</Form.Label>
                          <Form.Control type="number" step="0.01" size="sm" placeholder="0.00" name="approved_outlay" value={progressFormData.approved_outlay} onChange={handleInputChange} className="border-slate-200 shadow-none" readOnly={detailsExist} style={{ backgroundColor: detailsExist ? '#f1f5f9' : 'white' }} />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="h-100">
                          <Form.Label className="text-start d-block mb-1 text-truncate" style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569' }}>DM Funds (निवर्तन से प्राप्त)</Form.Label>
                          <Form.Control type="number" step="0.01" size="sm" placeholder="0.00" name="dm_level_funds" value={progressFormData.dm_level_funds} onChange={handleInputChange} className="border-slate-200 shadow-none" readOnly={detailsExist} style={{ backgroundColor: detailsExist ? '#f1f5f9' : 'white' }} />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="h-100">
                          <Form.Label className="text-start d-block mb-1 text-truncate" style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569' }}>Released Fund (अवमुक्त धनराशि)</Form.Label>
                          <Form.Control type="number" step="0.01" size="sm" placeholder="0.00" name="released_amount" value={progressFormData.released_amount} onChange={handleInputChange} className="border-slate-200 shadow-none" readOnly={detailsExist} style={{ backgroundColor: detailsExist ? '#f1f5f9' : 'white' }} />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="h-100">
                          <Form.Label className="text-start d-block mb-1 text-truncate" style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569' }}>Previous Balance (01.04.25 को अवशेष)</Form.Label>
                          <Form.Control type="number" step="0.01" size="sm" placeholder="0.00" name="balance_as_on_date" value={progressFormData.balance_as_on_date} onChange={handleInputChange} className="border-slate-200 shadow-none" readOnly={detailsExist} style={{ backgroundColor: detailsExist ? '#f1f5f9' : 'white' }} />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="h-100">
                          <Form.Label className="text-start d-block mb-1 text-truncate" style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569' }}>Surrender Balance (समर्पित धनराशि)</Form.Label>
                          <Form.Control type="number" step="0.01" size="sm" placeholder="0.00" name="surrendered_amount" value={progressFormData.surrendered_amount} onChange={handleInputChange} className="border-slate-200 shadow-none" readOnly={detailsExist} style={{ backgroundColor: detailsExist ? '#f1f5f9' : 'white' }} />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Section 2: Physical Details */}
                  <div className="mb-4">
                    <h6 className="fw-semibold text-uppercase d-flex align-items-center justify-content-center mb-3" style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '0.5px' }}>
                      <span className="bg-success rounded-circle me-2" style={{ width: '8px', height: '8px', display: 'inline-block' }}></span>
                      Physical Details (भौतिक विवरण)
                    </h6>
                    <Row className="g-2">
                      <Col md={3}>
                        <Form.Group className="h-100">
                          <Form.Label className="text-start d-block mb-1 text-truncate" style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569' }}>Start Date (कार्य प्रारंभ तिथि)</Form.Label>
                          <Form.Control type="date" size="sm" name="work_start_date" value={progressFormData.work_start_date} onChange={handleInputChange} className="border-slate-200 shadow-none" readOnly={detailsExist} style={{ backgroundColor: detailsExist ? '#f1f5f9' : 'white' }} />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="h-100">
                          <Form.Label className="text-start d-block mb-1 text-truncate" style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569' }}>Physical Target (भौतिक लक्ष्य)</Form.Label>
                          <Form.Control type="text" size="sm" placeholder="Enter target..." name="physical_target" value={progressFormData.physical_target} onChange={handleInputChange} className="border-slate-200 shadow-none" readOnly={detailsExist} style={{ backgroundColor: detailsExist ? '#f1f5f9' : 'white' }} />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group className="h-100">
                          <Form.Label className="text-start d-block mb-1 text-truncate" style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569' }}>Unit (इकाई)</Form.Label>
                          <Form.Select size="sm" name="unit" value={progressFormData.unit} onChange={handleInputChange} className="border-slate-200 shadow-none" disabled={detailsExist} style={{ backgroundColor: detailsExist ? '#f1f5f9' : 'white' }}>
                            <option value="">Select</option>
                            <option value="Job">Job</option>
                            <option value="KM">KM</option>
                            <option value="Meter">Meter</option>
                            <option value="Number">Number</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group className="h-100">
                          <Form.Label className="text-start d-block mb-1 text-truncate" style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569' }}>Latitude</Form.Label>
                          <Form.Control type="text" size="sm" placeholder="29.xxxx" name="latitude" value={progressFormData.latitude} onChange={handleInputChange} className="border-slate-200 shadow-none" readOnly={detailsExist} style={{ backgroundColor: detailsExist ? '#f1f5f9' : 'white' }} />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group className="h-100">
                          <Form.Label className="text-start d-block mb-1 text-truncate" style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569' }}>Longitude</Form.Label>
                          <Form.Control type="text" size="sm" placeholder="78.xxxx" name="longitude" value={progressFormData.longitude} onChange={handleInputChange} className="border-slate-200 shadow-none" readOnly={detailsExist} style={{ backgroundColor: detailsExist ? '#f1f5f9' : 'white' }} />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                  
                  <div className="text-end mb-5">
                    <Button variant="primary" type="submit" className="rounded-pill px-4 fw-bold shadow-sm" disabled={submittingDetails || detailsExist}>
                      {submittingDetails ? <Spinner animation="border" size="sm" /> : <><i className="bi bi-check2-circle me-2"></i> Save Financial & Physical Details</>}
                    </Button>
                    {detailsExist && (
                      <div className="mt-2 text-danger small fw-bold text-start">
                        <i className="bi bi-info-circle-fill me-1"></i>
                        Details already recorded. For any updates, please contact IT Cell.
                      </div>
                    )}
                  </div>
                </Form>

                {/* Section 3: Phase Images - Separate Upload Logic */}
                <div className="mt-4 pt-4 border-top">
                  <div className="mb-4">
                    <h6 className="fw-semibold text-uppercase d-flex align-items-center justify-content-center mb-3" style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '0.5px' }}>
                      <span className="bg-info rounded-circle me-2" style={{ width: '8px', height: '8px', display: 'inline-block' }}></span>
                      Progress Images (प्रगति चित्र)
                    </h6>
                    <Row className="g-3">
                      {[1, 2, 3, 4].map((phaseNum) => {
                        const existingImg = fetchedImages[phaseNum];
                        return (
                          <Col md={3} key={phaseNum}>
                            <Card className="h-100 border-0 shadow-none bg-light" style={{ borderRadius: '8px' }}>
                              <Card.Body className="p-3 text-center">
                                <Form.Label className="x-small fw-bold mb-2 d-block text-center" style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                  Phase {phaseNum} ({phaseNum === 1 ? '0-25%' : phaseNum === 2 ? '26-50%' : phaseNum === 3 ? '51-75%' : '76-100%'})
                                </Form.Label>
                                
                                {existingImg ? (
                                  <div className="d-flex flex-column gap-2">
                                    <div className="bg-white p-2 rounded mb-2 border border-slate-200" style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <span className="text-success small fw-semibold"><i className="bi bi-check-circle-fill me-1"></i> Uploaded</span>
                                    </div>
                                    <Button 
                                      variant="outline-primary" 
                                      size="sm" 
                                      className="rounded-pill w-100 fw-bold shadow-sm"
                                      onClick={() => window.open(existingImg.image_url, '_blank')}
                                      style={{ fontSize: '0.7rem' }}
                                    >
                                      <i className="bi bi-eye me-1"></i> View Image
                                    </Button>
                                    <Button 
                                      variant="outline-danger" 
                                      size="sm" 
                                      className="rounded-pill w-100 fw-bold shadow-sm"
                                      onClick={() => handleImageDelete(phaseNum)}
                                      style={{ fontSize: '0.7rem' }}
                                    >
                                      <i className="bi bi-trash me-1"></i> Delete
                                    </Button>
                                  </div>
                                ) : (
                                  <>
                                    <Form.Control 
                                      type="file" 
                                      size="sm" 
                                      accept="image/*" 
                                      name={`phase_${phaseNum}_img`} 
                                      onChange={handleFileChange} 
                                      className="mb-2 border-0 bg-white"
                                      style={{ fontSize: '0.65rem' }}
                                    />
                                    <Button 
                                      variant="info" 
                                      size="sm" 
                                      className="rounded-pill w-100 fw-bold text-white shadow-sm"
                                      onClick={() => handleImageUpload(phaseNum)}
                                      disabled={uploadingPhase === phaseNum}
                                      style={{ fontSize: '0.7rem' }}
                                    >
                                      {uploadingPhase === phaseNum ? (
                                        <Spinner animation="border" size="sm" />
                                      ) : (
                                        <><i className="bi bi-upload me-1"></i> Upload Phase {phaseNum}</>
                                      )}
                                    </Button>
                                  </>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-top">
                  <div className="text-center text-muted mb-3 x-small">
                    <i className="bi bi-info-circle me-1"></i> Note: Please save project details before uploading images.
                  </div>
                  <div className="text-end">
                    <Button variant="outline-secondary" size="sm" className="rounded-pill px-4 me-2" onClick={handleBackToTable}>
                      Cancel
                    </Button>
                    <Button variant="dark" size="sm" className="rounded-pill px-5 fw-bold shadow-sm" onClick={handleBackToTable}>
                      <i className="bi bi-journal-check me-2"></i> Finish Documentation
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ) : (
            /* Registry Table */
            <Card className="shadow-sm" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
              <Card.Body className="p-0">
              <h6 className="fw-bold px-3 py-3 m-0 d-flex align-items-center" style={{ color: '#1E293B', fontSize: '0.85rem' }}>
                <i className="bi bi-journal-plus me-2 text-primary"></i> ALL WORK ENTRIES FOR PROGRESS UPDATES
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
                        <th className="py-3">Vidhan Sabha</th>
                        <th className="py-3">Village</th>
                        <th className="py-3">Project Name</th>
                        <th className="py-3">Scheme</th>
                        <th className="text-center py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: '0.85rem', color: '#334155' }}>
                      {works.map((work) => (
                        <tr key={work.id}>
                          <td className="px-4"><span className="badge bg-slate-100 text-slate-700 border fw-medium" style={{ backgroundColor: '#F1F5F9', color: '#475569' }}>{work.work_id}</span></td>
                          <td className="text-truncate" style={{ maxWidth: '100px' }}>{work.division_name_en}</td>
                          <td>{work.vidhan_sabha}</td>
                          <td>{work.village_name}</td>
                          <td className="text-truncate" style={{ maxWidth: '150px' }}>{work.project_name}</td>
                          <td><span className="fw-medium" style={{ color: '#4F46E5' }}>{work.scheme_type}</span></td>
                          <td className="text-center">
                            <Button variant="outline-primary" size="sm" className="rounded-pill px-3 fw-bold me-2" onClick={() => handleAddDetailsClick(work)}>
                              <i className="bi bi-plus-lg me-1"></i> Add Details
                            </Button>
                            <Button variant="outline-danger" size="sm" className="rounded-pill px-3 fw-bold" onClick={() => handleDelete(work.id)}>
                              <i className="bi bi-trash me-1"></i> Delete
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
                    <p className="text-muted small">Please add works first to document progress details.</p>
                  </div>
                )
              )}
            </Card.Body>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddWorkDetails;