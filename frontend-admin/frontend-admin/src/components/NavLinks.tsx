import { IconType } from 'react-icons/lib';
import { Link, useLocation } from 'react-router-dom';
import { MdGTranslate } from 'react-icons/md';
import { IoPersonOutline, IoChatbubbleOutline, IoStatsChartOutline } from 'react-icons/io5';

const navLinks = [
    { name: "Übersetzer", link: "/translator", Icon: MdGTranslate },
    { name: "Kunden", link: "/customers", Icon: IoPersonOutline },
    { name: "Nachrichten", link: "/messages", Icon: IoChatbubbleOutline },
    { name: "Statistik", link: "/statistics", Icon: IoStatsChartOutline },
]

interface NavLinkProps {
    redirectLink: string;
    Icon: IconType;
    linkName: string;
    isActive: boolean;
}

const NavbarLink = ({redirectLink, Icon, linkName, isActive}: NavLinkProps) => {
    return (
        <Link to={redirectLink} className={`nav__link ${isActive ? 'nav__link--active' : ''}`}>
            <Icon />
            <span className="nav__link-text">{linkName}</span>
        </Link>
    )
}

const NavLinks = () => {
    const location = useLocation();

    return (
        <>
            {navLinks.map((item) => (
                <NavbarLink
                    key={item.name}
                    redirectLink={item.link}
                    linkName={item.name}
                    Icon={item.Icon}
                    isActive={location.pathname.startsWith(item.link)}
                />
            ))}
        </>
    );
}

export default NavLinks;
