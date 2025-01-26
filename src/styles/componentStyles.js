export const componentStyles = {
  // Hero Section
  hero: {
    minHeight: '90vh',
    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  // Chat Components
  chatContainer: {
    height: 'calc(100vh - 120px)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },

  messageList: {
    flexGrow: 1,
    overflow: 'auto',
    padding: '20px'
  },

  // Cards
  featureCard: {
    height: '100%',
    textAlign: 'center',
    padding: '24px',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)'
    }
  },

  // Layout
  navbar: {
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },

  footer: {
    backgroundColor: 'primary.main',
    color: 'white',
    paddingTop: '48px',
    paddingBottom: '48px',
    marginTop: 'auto'
  }
};