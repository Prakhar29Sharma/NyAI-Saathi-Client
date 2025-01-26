import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';

const AboutSection = () => {
  const features = [
    {
      icon: <GavelIcon sx={{ fontSize: 40 }} />,
      title: 'Legal Analysis',
      description: 'Get instant analysis of your legal queries'
    },
    {
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      title: 'Smart Search',
      description: 'Find relevant legal documents instantly'
    },
    {
      icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
      title: 'Document Access',
      description: 'Access comprehensive legal documentation'
    }
  ];

  return (
    <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          textAlign="center" 
          gutterBottom
          data-aos="fade-up"
        >
          About Our Platform
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box 
                data-aos="fade-up"
                data-aos-delay={200 * (index + 1)}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    textAlign: 'center',
                    p: 4,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)'
                    }
                  }}
                >
                  <CardContent>
                    {feature.icon}
                    <Typography variant="h5" sx={{ my: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;