import React, { useEffect, useState } from 'react';
import { TextField, Divider } from '@mui/material';
import { RiEdit2Fill } from 'react-icons/ri';
import { MdAddAPhoto } from 'react-icons/md';
import useAuthStore from '../zustand/useAuthStore';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../assets/default_avatar.png'

interface UserData {
  phone_number?: string;
  city?: string;
  street?: string;
  zip?: string;
  profile_img_url?: string;
}

const EditProfile = () => {
  const { userData, user, fetchUserData, updateUserProfile } = useAuthStore.getState();

  const [phoneNumber, setPhoneNumber] = useState<string>(userData?.phone_number || '');
  const [city, setCity] = useState<string>(userData?.city || '');
  const [street, setStreet] = useState<string>(userData?.street || '');
  const [zip, setZip] = useState<string>(userData?.zip || '');

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileUrl, setProfileUrl] = useState<string>('');

  const profileImg = user?.profile_img_url || userData?.image_url || '';

  const navigate = useNavigate();

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (profileImage){
        formData.append('profile_img', profileImage);
    }
    formData.append('phone_number', phoneNumber);
    formData.append('city', city);
    formData.append('street', street);
    formData.append('zip', zip);

    await updateUserProfile(formData);
  }

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <div style={{ padding: '1.5rem' }}>


    <div role="presentation" className="profile-navigation">
        <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">Home</Link>
        <Link underline="hover" color="inherit" href="/profile">Profil</Link>
        <Typography color="text.primary">Profil bearbeiten</Typography>
        </Breadcrumbs>
    </div>

      <div className="profile-edit-container">
        <div className="profile-title-container">
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <RiEdit2Fill size={40} style={{ color: 'rgb(76, 121, 212)' }} />
            <h1>Profil</h1>
            <h1 className="header-span">bearbeiten</h1>
          </div>
          <div className='cancel-container'>
             <p onClick={() => navigate('/profile')}>Abbrechen</p>
          </div>
        </div>

        <Divider orientation="horizontal" sx={{ marginTop: '1.5rem', marginBottom: '2rem', color: 'grey' }} />

        <form className="edit-form" onSubmit={handleSubmit}>
          <div className="edit-form-content">

            <div className="edit-avatar-container" style={{display: user?.profile_img_url ? 'none' : 'block'}}>

                <div className='image-container'>
                    <img src={profileUrl || profileImg || defaultAvatar}/>
                </div>
              
              <input type="file" id="file-input" style={{ display: 'none' }} onChange={handleFileChange} />
              <label htmlFor="file-input" className="edit-avatar-btn hover-btn">
                <MdAddAPhoto style={{ fontSize: '25px', color: 'white', marginBottom: '2px' }} />
              </label>
            </div>

            <div className="edit-form">
              <TextField required id="phone-number" type="number" label={!phoneNumber ? "Telefonnummer" : undefined} variant="outlined" fullWidth value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              <TextField required id="city" label={!city ? "Stadt" : undefined} variant="outlined" fullWidth value={city} onChange={(e) => setCity(e.target.value)} />
              <TextField required id="street" label={!street ? "Straße" : undefined} variant="outlined" fullWidth value={street} onChange={(e) => setStreet(e.target.value)} />
              <TextField required id="zip" type="number" label={!zip ? "PLZ" : undefined} variant="outlined" fullWidth value={zip} onChange={(e) => setZip(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="confirm-btn hover-btn" style={{ width: '100%' }}>Speichern</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;