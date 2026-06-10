import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Spinner, Badge, Button } from 'react-bootstrap';
import { API_BASE_URL } from '../../apiConfig';
import { useAuth } from '../all_login/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminLeftNav from './AdminLeftNav';

const AdminDepartmentAnalytics = () => {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [works, setWorks] = useState([]);
  const [workDetails, setWorkDetails] = useState([]);
  const [workImages, setWorkImages] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const config = { headers: { Authorization: `Bearer ${accessToken}` } };
      
      // Function to fetch data safely; returns empty array if request fails (e.g. 404)
      const safeFetch = async (url) => {
        try {
          const res = await axios.get(url, config);
          return res.data;
        } catch (err) {
          console.error(`Fetch Error for ${url}:`, err.response?.status === 404 ? "Endpoint not found (404)" : err.message);
          return [];
        }
      };

      try {
        const departmentsData = await safeFetch(`${API_BASE_URL}/departments/`);
        const divisionsData = await safeFetch(`${API_BASE_URL}/divisions/`);
        const worksData = await safeFetch(`${API_BASE_URL}/works/`);
        const imagesData = await safeFetch(`${API_BASE_URL}/work-images/`);

        // Fetch work-details for each work using work_id filter
        // (backend doesn't support fetching all details without filter)
        let allDetails = [];
        if (worksData && worksData.length > 0) {
          const detailsPromises = worksData.map(work =>
            safeFetch(`${API_BASE_URL}/work-details/?work_id=${work.work_id}`)
          );
          const detailsArrays = await Promise.all(detailsPromises);
          allDetails = detailsArrays.flat();
        }

        setDepartments(departmentsData);
        setDivisions(divisionsData);
        setWorkDetails(allDetails);
        setWorks(worksData);
        setWorkImages(imagesData);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accessToken]);

  const handleLogout = () => {
    if (window.confirm("Confirm logout?")) {
      logout();
      navigate('/Login');
    }
  };

  const getStats = (id, type = 'dept') => {
    const targetWorks = works.filter(work => 
      type === 'dept' ? String(work.department) === String(id) : String(work.division) === String(id)
    );
    const targetWorkIds = targetWorks.map(w => w.work_id);
    
    const relevantDetails = workDetails.filter(detail => 
      targetWorkIds.includes(detail.work_id)
    );

    // Get latest details for each work
    const latestDetailsMap = {};
    relevantDetails.forEach(d => {
      if (!latestDetailsMap[d.work_id] || d.id > latestDetailsMap[d.work_id].id) {
         latestDetailsMap[d.work_id] = d;
      }
    });
    const latestDetailsList = Object.values(latestDetailsMap);

    // Financial metrics
    const allotted = latestDetailsList.reduce((sum, d) => sum + parseFloat(d.approved_outlay || 0), 0);
    const expenditure = latestDetailsList.reduce((sum, d) => sum + parseFloat(d.released_amount || 0), 0);
    const balance = allotted - expenditure;

    // Physical progress calculation - based on target values and documentation phases
    let sumTarget = 0;
    let sumAchieved = 0;

    targetWorks.forEach(work => {
      const workDetail = latestDetailsMap[work.work_id];
      if (workDetail) {
        const targetValue = parseFloat(workDetail.physical_target) || 0;
        
        // Calculate progress percentage based on images (4 phases)
        const workImagesList = (workImages || []).filter(img => img.work_id === work.work_id);
        const uniquePhasesCount = new Set(workImagesList.map(img => img.phase_number)).size;
        const progressFactor = (Math.min(uniquePhasesCount, 4) / 4); // 0.0, 0.25, 0.5, 0.75, 1.0
        
        const achievedValue = targetValue * progressFactor;
        
        sumTarget += targetValue;
        sumAchieved += achievedValue;
      }
    });

    const averageProgress = sumTarget > 0 ? Math.round((sumAchieved / sumTarget) * 100) : 0;

    return { 
      allotted, 
      expenditure, 
      balance,
      target: sumTarget,
      achieved: sumAchieved,
      progress: Math.min(averageProgress, 100),
      workCount: targetWorks.length,
      financialHealth: expenditure > 0 ? Math.round((expenditure / allotted) * 100) : 0
    };
  };

  // Debug logger to check data synchronization
  useEffect(() => {
    if (!loading) {
      console.log(`[Analytics] Sync Check: Works=${works.length}, Details=${workDetails.length}, Images=${workImages.length}`);
    }
  }, [loading, works, workDetails, workImages]);

  const DualCategoryChart = ({ allotted, expenditure, target, achieved, progress }) => {
    // Scaling Financial: Normalize both bars to the highest value in the pair
    const maxFin = Math.max(allotted, expenditure, 1);
    const hAllotted = (allotted / maxFin) * 100;
    const hSpent = (expenditure / maxFin) * 100;

    // Scaling Physical: Target is always 100% height, Progress is calculated relative to Target
    const hTargetBar = 100;
    const hProgress = progress;

    return (
      <div className="w-100 p-2 rounded" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <div className="d-flex align-items-end justify-content-between position-relative" style={{ height: '160px', padding: '1.5rem 0.5rem 0.5rem 0.5rem' }}>
          
          {/* Financial Category Group */}
          <div className="d-flex align-items-end justify-content-center gap-2 h-100 position-relative" style={{ width: '48%' }}>
            {/* Allotted Bar (Blue) */}
            <div className="d-flex flex-column align-items-center h-100 justify-content-end" style={{ width: '24px' }}>
              <div className="fw-bold mb-1" style={{ fontSize: '0.6rem', color: '#1e293b' }}>{allotted.toFixed(0)}</div>
              <div 
                style={{ 
                  height: `${Math.max(hAllotted, 2)}%`, 
                  width: '100%', 
                  backgroundColor: '#3b82f6', 
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 1s ease-out'
                }} 
                title={`Allotted: ₹${allotted}L`}
              />
            </div>
            {/* Expenditure Bar (Pink) */}
            <div className="d-flex flex-column align-items-center h-100 justify-content-end" style={{ width: '24px' }}>
              <div className="fw-bold mb-1" style={{ fontSize: '0.6rem', color: '#1e293b' }}>{expenditure.toFixed(0)}</div>
              <div 
                style={{ 
                  height: `${Math.max(hSpent, 2)}%`, 
                  width: '100%', 
                  backgroundColor: '#ec4899', 
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 1s ease-out'
                }} 
                title={`Spent: ₹${expenditure}L`}
              />
            </div>
            <div className="position-absolute w-100 text-center text-muted fw-bold" style={{ bottom: '-18px', fontSize: '0.55rem', letterSpacing: '0.5px' }}>BUDGET (₹)</div>
          </div>

          {/* Divider */}
          <div className="h-100" style={{ width: '1px', borderLeft: '1px dashed #cbd5e1' }}></div>

          {/* Physical Category Group */}
          <div className="d-flex align-items-end justify-content-center gap-2 h-100 position-relative" style={{ width: '48%' }}>
            {/* Target Bar (Teal) */}
            <div className="d-flex flex-column align-items-center h-100 justify-content-end" style={{ width: '24px' }}>
              <div className="fw-bold mb-1" style={{ fontSize: '0.6rem', color: '#1e293b' }}>{target.toFixed(0)}</div>
              <div 
                style={{ 
                  height: `${hTargetBar}%`, 
                  width: '100%', 
                  backgroundColor: '#14b8a6', 
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 1s ease-out'
                }} 
                title="Target: 100%"
              />
            </div>
            {/* Progress Bar (Yellow) */}
            <div className="d-flex flex-column align-items-center h-100 justify-content-end" style={{ width: '24px' }}>
              <div className="fw-bold mb-1" style={{ fontSize: '0.6rem', color: '#1e293b' }}>{achieved.toFixed(0)}</div>
              <div 
                style={{ 
                  height: `${Math.max(hProgress, 2)}%`, 
                  width: '100%', 
                  backgroundColor: '#facc15', 
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 1s ease-out'
                }} 
                title={`Progress: ${progress}%`}
              />
            </div>
            <div className="position-absolute w-100 text-center text-muted fw-bold" style={{ bottom: '-18px', fontSize: '0.55rem', letterSpacing: '0.5px' }}>PHYSICAL (Units)</div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
      <Spinner animation="grow" variant="primary" />
    </div>
  );

  return (
    <div className="admin-dashboard-container d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <AdminLeftNav sidebarOpen={sidebarOpen} />
      <main className="flex-grow-1 d-flex flex-column bg-light" style={{ overflowY: 'auto' }}>
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} handleLogout={handleLogout} />

        <div className="content-body p-3 animate-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <h5 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>
                {selectedDept ? `📊 ${selectedDept.name_en}` : '📊 Department Performance'}
              </h5>
              <p className="text-muted small mb-0">Budget allocation & implementation progress</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Badge bg="white" className="border shadow-sm px-2 py-1 text-dark small" style={{ fontSize: '0.65rem' }}><span className="me-1" style={{ color: '#3b82f6' }}>■</span> Budget</Badge>
              <Badge bg="white" className="border shadow-sm px-2 py-1 text-dark small" style={{ fontSize: '0.65rem' }}><span className="me-1" style={{ color: '#f472b6' }}>■</span> Spent</Badge>
              <Badge bg="white" className="border shadow-sm px-2 py-1 text-dark small" style={{ fontSize: '0.65rem' }}><span className="me-1" style={{ color: '#0d9488' }}>■</span> Target</Badge>
              <Badge bg="white" className="border shadow-sm px-2 py-1 text-dark small" style={{ fontSize: '0.65rem' }}><span className="me-1" style={{ color: '#facc15' }}>■</span> Achieved</Badge>
            </div>
          </div>

          {selectedDept ? (
            /* Division Analytics View */
            <div className="animate-fade-in">
              <Button variant="outline-primary" size="sm" className="mb-3 rounded-pill px-3 shadow-sm bg-white" onClick={() => setSelectedDept(null)}>
                <i className="bi bi-arrow-left me-2"></i>Back
              </Button>
              <Row className="g-3">
                {divisions.filter(d => d.department === selectedDept.id).length > 0 ? (
                  divisions.filter(d => d.department === selectedDept.id).map(div => {
                    const stats = getStats(div.id, 'div');
                    return (
                      <Col key={div.id} lg={4} md={6} sm={12}>
                        <Card className="border-0 shadow-sm hover-lift" style={{ borderRadius: '10px', overflow: 'hidden', height: '360px', display: 'flex', flexDirection: 'column' }}>
                          <Card.Body className="p-2 d-flex flex-column" style={{ flex: 1 }}>
                            <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.85rem', minHeight: '24px', lineHeight: '1.2' }}>{div.name_en}</h6>
                            <DualCategoryChart allotted={stats.allotted} expenditure={stats.expenditure} target={stats.target} achieved={stats.achieved} progress={stats.progress} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid #f0f0f0' }}>
                              <div style={{ textAlign: 'center' }}>
                                <div className="fw-bold" style={{ fontSize: '0.8rem', color: '#1976d2' }}>₹{stats.allotted.toFixed(1)}L</div>
                                <div style={{ fontSize: '0.6rem', color: '#90a4ae', fontWeight: '500' }}>Budget</div>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <div className="fw-bold" style={{ fontSize: '0.8rem', color: '#00796b' }}>{stats.achieved.toFixed(1)}</div>
                                <div style={{ fontSize: '0.6rem', color: '#90a4ae', fontWeight: '500' }}>Achieved</div>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })
                ) : (
                  <Col md={12} className="text-center py-5 text-muted">No divisional data found</Col>
                )}
              </Row>
            </div>
          ) : (
            /* Aggregated Department Grid */
            <div>
              {/* Summary Row */}
              {departments.length > 0 && (
                <Row className="g-3 mb-4">
                  {(() => {
                    let totalAllotted = 0, totalExpenditure = 0, totalAchieved = 0;
                    departments.forEach(dept => {
                      const stats = getStats(dept.id, 'dept');
                      totalAllotted += stats.allotted;
                      totalExpenditure += stats.expenditure;
                      totalAchieved += stats.achieved;
                    });
                    return (
                      <>
                        <Col md={3} sm={6} xs={12}>
                          <div className="summary-card p-3 rounded shadow-sm bg-white">
                            <div className="text-muted small">Total Budget</div>
                            <div className="fw-bold text-primary" style={{ fontSize: '1.2rem' }}>₹{totalAllotted.toFixed(1)}L</div>
                          </div>
                        </Col>
                        <Col md={3} sm={6} xs={12}>
                          <div className="summary-card p-3 rounded shadow-sm bg-white">
                            <div className="text-muted small">Total Spent</div>
                            <div className="fw-bold text-danger" style={{ fontSize: '1.2rem' }}>₹{totalExpenditure.toFixed(1)}L</div>
                          </div>
                        </Col>
                        <Col md={3} sm={6} xs={12}>
                          <div className="summary-card p-3 rounded shadow-sm bg-white">
                            <div className="text-muted small">Achieved Units</div>
                            <div className="fw-bold text-success" style={{ fontSize: '1.2rem' }}>{totalAchieved.toFixed(1)}</div>
                          </div>
                        </Col>
                        <Col md={3} sm={6} xs={12}>
                          <div className="summary-card p-3 rounded shadow-sm bg-white">
                            <div className="text-muted small">Departments</div>
                            <div className="fw-bold text-info" style={{ fontSize: '1.2rem' }}>{departments.length}</div>
                          </div>
                        </Col>
                      </>
                    );
                  })()}
                </Row>
              )}

              {/* Department Cards */}
              <Row className="g-3">
                {departments.map((dept) => {
                  const stats = getStats(dept.id, 'dept');
                  return (
                    <Col key={dept.id} lg={3} md={4} sm={6} xs={12}>
                      <Card 
                        className="border-0 shadow-sm hover-lift cursor-pointer" 
                        style={{ borderRadius: '10px', overflow: 'hidden', height: '380px', display: 'flex', flexDirection: 'column' }}
                        onClick={() => setSelectedDept(dept)}
                      >
                        <Card.Body className="p-2 d-flex flex-column" style={{ flex: 1 }}>
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <div style={{ background: '#e3f2fd', padding: '4px 6px', borderRadius: '6px' }}>
                              <i className="bi bi-hospital text-primary" style={{ fontSize: '0.9rem' }}></i>
                            </div>
                            <Badge bg="primary" className="px-2 py-0" style={{ fontSize: '0.55rem', fontWeight: '600' }}>
                              {stats.workCount} Projects
                            </Badge>
                          </div>

                          <h6 className="fw-bold text-dark" style={{ fontSize: '0.85rem', minHeight: '24px', lineHeight: '1.2', marginBottom: '0.5rem' }}>{dept.name_en}</h6>
                          
                          <DualCategoryChart allotted={stats.allotted} expenditure={stats.expenditure} target={stats.target} achieved={stats.achieved} progress={stats.progress} />
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid #f0f0f0' }}>
                            <div style={{ textAlign: 'center' }}>
                              <div className="fw-bold" style={{ fontSize: '0.8rem', color: '#1976d2' }}>₹{stats.expenditure.toFixed(1)}L</div>
                              <div style={{ fontSize: '0.6rem', color: '#90a4ae', fontWeight: '500' }}>Spent</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div className="fw-bold" style={{ fontSize: '0.8rem', color: '#00796b' }}>{stats.achieved.toFixed(1)}</div>
                              <div style={{ fontSize: '0.6rem', color: '#90a4ae', fontWeight: '500' }}>Achieved</div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .hover-lift {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.12) !important;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .x-small {
          font-size: 0.65rem;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .summary-card {
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        .summary-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
        }
      `}</style>
    </div>
  );
};

export default AdminDepartmentAnalytics;