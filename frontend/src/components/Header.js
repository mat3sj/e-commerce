import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Navbar, Nav, Container, NavDropdown} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {logout} from "../actions/userActions";

function Header() {
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    const dispatch = useDispatch()

    const logoutHandler = () => {
        dispatch(logout())
    }

    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect >
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>MyShop</Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
                        <Nav>
                            {userInfo && userInfo.is_admin && (
                                <NavDropdown id='admin_menu'
                                             title='Admin'>
                                    <LinkContainer to='/admin/user-list'>
                                        <NavDropdown.Item>Users</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/product-list'>
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/order-list'>
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>


                                </NavDropdown>
                            )}


                            <LinkContainer to='/cart'>
                                <Nav.Link><i
                                    className="fas fa-shopping-cart"/> Cart</Nav.Link>
                            </LinkContainer>

                            {userInfo ? (
                                // todo change to full name
                                <NavDropdown id='username'
                                             title={userInfo.name}>
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item
                                        onClick={logoutHandler}>Logout</NavDropdown.Item>


                                </NavDropdown>
                            ) : (
                                <LinkContainer to='/login'>
                                    <Nav.Link><i
                                        className="fas fa-user"/> Login</Nav.Link>
                                </LinkContainer>
                            )}


                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header