import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../assets/css/about.css';

export const AboutSection = ({ isPreview = false }) => {
  const bulletPoints = [
    "Direct access to essential government services and schemes.",
    "Transparent administrative processes for public accountability.",
    "Citizen-centric feedback loops for improved governance.",
    "Real-time updates on district development initiatives."
  ];

  return (
    <Row className="align-items-center gy-4">
      <Col lg={5} className="animate__animated animate__fadeInLeft">
        <div className="about-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80" 
            alt="Lush Landscape of Udham Singh Nagar" 
            className="img-fluid about-hero-img rounded shadow-sm"
          />
        </div>
      </Col>
      <Col lg={7} className="ps-lg-5 animate__animated animate__fadeInRight">
        <div className="about-content-wrapper">
          <h2 className="about-main-heading fw-bold text-navy">
            <span className="text-cyan">ABOUT US —</span> Empowering Transparency and Access
          </h2>
          <div className="about-para-group">
            <p>
              We are committed to fostering a transparent and accessible relationship between the district administration and our citizens. Our portal serves as a digital bridge, ensuring every resident can engage with local governance effectively.
            </p>
            <ul className="list-unstyled mt-4">
              {bulletPoints.map((point, index) => (
                <li key={index} className="mb-3 d-flex align-items-center">
                  <span className="me-3 text-cyan" style={{ fontSize: '1.2rem' }}>✔</span>
                  <span className="text-muted">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          {isPreview && (
            <Link to="/about" className="btn btn-about-more mt-2">Read More →</Link>
          )}
        </div>
      </Col>
    </Row>
  );
};

const About = () => {
  const departments = [
    "कृषि विभाग",
    "उद्यान विभाग",
    "पशु पालन विभाग",
    "शिक्षा विभाग",
    "स्वास्थ्य विभाग",
    "राजस्व विभाग",
    "समाज कल्याण विभाग",
    "सिंचाई विभाग",
    "लोक निर्माण विभाग",
    "विकास विभाग"
  ];

  return (
    <div className="about-page-container">
      <section className="about-breadcrumb-area">
        <Container>
          <div className="breadcrumb-nav">
            <Link to="/" className="breadcrumb-home">Home</Link>
            <span className="breadcrumb-divider">/</span>
            <span className="breadcrumb-active">About District</span>
          </div>
        </Container>
      </section>

      <section className="about-full-section py-5">
        <Container>
          <AboutSection isPreview={false} />
        </Container>
      </section>

      <section className="departments-section py-5 bg-white border-top">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title-large mb-1 text-navy">OUR DEPARTMENTS</h2>
            <h5 className="mb-3 text-cyan" style={{ letterSpacing: '1px' }}>District Departments Overview</h5>
            <p className="text-muted mx-auto" style={{ maxWidth: '800px' }}>
              Access vital information and digital services provided by the various local government departments dedicated to the welfare and growth of Udham Singh Nagar.
            </p>
          </div>
          <Row className="g-4">
            {departments.map((dept, index) => (
              <Col key={index} xs={12} sm={6} md={4} lg={3}>
                <div className="dept-card p-4 text-center shadow-sm h-100 d-flex align-items-center justify-content-center">
                  <h5 className="hindi-typography mb-0 text-navy">{dept}</h5>
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