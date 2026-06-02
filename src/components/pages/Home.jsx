import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { AboutSection } from './About';
import '../../assets/css/home.css'

function Home() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const content = {
    districtName: "Udham Singh Nagar",
    heroTitle: "Welcome to Udham Singh Nagar",
    heroSubtitle: "The Food Bowl of Uttarakhand — A harmonious blend of industrial growth, agricultural excellence, and rich cultural heritage.",
    glanceTitle: "US Nagar at a Glance",
    glanceSubtitle: "A snapshot of our district's geography and demographics",
    stats: [
      { label: "Area", value: "2,542 Sq. Km.", icon: "bi-geo-alt", color: "blue" },
      { label: "Population", value: "16.48 Lakh", icon: "bi-people", color: "saffron" },
      { label: "Blocks", value: "07", icon: "bi-grid-3x3-gap", color: "green" },
      { label: "Tehsils", value: "08", icon: "bi-map", color: "orange" },
      { label: "Municipalities", value: "09", icon: "bi-building-check", color: "purple" },
      { label: "Villages", value: "672", icon: "bi-house-heart", color: "teal" }
    ],
    copyright: `© ${new Date().getFullYear()} District Administration, Udham Singh Nagar. All rights reserved.`
  };

  return (
    <div className="home-wrapper">
      {/* Navigation Top Bar */}
      <div className="gov-header-bar py-2">
        <Container fluid>
          <Row className="align-items-center">
            <Col xs={12} md={6}>
              <div className="d-flex align-items-center gap-2">
                <div className="gov-emblem-placeholder">
                  <i className="bi bi-geo-fill text-warning fs-5"></i>
                </div>
                <div>
                  <div className="x-small text-white-50 lh-1">भारत सरकार // Government of India</div>
                  <div className="fw-bold text-white small">District Administration, {content.districtName}</div>
                </div>
              </div>
            </Col>
            <Col xs={12} md={6} className="text-md-end mt-1 mt-md-0">
              <div className="d-flex justify-content-md-end gap-3 flex-wrap small">
                <Link to="/login" className="text-white text-decoration-none hover-opacity">Employee Login</Link>
                <span className="text-white-50">|</span>
                <Link to="/contact" className="text-white text-decoration-none hover-opacity">Contact Us</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Hero Section */}
      <header className="hero-section-district d-flex align-items-center bg-light overflow-hidden">
        <Container>
          <Row className="align-items-center gy-4">
            <Col lg={6} className="text-lg-start text-center animate__animated animate__fadeInLeft">
              <div className="pe-lg-4">
                <h1 className="fw-bold mb-3 hero-main-title">{content.heroTitle}</h1>
                <p className="mb-4 text-muted small lh-lg hero-desc">{content.heroSubtitle}</p>
                <div className="d-flex gap-2 justify-content-lg-start justify-content-center">
                  <button className="btn btn-sm btn-gov-primary px-4 py-2">Explore Services</button>
                  <button className="btn btn-sm btn-outline-dark px-4 py-2">Visit Kumaon</button>
                </div>
              </div>
            </Col>
            <Col lg={6} className="animate__animated animate__fadeInRight">
              <div className="hero-image-wrapper shadow-lg">
                <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80" alt="Scenic Udham Singh Nagar" className="img-fluid rounded-3" />
              </div>
            </Col>
          </Row>
        </Container>
      </header>

      {/* US Nagar At a Glance Dashboard */}
      <section className="glance-section py-5 bg-white">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title-gov fw-bold">{content.glanceTitle}</h2>
            <p className="text-muted">{content.glanceSubtitle}</p>
          </div>
          <Row className="g-4">
            {content.stats.map((stat, index) => (
              <Col key={index} xs={6} md={4} lg={2}>
                <Card className="h-100 border-0 shadow-sm text-center p-3 transition-hover stat-glance-card" style={{ borderBottom: `3px solid var(--gov-${stat.color})` }}>
                  <div className={`icon-wrapper-sm icon-${stat.color} mb-2 mx-auto`}>
                    <i className={`bi ${stat.icon} fs-5`}></i>
                  </div>
                  <h4 className="fw-bold mb-1 small" style={{ color: `var(--gov-${stat.color}-dark)` }}>{stat.value}</h4>
                  <p className="text-uppercase tracking-wider x-small fw-bold text-muted mb-0">{stat.label}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* About Section Preview */}
      <section className="home-about-preview py-5 bg-light">
        <Container>
          <AboutSection isPreview={true} />
        </Container>
      </section>

      {/* Streamlined Footer */}
      <footer className="gov-footer py-4 mt-auto">
        <Container>
          <div className="text-center">
            <p className="small opacity-75 mb-0">{content.copyright}</p>
          </div>
        </Container>
      </footer>

      {/* Floating Back to Top Button */}
      {showScroll && (
        <button
          className="back-to-top shadow-lg animate__animated animate__fadeInUp"
          onClick={scrollTop}
          aria-label="Back to top"
        >
          <i className="bi bi-arrow-up-circle-fill fs-2"></i>
        </button>
      )}
    </div>
  );
}

export default Home;
