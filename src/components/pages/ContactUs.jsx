import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../apiConfig";
import "./ContactUs.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, phone: digits });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }
    if (/[A-Z]/.test(formData.email)) {
      alert("Email must be in lowercase letters only.");
      return;
    }
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/contact-enquiries/`, {
        full_name: formData.name,
        email: formData.email,
        subject: formData.subject,
        phone: formData.phone,
        message: formData.message,
      });
      alert("Thank you! Your message has been received.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      // silently fail
    }
  };

  return (
    <section className="contact-section">
      {/* Dark + teal overlay sits on top of the background image */}
      <div className="contact-overlay" />

      <div className="contact-container">
        {/* ---------- Top title ---------- */}
        <div className="contact-header">
          <span className="header-line" />
          <span className="header-deco">==</span>
          <h1 className="contact-title">CONTACT US</h1>
          <span className="header-deco">==</span>
          <span className="header-line" />
        </div>

        {/* ---------- 2-column body (single row) ---------- */}
        <div className="contact-grid">
          {/* ===== LEFT — Get in Touch + form ===== */}
          <div className="contact-left">
            <h2 className="section-heading">Get in Touch</h2>
            <p className="section-desc">
              Find all the necessary contact information for government offices
              in Pauri Garhwal, including phone numbers, email addresses, and
              office locations. Reach out easily for any queries, support, or
              assistance.
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  pattern="[0-9]{10}"
                />
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <textarea
                name="message"
                placeholder="Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              />
              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>

          {/* ===== RIGHT — Address + Mobile cards ===== */}
          <div className="contact-middle">
            <div className="info-card">
              <div className="info-icon-circle">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
                </svg>
              </div>
              <h3 className="info-heading">Addresses</h3>
              <p className="info-text">
                Vikas Bhawan, Pauri Garhwal, Uttarakhand
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon-circle">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <h3 className="info-heading">Mobile</h3>
              <p className="info-text">+91-9758012842</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
