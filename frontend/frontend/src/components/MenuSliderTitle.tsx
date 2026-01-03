import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons/lib';

interface MenuSliderTitleProps {
    Icon: IconType;
    text: string;
}

const MenuSliderTitle: React.FC<MenuSliderTitleProps> = ({Icon, text}) => {

    const {t} = useTranslation();

    return (
        <div className="slider-title-top">
            <Icon className='app-icon'/>
            <p>{t(text)}</p>
        </div>
    );
}

export default MenuSliderTitle;
