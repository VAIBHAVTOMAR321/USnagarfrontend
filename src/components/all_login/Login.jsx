import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../../assets/css/login.css';

const Login = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    role: '',
    email_or_phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Content in Hindi - Government Portal Style (consistent with Home.jsx)
  const content = {
    brandSubtitle: "आज का कौशल, कल का सशक्तिकरण",
    welcomeTitle: "वापसी पर आपका स्वागत है!",
    welcomeSubtitle: "अपनी सेवा यात्रा जारी रखें",
    roleLabel: "अपनी भूमिका चुनें",
    userIdLabel: "यूजर आईडी / फोन",
    userIdPlaceholder: "यूजर आईडी या फोन दर्ज करें",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "पासवर्ड दर्ज करें",
    rememberMe: "मुझे याद रखें",
    signIn: "साइन इन करें",
    signingIn: "साइन इन हो रहा है...",
    needAccess: "पहुंच की आवश्यकता है? ",
    contactAdmin: "प्रशासन से संपर्क करें",
    learnTitle: "सीखें",
    learnDesc: "गुणवत्तापूर्ण शिक्षा और नए पाठ्यक्रमों तक पहुंच प्राप्त करें",
    growTitle: "बढ़ें",
    growDesc: "अपनी शैक्षणिक प्रगति को ट्रैक करें",
    succeedTitle: "सफल हों",
    succeedDesc: "कक्षा 9 से 12 तक अपना करियर बनाएं",
    errors: {
      userIdRequired: "यूजर आईडी / फोन आवश्यक है",
      passwordRequired: "पासवर्ड आवश्यक है",
      loginFailed: "लॉगिन विफल रहा। कृपया पुनः प्रयास करें।",
      loginSuccess: "लॉगिन सफल!"
    }
  };

  const roleOptions = useMemo(() => {
    const allRoles = [
      { value: 'director', label: 'निदेशक', icon: 'bi-person-workspace' },
      { value: 'dpo', label: 'डीपीओ', icon: 'bi-briefcase' },
      { value: 'cdpo', label: 'सीडीपीओ', icon: 'bi-person-badge' },
      { value: 'supervisor', label: 'पर्यवेक्षक', icon: 'bi-person-check' },
      { value: 'anganbadi', label: 'आंगनवाड़ी', icon: 'bi-house-door' },
    ];

    if (searchParams.has('director')) return allRoles.filter(r => r.value === 'director');
    if (searchParams.has('district')) return allRoles.filter(r => ['dpo', 'cdpo'].includes(r.value));

    // Default view shows Supervisor and Anganbadi
    return allRoles.filter(r => ['supervisor', 'anganbadi'].includes(r.value));
  }, [searchParams]);

  const loginTitle = useMemo(() => {
    if (searchParams.has('director')) {
      return 'निदेशक लॉगिन';
    } else if (searchParams.has('district')) {
      return 'डीपीओ / सीडीपीओ लॉगिन';
    } else {
      return 'फील्ड स्टाफ लॉगिन'; // Default for Supervisor and Anganbadi
    }
  }, [searchParams]);

  useEffect(() => {
    if (roleOptions.length > 0 && !roleOptions.some(o => o.value === formData.role)) {
      setFormData(prev => ({ ...prev, role: roleOptions[0].value }));
    }
  }, [roleOptions, formData.role]); // Removed extra comma for cleaner code

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email_or_phone) {
      setError(content.errors.userIdRequired);
      return;
    }
    if (!formData.password) {
      setError(content.errors.passwordRequired);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        role: formData.role,
        password: formData.password,
        email_or_phone: formData.email_or_phone,
      };

      const response = await axios.post(
        'https://brjobsedu.com/gyandhara/gyandhara_backend/api/login/',
        payload
      );

      if (response.data.access) {
        login({
          access: response.data.access,
          refresh: response.data.refresh,
          role: response.data.role,
          unique_id: response.data.unique_id,
          user: response.data.user || null,
        });
        alert(content.errors.loginSuccess);

        // Update navigation routes based on your dashboard implementation
        if (['director', 'dpo', 'cdpo'].includes(response.data.role)) {
          navigate('/DashBord');
        } else {
          navigate('/UserDashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || content.errors.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-pattern"></div>
      <div className="login-container">
        <div className="login-content">
          <div className="login-header">
            <div className="brand-logo">
              <i className="bi bi-mortarboard-fill"></i>
            </div>
            <h1>{loginTitle}</h1>
            <p>{content.brandSubtitle}</p>
          </div>

          <div className="welcome-section">
            <h2>{content.welcomeTitle}</h2>
            <p>{content.welcomeSubtitle}</p>
          </div>

          {roleOptions.length > 1 && (
            <div className="role-selector">
              <label>{content.roleLabel}</label>
              <div className="role-tabs">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`role-tab ${formData.role === option.value ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, role: option.value })}
                  >
                    <i className={option.icon}></i>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="alert-message error">
                <i className="bi bi-exclamation-circle"></i>
                {error}
              </div>
            )}

            <div className="form-group">
              <label>{content.userIdLabel}</label>
              <div className="input-wrapper-text">
                <i className="bi bi-person"></i>
                <input
                  type="text"
                  name="email_or_phone"
                  value={formData.email_or_phone}
                  onChange={handleChange}
                  placeholder={content.userIdPlaceholder}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <i className="bi bi-lock"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={content.passwordPlaceholder}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>{content.rememberMe}</span>
              </label>
              {/* <a href="/" className="forgot-link">Forgot password?</a> */}
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  {content.signingIn}
                </>
              ) : (
                content.signIn
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>{content.needAccess}<Link to="/contact">{content.contactAdmin}</Link></p>
          </div>
        </div>

        <div className="login-highlights">
          <div className="highlight-item">
            <i className="bi bi-book"></i>
              <h3>{content.learnTitle}</h3>
              <p>{content.learnDesc}</p>
          </div>
          <div className="highlight-item">
            <i className="bi bi-graph-up"></i>
              <h3>{content.growTitle}</h3>
              <p>{content.growDesc}</p>
          </div>
          <div className="highlight-item">
            <i className="bi bi-rocket-takeoff"></i>
              <h3>{content.succeedTitle}</h3>
              <p>{content.succeedDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;