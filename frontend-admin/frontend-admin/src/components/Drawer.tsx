import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { useNavigate, useLocation } from 'react-router-dom';
import { Divider } from '@mui/material';
import { IoLogOutOutline } from 'react-icons/io5';
import NavLinks from './NavLinks';
import logo from "../assets/logo2.webp";

interface TemporaryDrawerProps {
  userName: string | undefined;
  logout: () => void;
}

export default function TemporaryDrawer({userName, logout}: TemporaryDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className='drawer-main'>

      <button
        className={`hamburger ${open ? 'hamburger--active' : ''}`}
        onClick={() => setOpen(prev => !prev)}
        aria-label="Menu"
        type="button"
      >
        <span className="hamburger__line" />
        <span className="hamburger__line" />
        <span className="hamburger__line" />
      </button>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px 0 0 16px' } }}
      >
        <div className='drawer' onClick={() => setOpen(false)}>

          <div className='drawer__header'>
            <img src={logo} alt="Logo" className='drawer__logo' loading='lazy'/>
            <div className='drawer__user'>
              <div className="drawer__avatar">
                {userName?.charAt(0) || 'A'}
              </div>
              <span className="drawer__name">{userName}</span>
            </div>
          </div>

          <Divider />

          <nav className='drawer__nav'>
            <NavLinks />
          </nav>

          <div className="drawer__footer">
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="drawer__logout-btn"
              type="button"
            >
              <IoLogOutOutline />
              Abmelden
            </button>
          </div>

        </div>
      </Drawer>

    </div>
  );
}
