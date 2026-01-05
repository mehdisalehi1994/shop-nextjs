// "use client";
import React from 'react';
import { Navbar, NavbarBrand } from 'react-bootstrap';
import { FaUserShield } from "react-icons/fa";

const Header = () => {
    return (
       <Navbar bg='light' expand="lg" className='d-flex justify-content-between mt-1'>
       <NavbarBrand className='p-3'>
       <FaUserShield />
       <span className='mx-1 bg-admin'>
       پنل ادمین
       </span>
       </NavbarBrand>
       </Navbar>
    );
};

export default Header;