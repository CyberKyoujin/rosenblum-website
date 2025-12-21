import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "../assets/logo2.webp"
import { TbLogout2 } from 'react-icons/tb';
import { Link, useNavigate } from 'react-router-dom';
import { Divider } from '@mui/material';
import NavLinks from './NavLinks';

interface TemporaryDrawerProps {
  userName: string | undefined;
  logout: () => void;
}

export default function TemporaryDrawer({userName, logout}: TemporaryDrawerProps) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const navigate = useNavigate();

  const DrawerList = (

    <div role="presentation" className='drawer' onClick={toggleDrawer(false)}>

      <section className='drawer-logo-section'>

        <img src={logo} alt="" className='drawer-logo' loading='lazy'/>

        <div className='drawer-profile-section'>
            <h4>Hallo, {userName}</h4>

            <button 
              onClick={() => {logout(); navigate('/')}} 
              className="btn"
              style={{padding: '0.5rem', width: "100%"}}>
              <TbLogout2/>
            </button>

        </div>

      </section>

      <Divider/>

      <List className='drawer-links-container' sx={{pl: 1, pr: 1, mt: 2}}>

        <NavLinks/>
        
      </List>

    </div>

  );

  return (
    <div className='drawer-main'>
      <Button onClick={toggleDrawer(true)}>
        <RxHamburgerMenu size={35} className='app-icon'/>
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
