import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../apiConfig";
import "../../assets/css/about.css";

// About Section Component
export const AboutSection = ({ isPreview = false }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/about-us-items/`);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || res.data?.results || [];

        setItems(data);
      } catch (error) {
        console.error("Error fetching About Us items:", error);
        setItems([]);
      }
    };

    fetchItems();
  }, []);

  // Correct API image path
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    return imagePath.replace(
      "https://mahadevaaya.com/media/",
      "https://mahadevaaya.com/pauripargati/pauripargati_backend/media/",
    );
  };

  return (
    <Row className="align-items-center gy-4">
      {/* About Image */}
      <Col lg={5} className="animate__animated animate__fadeInLeft">
        <div className="about-image-wrapper">
          {items.length > 0 && items[0].img && (
            <img
              src={getImageUrl(items[0].img)}
              alt={items[0].title || "About District"}
              className="img-fluid about-hero-img rounded shadow-sm"
            />
          )}
        </div>
      </Col>

      {/* About Content */}
      <Col lg={7} className="ps-lg-5 animate__animated animate__fadeInRight">
        <div className="about-content-wrapper">
          {items.map((item) => (
            <div key={item.id} className="mb-4">
              <h2 className="about-main-heading fw-bold text-navy">
                <span className="text-cyan d-block">{item.title}</span>

                <span className="d-block">{item.description}</span>
              </h2>

              {/* Modules */}
              {Array.isArray(item.module) && item.module.length > 0 && (
                <ul className="list-unstyled mt-3">
                  {item.module.map((m, index) => (
                    <li key={index} className="mb-2 d-flex align-items-center">
                      <span
                        className="me-3 text-cyan"
                        style={{ fontSize: "1.2rem" }}
                      >
                        ✔
                      </span>

                      <span className="text-muted">{m}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Read More Button */}
          {isPreview && (
            <Link to="/about" className="btn btn-about-more mt-2">
              Read More →
            </Link>
          )}
        </div>
      </Col>
    </Row>
  );
};

// Main About Page Component
const About = () => {
  const [departments, setDepartments] = useState([]);

  // Fetch Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/departments/`);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || res.data?.results || [];

        setDepartments(data);
      } catch (error) {
        console.error("Error fetching Departments:", error);
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="about-page-container">
      {/* Breadcrumb Section */}
      <section className="about-breadcrumb-area">
        <Container>
          <div className="breadcrumb-nav">
            <Link to="/" className="breadcrumb-home">
              Home
            </Link>

            <span className="breadcrumb-divider">/</span>

            <span className="breadcrumb-active">About District</span>
          </div>
        </Container>
      </section>

      {/* About Us Section */}
      <section className="about-full-section py-5">
        <Container>
          <AboutSection isPreview={false} />
        </Container>
      </section>

      {/* Departments Section */}
      <section className="departments-section py-5 bg-white border-top">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title-large mb-1 text-navy">
              OUR DEPARTMENTS
            </h2>

            <h5 className="mb-3 text-cyan" style={{ letterSpacing: "1px" }}>
              District Departments Overview
            </h5>

            <p className="text-muted mx-auto" style={{ maxWidth: "800px" }}>
              Access vital information and digital services provided by the
              various local government departments dedicated to the welfare and
              growth of Pauri.
            </p>
          </div>

          {/* Department Cards */}
          <Row className="g-4">
            {departments.map((dept, index) => (
              <Col key={dept.id || index} xs={12} sm={6} md={4} lg={3}>
                <div className="dept-card p-4 text-center shadow-sm h-100 d-flex align-items-center justify-content-center">
                  <h5 className="hindi-typography mb-0 text-navy">
                    {dept.dept_name}
                  </h5>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About;
