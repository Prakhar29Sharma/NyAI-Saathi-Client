import React from 'react';
import { Box } from '@mui/material';
import Navbar from '../../components/layout/Navbar';
import HeroSection from '../../components/sections/HeroSection';
import AboutSection from '../../components/sections/AboutSection';
import Footer from '../../components/layout/Footer';
import { LoadingSpinner } from '../../components/common';

const HomePage = () => {
  const [loading, setLoading] = React.useState(false);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <HeroSection />
          <AboutSection />
        </>
      )}
      <Footer />
    </Box>
  );
};

export default HomePage;