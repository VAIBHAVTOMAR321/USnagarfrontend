import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import "./Footer.css";

const Footer = () => {
  const location = useLocation();
  const hideFooterRoutes = [
    "/AdminDashboard",
    "/ITCellDashboard",
    "/DepartmentDashboard",
  ];
  if (hideFooterRoutes.includes(location.pathname)) return null;

  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* ---------- Brand / About ---------- */}
        <div className="footer-col footer-brand">
          <div className="brand-title">
            {/* 8-petal lotus / flower icon */}
            <svg
              className="brand-icon"
              viewBox="0 0 64 64"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M32 4c-3 6-3 12 0 18 3-6 3-12 0-18zm0 56c3-6 3-12 0-18-3 6-3 12 0 18zM4 32c6 3 12 3 18 0-6-3-12-3-18 0zm56 0c-6-3-12-3-18 0 6 3 12 3 18 0zM11 11c3 6 7 10 13 13-3-6-7-10-13-13zm42 42c-3-6-7-10-13-13 3 6 7 10 13 13zM53 11c-6 3-10 7-13 13 6-3 10-7 13-13zM11 53c6-3 10-7 13-13-6 3-10 7-13 13z" />
              <circle cx="32" cy="32" r="5" />
            </svg>
            <h3>Pauri Garhwal</h3>
          </div>
          <p>
            Welcome to the Pauri Government Portal, your one-stop destination
            for official information, services, and updates. Explore resources,
            programs, and announcements designed to empower our community.
          </p>
        </div>

        {/* ---------- Quick Links ---------- */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li>
              <a href="#about">
                <FiArrowRight className="arrow-icon" />
                About Us
              </a>
            </li>
            <li>
              <a href="#contact">
                <FiArrowRight className="arrow-icon" />
                Contact Us
              </a>
            </li>
            <li>
              <a href="#privacy">
                <FiArrowRight className="arrow-icon" />
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* ---------- Contact Info ---------- */}
        <div className="footer-col">
          <h4>Contact Info</h4>
          <ul className="footer-contact">
            <li>
              <svg
                className="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Vikas Bhawan, Pauri Garhwal, Uttarakhand, India</span>
            </li>
            <li>
              <svg
                className="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 5L2 7" />
              </svg>
              <a href="mailto:cdopauri@gmail.com">cdopauri@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      {/* ---------- Copyright bar ---------- */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>
            &copy; <a href="#">Pauri District Portal</a>, All right reserved.
          </p>
          <p>
          Designed By <a href="https://zeeindia.in/" target="_blank" rel="noopener noreferrer">Zero Error Enterprises</a>
          </p>
        </div>
      </div>

      {/* ---------- Back to top button ---------- */}
      <button
        className={`back-to-top ${showTop ? "show" : ""}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;