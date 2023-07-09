import React from "react";
import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';

export default function AppNavbar() {
    return (
        <Navbar expand="lg" variant="dark" className="bg-dark nav-link">
            <Container>
                <Navbar.Brand className="nav-link" href="/">Travel Warrants</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="Nalozi" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/">Otvoreni</NavDropdown.Item>
                            <NavDropdown.Item href="/personal_calculation">Obračun</NavDropdown.Item>
                            <NavDropdown.Item href="/personal_closed">Zatvoreni</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Ovjeravanje" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/approving_initial">Novi nalog</NavDropdown.Item>
                            <NavDropdown.Item href="/approving_calculation">Obračun</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Knjiženje" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/crediting_advances">Akontacija</NavDropdown.Item>
                            <NavDropdown.Item href="/crediting_calculation">Obračun</NavDropdown.Item>
                            <NavDropdown.Item href="/crediting_queue">Red za plaćanje</NavDropdown.Item>
                            <NavDropdown.Item href="/crediting_paid">Plaćeni</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Šifrarnici" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/catalog_employees">Zaposlenici</NavDropdown.Item>
                            <NavDropdown.Item href="/catalog_department">Organizacijski dijelovi</NavDropdown.Item>
                            <NavDropdown.Item href="/catalog_countries">Države</NavDropdown.Item>
                            <NavDropdown.Item href="/catalog_wages">Dnevnice</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Administracija" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/user_roles">Dodjela prava</NavDropdown.Item>
                            <NavDropdown.Item href="/application_parameters">Parametri aplikacije</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}