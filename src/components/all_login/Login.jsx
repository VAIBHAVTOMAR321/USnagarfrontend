import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../../assets/css/login.css';
import ukLogo from '../../assets/images/uk_logo.png';
import { API_BASE_URL } from '../../apiConfig';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ROLE_DASHBOARD_MAP = {
  admin: '/AdminDashboard',
  it_cell: '/ITCellDashboard',
  department: '/DepartmentDashboard',
  supervisor: '/SupervisorDashBoard',
  dpo: '/DPODashBoard',
  cdpo: '/CDPODashBoard',
  director: '/DirectorDashboard',
  anganwadi: '/AnganwadiDashBoard',
};

const Login = () => {
  const [role, setRole] = useState('admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/departments/`);
        setDepartments(response.data);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      }
    };
    fetchDepartments();
  }, []);

  const navigate = useNavigate();
  const { login, isAuthenticated, role: authRole } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && authRole) {
      const targetPath = ROLE_DASHBOARD_MAP[authRole] || '/';
      navigate(targetPath, { replace: true });
    }
  }, [isAuthenticated, authRole, navigate]);

  const handleRoleChange = (r) => {
    setRole(r);
    if (r === 'admin') {
      setUsername('admin');
    } else if (r === 'it_cell') {
      setUsername('itcell');
    } else {
      setUsername('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        username: username,
        password: password,
      };

      const response = await axios.post(
        `${API_BASE_URL}/login/`,
        payload
      );

      if (response.data.access) {
        login({
          access: response.data.access,
          refresh: response.data.refresh,
          role: response.data.role,
          unique_id: response.data.unique_id,
          department_id: response.data.department_id,
          user: response.data.user || null,
        });
        alert("Login Success!");

        // Determine path from response role
        const targetPath = ROLE_DASHBOARD_MAP[response.data.role] || '/';
        navigate(targetPath);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-split-card">
        
        {/* Left Panel: Official Branding */}
        <div className="panel-left">
          <div className="branding-container">
            <img src={ukLogo} alt="Uttarakhand Logo" className="gov-logo-login" />
            <h2 className="hindi-brand-text">उत्तराखण्ड शासन</h2>
          </div>
        </div>

        {/* Right Panel: Login Interface */}
        <div className="panel-right">
          
          <div className="role-selector-section mb-4">
            <p className="role-selector-title small mb-2 fw-bold text-uppercase tracking-wider">Select Role</p>
            <div className="role-radio-group">
              {['admin', 'it_cell', 'department'].map((r) => (
                <label key={r} className={`role-label-custom ${role === r ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="role" 
                    value={r} 
                    checked={role === r} 
                    onChange={(e) => handleRoleChange(e.target.value)} 
                  />
                  {r.replace('_', ' ').toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          <div className="inner-form-card shadow-sm">
            <h3 className="form-card-title">{role.replace('_', ' ').toUpperCase()} LOGIN</h3>
            
            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger p-2 x-small border-0 mb-3">{error}</div>}
              
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">User ID</label>
                {role === 'department' ? (
                  <select 
                    className="form-select form-select-sm bg-light border-0"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name_en}>
                        {dept.name_en} ({dept.name_hi})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type="text" 
                    className="form-control form-control-sm bg-light border-0" 
                    value={username} 
                    readOnly
                  />
                )}
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Password</label>
                <div className="position-relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-control form-control-sm bg-light border-0 pe-5" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="text-center">
                <button 
                  type="submit" 
                  className="btn w-100 rounded-pill py-2 fw-bold login-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="login-footer-text">
        © 2026 US Nagar District Portal. Developed by ZEE
      </footer>
    </div>
  );
};

export default Login;