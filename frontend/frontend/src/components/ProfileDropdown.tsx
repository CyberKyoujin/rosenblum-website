import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Login  from '@mui/icons-material/Login';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../zustand/useAuthStore';

export default function AccountMenu() {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const { isAuthenticated, user, logoutUser } = useAuthStore.getState();

    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <React.Fragment>
        <div>
          
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              {user?.profile_img_url ? <img className='profile-img-sm' src={user?.profile_img_url || ''}  alt="Profile" />: <Avatar sx={{ width: 46, height: 46, background: 'rgb(76, 121, 212)' }}>{user?.first_name?.[0]}</Avatar> }
            </IconButton>
        
        </div>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              padding: '0.5rem',
              borderRadius: '0px',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => {
            handleClose();
            if (isAuthenticated){
              navigate('/profile');
            } else {
              navigate('/register')
            }
          }}>
            {user?.profile_img_url ? <img className='profile-img-sm' style={{width: '35px', marginRight:"0.5rem"}} src={user?.profile_img_url || ''} alt="Profile" /> : <div><Avatar sx={{background: 'rgb(76, 121, 212)'}}>{user?.first_name?.[0]}</Avatar></div> } {isAuthenticated ? user?.first_name + " " + user?.last_name : t('profile')}
          </MenuItem>
          <Divider />

          { isAuthenticated ? (

            <div>

            <MenuItem onClick={() => {
              handleClose();
              logoutUser();
              navigate('/login')
            }}>
              <ListItemIcon>
                <Login fontSize="small" />
              </ListItemIcon>
              {t('logout')}
            </MenuItem>

            </div>

          )
          : 
          (
            <div>
            <MenuItem onClick={() => {
              handleClose();
              navigate('/register')
            }}>
              <ListItemIcon>
                <Login fontSize="small" />
              </ListItemIcon>
              {t('register')}
            </MenuItem>
  
            <MenuItem onClick={() => {
              handleClose();
              navigate('/login')
            }}>
              <ListItemIcon>
                <Login fontSize="small" />
              </ListItemIcon>
              {t('login')}
            </MenuItem>
            </div>

          )}

          

        </Menu>
      </React.Fragment>
    );
  }