
import React from 'react';
import { IconType } from 'react-icons/lib';
import { Link } from 'react-router-dom';
import { MdGTranslate } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { BiSolidMessageSquareDetail } from 'react-icons/bi';
import { FaChartBar } from 'react-icons/fa';

const navLinks = [
    { name: "Übersetzer", link: "/translator", Icon: MdGTranslate },
    { name: "Kunden", link: "/customers", Icon: FaUser },
    { name: "Nachrichten", link: "/messages", Icon: BiSolidMessageSquareDetail },
    { name: "Statistik", link: "/statistics", Icon: FaChartBar },
]

interface NavLinkProps {
    redirectLink: string;
    Icon: IconType;
    linkName: string;
}

const NavbarLink = ({redirectLink, Icon, linkName}: NavLinkProps) => {
    return (
        <Link to={redirectLink} className="nav-link-container">
            <Icon size={20}/>
            <p className="nav-link">{linkName}</p>
        </Link>
    )
}

const NavLinks = () => {
    return (
        <>
            
            {navLinks.map((item) => (
                <NavbarLink key={item.name} redirectLink={item.link} linkName={item.name} Icon={item.Icon}/>
            ))}

        </>
    );
}

export default NavLinks;
