import React from "react";
import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {Link} from "react-router-dom";
import {getCurrentUser, isAuthorized, isFullyAuthenticated} from "./components/Security/UserAuth";

export default function AppNavbar() {

    return (
        <Navbar expand="lg" variant="dark" className="bg-dark nav-link">
            <Container>
                <Navbar.Brand className="nav-link" href="/personal_warrant/initial">Travel Warrants</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <>
                        {isFullyAuthenticated() && (
                        <Nav className="me-auto">
                            {isAuthorized(['ROLE_EMPLOYEE']) && (
                                <NavDropdown title="Nalozi" id="basic-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/personal_warrant/initial">Novi</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/personal_warrant/calculation">Obračun</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/personal_warrant/closed">Zatvoreni</NavDropdown.Item>
                                </NavDropdown>
                            )}

                            {isAuthorized(['ROLE_APPROVER', 'ROLE_ADMIN']) && (
                                <NavDropdown title="Odobravanje" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/approving_warrant/approving">Novi nalog</NavDropdown.Item>
                                    <NavDropdown.Item href="/approving_warrant/approving_calculation">Obračun</NavDropdown.Item>
                                </NavDropdown>
                            )}

                            {isAuthorized(['ROLE_PROCURATOR', 'ROLE_ADMIN']) && (
                                <NavDropdown title="Knjiženje" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/crediting_warrants/approving_advance_payment">Akontacija</NavDropdown.Item>
                                    <NavDropdown.Item href="/crediting_warrants/approving_calculation_payment">Obračun</NavDropdown.Item>
                                    <NavDropdown.Item href="/crediting_queue/opened">Red za plaćanje</NavDropdown.Item>
                                    <NavDropdown.Item href="/crediting_paid/closed">Plaćeni</NavDropdown.Item>
                                    <NavDropdown.Item href="/crediting_warrants/advance_refund">Povrat akontacije</NavDropdown.Item>
                                </NavDropdown>
                            )}

                            {isAuthorized(['ROLE_PROCURATOR', 'ROLE_ADMIN']) && (
                                <NavDropdown title="Šifrarnici" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/catalog_countries">Države</NavDropdown.Item>
                                    <NavDropdown.Item href="/catalog_country_wages">Dnevnice</NavDropdown.Item>
                                    <NavDropdown.Item href="/catalog_currencies">Valute</NavDropdown.Item>
                                    <NavDropdown.Item href="/catalog_expense_types">Troškovi</NavDropdown.Item>
                                </NavDropdown>
                            )}

                            {isAuthorized(['ROLE_ADMIN']) && (
                                <NavDropdown title="Administracija" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/catalog_employees">Zaposlenici</NavDropdown.Item>
                                    <NavDropdown.Item href="/catalog_department">Organizacijski
                                        dijelovi</NavDropdown.Item>
                                    <NavDropdown.Item href="/user_roles">Dodjela prava</NavDropdown.Item>
                                    <NavDropdown.Item href="/catalog_work_positions">Radna mjesta</NavDropdown.Item>
                                    <NavDropdown.Item href="/warrants">Nalozi</NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                        )}
                        {isAuthorized(['ROLE_EMPLOYEE']) && (
                            <>
                                <Nav className="ml-auto">
                                    Korisnik: { getCurrentUser().username } -
                                </Nav>
                                <Nav className="ml-auto">
                                    <Nav.Link as={Link} to="/logout">
                                        Logout
                                    </Nav.Link>
                                </Nav>
                            </>
                        )}
                    </>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}