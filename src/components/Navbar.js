import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import "../styles/Navbar.css";

const Navigationbar = () => {
  return (
    <Navbar className="navbar" collapseOnSelect expand="lg">
      <Container>
        <Navbar.Brand className="leftSide" href="/">
          CETgo
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="rightSide">
            <Nav.Link href="/dept">Department</Nav.Link>
            <Nav.Link href="#deets">Events</Nav.Link>
            <Nav.Link href="/Navi">Navigation</Nav.Link>
            <Nav.Link href="/Login">Login</Nav.Link>
            <NavDropdown title="More" id="collasible-nav-dropdown">
              <NavDropdown.Item classname="drop-down" href="#action/3.1">
                Emergency Contact
              </NavDropdown.Item>
              <NavDropdown.Item classname="drop-down" href="#action/3.2">
                Exam Hall Search
              </NavDropdown.Item>
              <NavDropdown.Item classname="drop-down" href="#action/3.3">
                About Us
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigationbar;
