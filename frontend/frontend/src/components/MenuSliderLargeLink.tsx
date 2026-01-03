import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons/lib';
import { Link } from 'react-router-dom';

interface MenuSliderLargeLinkProps {
    link: string;
    linkText: string;
    Icon: IconType;
    toggleSlider: (open: boolean) => void;
}

const MenuSliderLargeLink: React.FC<MenuSliderLargeLinkProps> = ({link, linkText, Icon, toggleSlider}) => {

    const { t } = useTranslation();

    return (
        <Link className="slider-footer-container" to={link} onClick={() => toggleSlider(false)}>
            <Icon className="slider-icon"/>
            <p>{t(linkText)}</p>
        </Link>
    );
}

export default MenuSliderLargeLink;
