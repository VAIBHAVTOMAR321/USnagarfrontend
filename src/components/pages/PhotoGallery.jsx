import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../apiConfig';
import '../../assets/css/about.css';

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

export const GalleryIntro = () => {
  return (
    <Row className="align-items-center gy-4">
      <Col lg={5} className="animate__animated animate__fadeInLeft">
        <div className="about-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80" 
            alt="Scenic View of District" 
            className="img-fluid about-hero-img rounded shadow-sm"
          />
        </div>
      </Col>
      <Col lg={7} className="ps-lg-5 animate__animated animate__fadeInRight">
        <div className="about-content-wrapper">
          <h2 className="about-main-heading fw-bold text-navy">
            <span className="text-cyan">VISUAL JOURNEY —</span> Capturing the Essence of Pauri
          </h2>
          <div className="about-para-group">
            <p>
              Explore the vibrant culture, lush landscapes, and developmental milestones of Pauri through our curated photo collection. Each image tells a story of progress, tradition, and community.
            </p>
            <p className="text-muted mt-3">
              Our gallery is updated regularly to reflect the changing seasons and the evolving spirit of our district.
            </p>
          </div>
        </div>
      </Col>
    </Row>
  );
};

const PhotoGallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/gallery/`);
        const data = Array.isArray(res.data) ? res.data : res.data?.data || res.data?.results || [];
        setGalleryImages(data.map((g) => ({ id: g.id, title: g.title, url: getImageUrl(g.image) })));
      } catch (e) {
        setGalleryImages([]);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="about-page-container">
      {/* Breadcrumb Section */}
      <section className="about-breadcrumb-area">
        <Container>
          <div className="breadcrumb-nav">
            <Link to="/" className="breadcrumb-home">Home</Link>
            <span className="breadcrumb-divider">/</span>
            <span className="breadcrumb-active">Photo Gallery</span>
          </div>
        </Container>
      </section>

      {/* Hero Content Section */}
      <section className="about-full-section py-5">
        <Container>
          <GalleryIntro />
        </Container>
      </section>

      {/* Photo Grid Section */}
      <section className="departments-section py-5 bg-white border-top">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title-large mb-1 text-navy">PHOTO GALLERY</h2>
            <h5 className="mb-3 text-cyan" style={{ letterSpacing: '1px' }}>A Glimpse into our District</h5>
            <p className="text-muted mx-auto" style={{ maxWidth: '800px' }}>
              Browse through our collection of photographs showcasing the beauty and administrative milestones of the region.
            </p>
          </div>
          <Row className="g-4">
            {galleryImages.map((image) => (
              <Col key={image.id} xs={12} sm={6} md={4} lg={3}>
                <Card className="dept-card border-0 shadow-sm h-100 overflow-hidden">
                  <div className="gallery-img-container" style={{ height: '200px', overflow: 'hidden' }}>
                    <Card.Img 
                      variant="top" 
                      src={image.url} 
                      style={{ objectFit: 'cover', height: '100%', transition: 'transform 0.3s' }}
                      className="gallery-hover-effect"
                    />
                  </div>
                  <Card.Body className="p-3 text-center">
                    <h6 className="mb-0 text-navy fw-bold">{image.title}</h6>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default PhotoGallery;