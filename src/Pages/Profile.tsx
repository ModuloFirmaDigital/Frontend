import React from 'react';
import UserProfile from '../components/UserProfile';

const ProfilePage: React.FC = () => {
  const userId = localStorage.getItem('id') || '';

  if (!userId) {
    return <div>No se encontró el ID del usuario.</div>;
  }

  return (
    <div className="profile-page">
      <UserProfile  />
    </div>
  );
};

export default ProfilePage;
