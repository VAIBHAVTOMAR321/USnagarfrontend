import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../../assets/css/login.css';
import ukLogo from '../../assets/images/uk_logo.png';
import { API_BASE_URL } from '../../apiConfig';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const loginApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

const ROLE_DASHBOARD_MAP = {
  admin: '/AdminDashboard',
  // it_cell: '/ITCellDashboard',
  // department: '/DepartmentDashboard',
  // supervisor: '/SupervisorDashBoard',
  // dpo: '/DPODashBoard',
  // cdpo: '/CDPODashBoard',
  // director: '/DirectorDashboard',
  // anganwadi: '/AnganwadiDashBoard',
};

const Login = () => {
  const [role, setRole] = useState('admin');
  const [username, setUsername] = useState('admin');
  const passwordRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [captchaKey, setCaptchaKey] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await loginApi.get('/departments/');
        setDepartments(response.data);
       } catch (err) {
       }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchCaptcha = async () => {
      try {
        const response = await loginApi.get('/generate-captcha/');
        if (response.data.success) {
          setCaptchaKey(response.data.captcha_key);
          setCaptchaImage(
            response.data.captcha_image.startsWith('http')
              ? response.data.captcha_image
              : `https://mahadevaaya.com${response.data.captcha_image}`,
          );
        }
       } catch (err) {
       }
    };
    fetchCaptcha();
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
        password: passwordRef.current?.value || '',
        role: role,
        captcha_key: captchaKey,
        captcha_answer: captchaAnswer,
      };

      const response = await loginApi.post('/login/', payload);

      if (response.data.message === "Login successful") {
        login({
          role: response.data.role,
          unique_id: response.data.unique_id,
          username: response.data.username,
          user: null,
        });
        sessionStorage.setItem(
          "auth_user",
          JSON.stringify({
            username: response.data.username,
            role: response.data.role,
            unique_id: response.data.unique_id,
          }),
        );
        alert("Login Success!");

        const targetPath = ROLE_DASHBOARD_MAP[response.data.role] || '/';
        navigate(targetPath);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login Failed. Please check your credentials and captcha.",
      );
      try {
        const response = await loginApi.get('/generate-captcha/');
        if (response.data.success) {
          setCaptchaKey(response.data.captcha_key);
          setCaptchaImage(
            response.data.captcha_image.startsWith('http')
              ? response.data.captcha_image
              : `https://mahadevaaya.com${response.data.captcha_image}`,
          );
          setCaptchaAnswer('');
        }
       } catch (captchaErr) {
       }
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
                    placeholder="Enter Password"
                   
                    ref={passwordRef}
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

              {captchaKey && captchaImage && (
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">
                    Captcha
                  </label>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={captchaImage}
                      alt="Captcha"
                      className="captcha-img"
                      style={{ maxHeight: '45px', border: '1px solid #ddd' }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={async () => {
                        try {
                          const response = await loginApi.get('/generate-captcha/');
                          if (response.data.success) {
                            setCaptchaKey(response.data.captcha_key);
                            setCaptchaImage(
                              response.data.captcha_image.startsWith('http')
                                ? response.data.captcha_image
                                : `https://mahadevaaya.com${response.data.captcha_image}`,
                            );
                            setCaptchaAnswer('');
                          }
                         } catch (err) {
                         }
                      }}
                    >
                      Refresh
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control form-control-sm bg-light border-0 mt-2"
                    placeholder="Enter captcha answer"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                  />
                </div>
              )}

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
        © 2026 PauriDistrict Portal. Developed by ZEE
      </footer>
    </div>
  );
};

export default Login;