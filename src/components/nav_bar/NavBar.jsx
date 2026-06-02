import React, { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

import "../../assets/css/navbar.css";
import ukLogo from "../../assets/images/uk_logo.png";

function NavBar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar 
      expand="lg" 
      expanded={expanded} 
      onToggle={setExpanded} 
      fixed="top" 
      style={{ backgroundColor: '#ffffff', padding: '15px 0', borderBottom: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center p-0">
          <img 
            src={ukLogo} 
            alt="Uttarakhand State Government Logo" 
            style={{ height: '60px', width: 'auto', marginRight: '12px' }}
          />
          <div className="d-flex flex-column lh-sm">
            <span style={{ color: '#000080', fontWeight: '700', fontSize: '1.1rem' }}>नियोजन विभाग ऊधमसिंह नगर</span>
            <span style={{ color: '#d9534f', fontWeight: '600', fontSize: '0.9rem', letterSpacing: '0.5px' }}>Planning Department</span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-2">
            <Nav.Link as={Link} to="/" style={{ color: '#008080', fontWeight: '500', padding: '0 15px' }} onClick={() => setExpanded(false)}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" style={{ color: '#008080', fontWeight: '500', padding: '0 15px' }} onClick={() => setExpanded(false)}>
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/gallery" style={{ color: '#008080', fontWeight: '500', padding: '0 15px' }} onClick={() => setExpanded(false)}>
              Gallery
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" style={{ color: '#008080', fontWeight: '500', padding: '0 15px' }} onClick={() => setExpanded(false)}>
              Contact Us
            </Nav.Link>

            <Button 
              as={Link} 
              to="/Login" 
              className="rounded-pill px-4 ms-lg-3"
              style={{ backgroundColor: '#008080', border: 'none', color: '#ffffff', fontWeight: '600', fontSize: '0.9rem' }}
              onClick={() => setExpanded(false)}
            >
              Admin
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;