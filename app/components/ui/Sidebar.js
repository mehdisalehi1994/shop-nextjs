import Link from 'next/link';
import React from 'react';
import { Nav } from 'react-bootstrap';
import { FaHome, FaTags, FaShoppingBag, FaPercent, FaCommentDots, FaUserShield, FaWarehouse, FaAd   } from "react-icons/fa";
import LogoutButton from '../auth/LogoutButton';
const Sidebar = () => {
    return (
        <aside className='sidebar'>
            <Nav className='flex-column mt-1'>
            <br />
                <Link href="/admin">
                <FaHome  />
                  داشبورد
                  
                </Link>
<br />
                <Link href="/admin/categorize">
                <FaTags  />
                 دسته بندی ها
                  
                </Link>
                <br />

                <Link href="/admin/products">
                <FaShoppingBag />
                 محصولات
                  
                </Link>
                <br />

                <Link href="/admin/discount">
                <FaPercent />
                 مدیریت کد های تخفیف
                  
                </Link>
                <br />

                <Link href="/admin/comments">
                <FaCommentDots />
                 مدیریت نظرات
                  
                </Link>
                <br />

                <Link href="/admin/users">
                <FaUserShield />
                 مدیریت کاربران
                  
                </Link> <br />

                <Link href="/admin/stock">
                <FaWarehouse />
                 مدیریت موجودی انبار
                  
                </Link><br />

                
                <Link href="/admin/ads">
                <FaAd />
                 مدیریت تبلیغات
                  
                </Link>
                <br /> <br />  <br /> <br /> <br /> <br />   <br /> <br />   <br /> <br /><br /> <br /><br /> <br /><br />
                <LogoutButton  />
            </Nav>
        </aside>
    );
};

export default Sidebar;