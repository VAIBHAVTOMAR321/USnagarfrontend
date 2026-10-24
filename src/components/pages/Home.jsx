import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { AboutSection } from './About';
import CM from  "../../assets/images/final_banner_cm.jpeg"
import { API_BASE_URL } from '../../apiConfig';
import '../../assets/css/home.css'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80';

const IMAGE_PREFIX = '/pauripargati/pauripargati_backend';

const getImageUrl = (image) => {
  if (!image || typeof image !== 'string') {
    return PLACEHOLDER;
  }

  if (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('data:') ||
    image.startsWith('blob:')
  ) {
    if (
      image.startsWith('https://mahadevaaya.com/media/') ||
      image.startsWith('http://mahadevaaya.com/media/')
    ) {
      return image.replace(
        'mahadevaaya.com/media/',
        'mahadevaaya.com/pauripargati/pauripargati_backend/media/'
      );
    }

    return image;
  }

  return `https://mahadevaaya.com${IMAGE_PREFIX}${
    image.startsWith('/') ? '' : '/'
  }${image}`;
};

// Photo Gallery Carousel Component
const HomePhotoGalleryCarousel = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [images, setImages] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/gallery/`);
        const data = Array.isArray(res.data) ? res.data : res.data?.data || res.data?.results || [];
        setImages(data.map((g) => ({ id: g.id, title: g.title, url: getImageUrl(g.image) })));
      } catch (e) {
        setImages([]);
      }
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || !isAutoPlaying) return;

    const scrollInterval = setInterval(() => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      setScrollPosition((prevPos) => {
        const newPos = prevPos + 2;
        return newPos > maxScroll ? 0 : newPos;
      });
    }, 30);

    return () => clearInterval(scrollInterval);
  }, [isAutoPlaying]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.scrollLeft = scrollPosition;
    }
  }, [scrollPosition]);

  const handleGalleryClick = () => {
    window.location.href = '/pauripargati/gallery';
  };

  const scrollLeft = () => {
    setIsAutoPlaying(false);
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    setIsAutoPlaying(false);
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="home-gallery-carousel-wrapper position-relative">
      {/* Left Arrow */}
      <button
        className="home-gallery-arrow home-gallery-arrow-left"
        onClick={scrollLeft}
        aria-label="Previous gallery items"
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      {/* Carousel Content */}
      <div className="home-gallery-carousel-content" ref={carouselRef}>
        {images.map((image) => (
          <div
            key={image.id}
            className="home-gallery-item"
            onClick={handleGalleryClick}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleGalleryClick()}
          >
            <div className="home-gallery-card shadow-sm">
              <div className="home-gallery-image">
                <img src={image.url} alt={image.title} />
              </div>
              <div className="home-gallery-title">
                <h6 className="mb-0">{image.title}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        className="home-gallery-arrow home-gallery-arrow-right"
        onClick={scrollRight}
        aria-label="Next gallery items"
      >
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );
};

function Home() {
  const [showScroll, setShowScroll] = useState(false);
  const [carouselData, setCarouselData] = useState([]);

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/carousel/`);
        const data = Array.isArray(res.data) ? res.data : res.data?.data || res.data?.results || [];
        setCarouselData(data);
      } catch (e) {
        setCarouselData([]);
      }
    };
    fetchCarousel();
  }, []);

  const heroItem = carouselData.length > 0 ? carouselData[0] : null;

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
    districtName: "Pauri",
    heroTitle: heroItem?.title || "Welcome to Pauri",
    heroSubtitle: heroItem?.description || "The Food Bowl of Uttarakhand — A harmonious blend of industrial growth, agricultural excellence, and rich cultural heritage.",
    glanceTitle: "Pauri Garhwal at a Glance",
    glanceSubtitle: "A snapshot of our district's geography and demographics",
    stats: [
      { label: "Area", value: "2,542 Sq. Km.", icon: "bi-geo-alt", color: "blue" },
      { label: "Population", value: "16.48 Lakh", icon: "bi-people", color: "saffron" },
      { label: "Blocks", value: "07", icon: "bi-grid-3x3-gap", color: "green" },
      { label: "Tehsils", value: "08", icon: "bi-map", color: "orange" },
      { label: "Municipalities", value: "09", icon: "bi-building-check", color: "purple" },
      { label: "Villages", value: "672", icon: "bi-house-heart", color: "teal" }
    ],
   
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
                <img src={CM} alt="images" />
              </div>
            </Col>
          </Row>
        </Container>
      </header>

      {/* PauriAt a Glance Dashboard */}
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

      {/* Photo Gallery Carousel Section */}
      <section className="home-photo-gallery-section py-5 bg-white">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title-gov fw-bold">PHOTO GALLERY</h2>
            <h5 className="mb-3 text-cyan" style={{ letterSpacing: '1px' }}>A Glimpse into our District</h5>
            <p className="text-muted mx-auto" style={{ maxWidth: '800px' }}>
              Browse through our collection of photographs showcasing the beauty and administrative milestones of the region.
            </p>
          </div>
          <HomePhotoGalleryCarousel />
        </Container>
      </section>

    

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
