import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Modal, Button, Card, Table } from 'react-bootstrap'
import logo from "../../assets/images/gyandharalogo2.png";
import heroImg from "../../assets/images/CBSEimg.png";
import '../../assets/css/home.css'

function Home() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  // All content in Hindi - Government Portal Style
  const content = {
    platformBadge: "🤝 स्वास्थ्य एवं परिवार कल्याण मंत्रालय",
    heroTitle: "स्वास्थ्य एवं पोषण दशक: सूचना एवं प्रबंधन प्रणाली",
    heroSubtitle: "माता एवं शिशु के स्वास्थ्य एवं पोषण की निगरानी के लिए एक एकीकृत डैशबोर्ड। 1000 दिनों (गर्भावधि से 2 वर्ष तक) के दौरान जन्म से लेकर बाल्यकाल तक की जाँच, पोषण एवं टीकाकरण की निगरानी करें।",
    
    // Key Statistics Table (Yellow Highlighted Section as requested)
    statsTitle: "मुख्य आंकड़े एवं प्रगति",
    statsSubtitle: "वर्ष 2024-25 के दौरान किए गए उपलब्धियों का संक्षिप्त विवरण",
    statsTable: [
      { label: "कुल पंजीकृत माताएँ", value: "1,45,000+", change: "+12%", color: "blue" },
      { label: "पूर्ण टीकाकरण दर", value: "87.5%", change: "+5.2%", color: "green" },
      { label: "माता-शिशु सेवाएँ केंद्र", value: "3,200+", change: "+8%", color: "orange" },
      { label: "पोषण सम्बन्धित बालक", value: "92%", change: "+3%", color: "purple" },
      { label: "स्वास्थ्य जाँच भेजी गई", value: "4,15,000+", change: "+15%", color: "teal" },
      { label: "वित्तीय सहायता वितरित", value: "₹180 Cr+", change: "+22%", color: "red" }
    ],

    // Life Stages - Critical Phases (Yellow Marked Table Content)
    lifeStagesTitle: "महत्वपूर्ण जीवनचक्र",
    lifeStagesSubtitle: "सोने के 1000 दिनों (1000 Days) की समय सीमाएँ",
    lifeStages: [
      { 
        icon: "bi-calendar3", 
        title: "गर्भावधि (0-3 माह)", 
        desc: "प्रारंभिक पंजीकरण, ANC जाँच, आहार उपचार",
        color: "saffron",
        highlight: true
      },
      { 
        icon: "bi-heart-pulse", 
        title: "द्वितीय त्रैमासिक (4-6 माह)", 
        desc: "वृद्धि निगरानी, एनामली स्कैन, आहार सलाह",
        color: "blue",
        highlight: false
      },
      { 
        icon: "bi-activity", 
        title: "तृतीय त्रैमासिक (7-9 माह)", 
        desc: "जन्म तैयारी, जटिलता पूर्व तैयारी, पूरक पोषण",
        color: "green",
        highlight: true
      },
      { 
        icon: "bi-hospital", 
        title: "प्रसव एवं जन्म", 
        desc: "सुरक्षित प्रसव ट्रैकिंग एवं तात्कालिक पोषण",
        color: "orange",
        highlight: false
      },
      { 
        icon: "bi-baby", 
        title: "शिशुकाल (0-6 माह)", 
        desc: "विशेषत: स्तनपान और टीकाकरण समर्थन",
        color: "teal",
        highlight: true
      },
      { 
        icon: "bi-emoji-smile", 
        title: "बाल्यकाल (6-24 माह)", 
        desc: "पूरक आहार, विटामिन ए, सामान्य स्वास्थ्य जाँच",
        color: "purple",
        highlight: false
      },
      { 
        icon: "bi-shield-check", 
        title: "पूर्व-विद्यालय (3-6 वर्ष)", 
        desc: "अंगनवाड़ी केंद्रों में प्रारंभिक शिक्षा एवं स्वास्थ्य जाँच",
        color: "blue",
        highlight: true
      },
      { 
        icon: "bi-person", 
        title: "किशोर लड़कियाँ",
        desc: "साप्ताहिक आयरन एवं फोलिक अनुपूरण",
        color: "saffron",
        highlight: false
      }
    ],

    // Intervention Opportunities - Departmental Services
    servicesTitle: "विभागीय सेवाएँ एवं अवसर",
    servicesSubtitle: "माता-शिशु के लिए उपलब्ध मुख्य योजनाएँ",
    services: [
      { 
        icon: "bi-capsule", 
        title: "पोषण सहायता",
        desc: "टीकाकरण, पूरक आहार, आयरन एवं फोलिक अम्ल",
        items: ["THR (Take Home Ration)", "गर्म पकाया भोजन", "IFA गोलियाँ"],
        color: "saffron"
      },
      { 
        icon: "bi-clipboard2-pulse", 
        title: "स्वास्थ्य जाँच", 
        desc: "नियमित ANC, PNC एवं बच्चे की स्वास्थ्य जाँच",
        items: ["रक्तचाप माप", "वज़न माप", "हामोग्लोबिन"],
        color: "green"
      },
      { 
        icon: "bi-shield-plus", 
        title: "टीकाकरण योजना", 
        desc: " MHCV, DPT, OPV, BCG, Rotavirus, PCV पूरा कवरेज",
        items: ["12 bie ज़रूरी टीके", "विशेषज्ञ टीकाकरण", "अपडेट रजिस्ट्री"],
        color: "blue"
      },
      { 
        icon: "bi-bank", 
        title: "वित्तीय सहायता", 
        desc: "पीएमएमवायी, जीएसएयी, जननी आशीर्वाद योजना",
        items: ["₹6,000 (पीएमएमवायी)", "₹1,000 (जीएसएयी)", "₹5,000 (जननी आशीर्वाद)"],
        color: "orange"
      }
    ],

    // New Features / Recent Updates (Yellow Highlighted)
    newFeaturesTitle: "नई सुविधाएँ एवं अद्यतन",
    newFeaturesSubtitle: "प्लेटफॉर्म में जोड़ी गई हालिया सुविधाएँ",
    newFeatures: [
      { icon: "bi-telephone", title: "सेवा हेल्पलाइन 1800-180-1104", desc: "24x7 माता-शिशु सेवा हेल्पलाइन", color: "saffron" },
      { icon: "bi-phone", title: "मोबाइल ऐप जन स्वास्थ्य", desc: "ANMOL और म-स्वास्थ्य ऐप के माध्यम से रीयल-टाइम ट्रैकिंग", color: "green" },
      { icon: "bi-qr-code", title: "QR कोड से पहचान", desc: " माता एवं शिशु की डिजिटल पहचान", color: "blue" },
      { icon: "bi-graph-up", title: "विशिष्ट मॉनिटरिंग", desc: "उच्च जोखिम वाली माताओं एवं बच्चों की विशेष निगरानी", color: "orange" },
      { icon: "bi-geo-alt", title: "भू-टैगिंग", desc: "सेवा केंद्रों की सटीक स्थिति मैपिंग", color: "purple" },
      { icon: "bi-bell", title: "स्मार्ट अलर्ट", desc: "ऐप और SMS द्वारा सूचना एवं अलर्ट", color: "teal" }
    ],

    // Platform Benefits - Why Use This Portal
    benefitsTitle: "प्लेटफॉर्म के लाभ",
    benefits: [
      { icon: "bi-speedometer2", title: "तीव्र डेटा एक्सेस", desc: "राइट कैड बॉर्ड से रियल-टाइम आँकड़े", color: "blue" },
      { icon: "bi-people", title: "समन्वयित डेटा", desc: "स्वास्थ्य, ICDS एवं शिक्षा विभाग की एकीकृत जानकारी", color: "saffron" },
      { icon: "bi-speedometer2", title: "तीव्र डेटा एक्सेस", desc: "सटीक डैशबोर्ड से रियल-टाइम आँकड़े", color: "blue" },
      { icon: "bi-bar-chart", title: "विश्लेषण एवं रिपोर्ट", desc: "स्वचालित MIS रिपोर्ट", color: "orange" }
    ],

    // Final CTA
    readyTitle: "स्वास्थ्य एवं पोषण दशक में भाग लें",
    readySub: "माता-शिशु के स्वास्थ्य सुधार के लिए अभी पंजीकरण करें।",
    getStartedBtn: "पहला कदम",
    learnMoreBtn: "मार्गदर्शिकाएँ",
    signInBtn: "लॉग इन",
    portalLinks: "सरकारी प्रपत्र | ग्रामीण विकास | स्वास्थ्य योजनाएँ | न्यायिक निगरानी",
    
    // Modal
    modalTitle: "पहुंच प्रतिबंधित",
    modalMessage: "स्वास्थ्य रिकॉर्ड देखने के लिए कृपया अपने विभागीय आईडी से लॉगिन करें।",
    modalLogin: "लॉगिन",
    modalRegister: "संस्था पंजीकरण"
  }

  const handleCardClick = () => setShowModal(true)
  const handleClose = () => setShowModal(false)

  // Statistics Card Component
  const StatCard = ({ stat, index }) => (
    <Col xs={6} md={4} lg={2} key={index} className="mb-3">
      <Card className={`stat-card stat-${stat.color} h-100 border-0 shadow-sm transition-hover`}>
        <Card.Body className="text-center p-2">
          <div className="stat-value fs-5 fw-bold">{stat.value}</div>
          <div className="stat-label small fw-medium">{stat.label}</div>
          <div className={`stat-change x-small text-${stat.color === 'red' ? 'danger' : 'success'}`}>
            <i className="bi bi-arrow-up-short"></i> {stat.change}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <div className="home-wrapper">
      {/* Government Portal Header Bar */}
      <div className="gov-header-bar py-1">
        <Container fluid>
          <Row className="align-items-center">
            <Col xs={12} md={6}>
              <div className="d-flex align-items-center gap-2">
                <div className="gov-emblem-placeholder">
                  <i className="bi bi-shield-fill text-warning fs-5"></i>
                </div>
                <div>
                  <div className="x-small text-white-50 lh-1">भारत सरकार // Government of India</div>
                  <div className="fw-bold text-white small">{content.platformBadge}</div>
                </div>
              </div>
            </Col>
            <Col xs={12} md={6} className="text-md-end mt-1 mt-md-0">
              <div className="d-flex justify-content-md-end gap-3 flex-wrap small">
                <Link to="/login" className="text-white text-decoration-none hover-opacity">
                  <i className="bi bi-box-arrow-in-right"></i> {content.signInBtn}
                </Link>
                <span className="text-white-50">|</span>
                <Link to="/register" className="text-white text-decoration-none hover-opacity">
                  <i className="bi bi-person-plus"></i> {content.modalRegister}
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="home-container">
        {/* Hero Section - Government Style */}
        <section className="hero-section-gov py-4">
          <Container fluid className="px-4 px-md-5">
            <Row className="align-items-center gy-3">
              <Col lg={6}>
                <div className="hero-content-gov">
                  <div className="badge-gov mb-2 small">
                    <i className="bi bi-building"></i> स्वास्थ्य एवं परिवार कल्याण मंत्रालय
                  </div>
                  <h2 className="hero-title-gov fw-extra-bold mb-2 fs-3">
                    {content.heroTitle}
                  </h2>
                  <p className="hero-subtitle-gov text-muted small pe-lg-5">
                    {content.heroSubtitle}
                  </p>
                  <div className="hero-buttons-gov mt-3 d-flex gap-2">
                    <Link to="/register" className="btn btn-primary btn-sm px-3">
                      <i className="bi bi-rocket-takeoff"></i> {content.getStartedBtn}
                    </Link>
                    <Link to="/learn" className="btn btn-outline-secondary btn-sm px-3">
                      <i className="bi bi-file-earmark-text"></i> {content.learnMoreBtn}
                    </Link>
                  </div>
                </div>
              </Col>
              <Col lg={6} className="text-center">
                <div className="hero-image-container-gov">
                  <img src={heroImg} alt="स्वास्थ्य एवं पोषण दशक" className="img-fluid rounded shadow" />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Key Statistics Section - Yellow Highlighted Table Area */}
        <section className="stats-section py-4 bg-light">
          <Container>
            <div className="text-center mb-4">
              <h4 className="section-title-gov fw-bold">{content.statsTitle}</h4>
              <p className="section-subtitle text-muted small">{content.statsSubtitle}</p>
            </div>
            
            <Row className="g-3">
              {content.statsTable.map((stat, index) => (
                <StatCard key={index} stat={stat} index={index} />
              ))}
            </Row>
          </Container>
        </section>

        {/* Life Stages Section - Government Cards */}
        <section className="life-stages-section py-4">
          <Container>
            <div className="text-center mb-4">
              <h4 className="section-title-gov fw-bold">{content.lifeStagesTitle}</h4>
              <p className="section-subtitle small text-muted">{content.lifeStagesSubtitle}</p>
            </div>

            <Row className="g-3">
              {content.lifeStages.map((stage, index) => (
                <Col md={3} sm={6} key={index}>
                  <Card className={`life-card h-100 border-0 shadow-sm transition-hover ${stage.highlight ? 'highlight-border' : ''}`}>
                    <Card.Body className="text-center p-3">
                      <div className={`icon-wrapper icon-${stage.color} icon-sm mx-auto mb-2`}>
                        <i className={`bi ${stage.icon}`}></i>
                      </div>
                      <Card.Title className="fs-6 fw-bold mb-1">{stage.title}</Card.Title>
                      <Card.Text className="text-muted small">{stage.desc}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Services Section - Table Layout (Yellow Marked Area for info) */}
        <section className="services-section py-5 bg-light">
          <Container>
            <div className="text-center mb-5">
              <h2 className="section-title-gov">{content.servicesTitle}</h2>
              <p className="section-subtitle text-muted">{content.servicesSubtitle}</p>
            </div>

            <Row className="g-4">
              {content.services.map((service, index) => (
                <Col md={6} key={index}>
                  <Card className={`service-card h-100 border-0 shadow-sm`}>
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-start gap-3">
                        <div className={`icon-wrapper icon-${service.color} flex-shrink-0`}>
                          <i className={`bi ${service.icon}`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <Card.Title className="mb-2">{service.title}</Card.Title>
                          <Card.Text className="text-muted small mb-3">{service.desc}</Card.Text>
                          <div className="service-items">
                            {service.items.map((item, i) => (
                              <span key={i} className="badge bg-light text-dark border me-2 mb-2">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* New Features Section - Yellow Highlighted */}
        <section className="features-section py-4 bg-warning bg-opacity-10">
          <Container>
            <div className="text-center mb-4">
              <div className="badge bg-warning text-dark mb-1 px-2 py-1 small">
                <i className="bi bi-star-fill"></i> नई सुविधाएँ
              </div>
              <h4 className="section-title-gov fw-bold">{content.newFeaturesTitle}</h4>
              <p className="section-subtitle small text-muted">{content.newFeaturesSubtitle}</p>
            </div>

            <Row className="g-3">
              {content.newFeatures.map((feature, index) => (
                <Col md={4} sm={6} key={index}>
                  <Card className={`feature-card h-100 border-0 shadow-sm transition-hover`}>
                    <Card.Body className="text-center p-3">
                      <div className={`icon-wrapper icon-${feature.color} icon-sm mx-auto mb-2`}>
                        <i className={`bi ${feature.icon}`}></i>
                      </div>
                      <Card.Title className="fs-6 fw-bold mb-1">{feature.title}</Card.Title>
                      <Card.Text className="text-muted small">{feature.desc}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section py-4">
          <Container>
            <div className="text-center mb-4">
              <h4 className="section-title-gov fw-bold">{content.benefitsTitle}</h4>
            </div>

            <Row className="g-3">
              {content.benefits.map((benefit, index) => (
                <Col md={3} sm={6} key={index}>
                  <Card className={`benefit-card h-100 border-0 shadow-sm transition-hover`}>
                    <Card.Body className="text-center p-3">
                      <div className={`icon-wrapper icon-${benefit.color} icon-sm mx-auto mb-2`}>
                        <i className={`bi ${benefit.icon}`}></i>
                      </div>
                      <Card.Title className="fs-6 fw-bold mb-1">{benefit.title}</Card.Title>
                      <Card.Text className="text-muted small">{benefit.desc}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>


        {/* Final CTA - Government Style */}
        <section className="final-cta-gov py-4 bg-primary text-white">
          <Container className="text-center">
            <h3 className="mb-2 fw-bold">{content.readyTitle}</h3>
            <p className="small mb-3 opacity-90">{content.readySub}</p>
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <Link to="/register" className="btn btn-light btn-sm px-4 fw-bold">
                <i className="bi bi-rocket-takeoff"></i> {content.getStartedBtn}
              </Link>
              <Link to="/login" className="btn btn-outline-light btn-sm px-4">
                <i className="bi bi-box-arrow-in-right"></i> {content.signInBtn}
              </Link>
            </div>
          </Container>
        </section>

        {/* Footer - Government Style */}
        <footer className="gov-footer bg-dark text-white py-4">
          <Container>
            <Row className="g-3">
              <Col md={4}>
                <h6 className="mb-2 fw-bold text-uppercase small text-warning">स्वास्थ्य एवं परिवार कल्याण मंत्रालय</h6>
                <p className="small opacity-75">
                  भारत सरकार // Government of India<br />
                  स्वास्थ्य एवं पोषण दशक पोर्टल
                </p>
              </Col>
              <Col md={4}>
                <h6 className="mb-2 fw-bold small">सहायक लिंक</h6>
                <ul className="list-unstyled small">
                  <li><Link to="/about" className="text-white-50 text-decoration-none">हमारे बारे में</Link></li>
                  <li><Link to="/contact" className="text-white-50 text-decoration-none">संपर्क</Link></li>
                  <li><Link to="/privacy" className="text-white-50 text-decoration-none">गोपनीयता नीति</Link></li>
                  <li><Link to="/terms" className="text-white-50 text-decoration-none">नियम एवं शर्तें</Link></li>
                </ul>
              </Col>
              <Col md={4}>
                <h6 className="mb-2 fw-bold small">संपर्क करें</h6>
                <p className="small opacity-75">
                  <i className="bi bi-telephone"></i> टोल-फ्री: 1800-180-1104<br />
                  <i className="bi bi-envelope"></i> helpdesk@gyandhara.gov.in<br />
                  <i className="bi bi-geo-alt"></i> नई दिल्ली, भारत
                </p>
              </Col>
            </Row>
            <hr className="my-3 opacity-25" />
            <div className="text-center small opacity-50">
              © 2024 सरकारी भारत // © 2024 Government of India. सर्वाधিকার सुरक्षित।
            </div>
          </Container>
        </footer>
      </div>

      {/* Login/Register Modal */}
      <Modal show={showModal} onHide={handleClose} centered size="sm">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fs-5 fw-bold w-100 text-center">{content.modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center pt-2">
          <p className="mb-4 text-muted">{content.modalMessage}</p>
          <div className="d-grid gap-2">
            <Button variant="primary" className="rounded-pill py-2" onClick={() => { handleClose(); navigate('/login'); window.scrollTo(0, 0); }}>
              <i className="bi bi-box-arrow-in-right me-2"></i> {content.modalLogin}
            </Button>
            <Button variant="outline-primary" className="rounded-pill py-2" onClick={() => { handleClose(); navigate('/register'); window.scrollTo(0, 0); }}>
              <i className="bi bi-person-plus me-2"></i> {content.modalRegister}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Home
