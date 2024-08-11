'use client';

import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import Chat from './chat';

export default function Home() {
  const [showChat, setShowChat] = useState(false);

  const handleGoToChat = () => {
    setShowChat(true);
  };

  const handleGoBack = () => {
    setShowChat(false);
  };

  return (
    <Stack direction="row" justifyContent="center" alignItems="center" width="100vw" height="100vh" >
      {showChat ? (
        <Stack 
          direction="column" 
          justifyContent="center" 
          alignItems="center" 
          width="100%" 
          height="100%" 
        >
          <Stack 
            direction="row" 
            alignItems="center" 
            width="100%" 
            paddingX={3}
            backgroundColor={'#E27396'}
            position="sticky"
            top={0}
            zIndex={1}
          >
            <IconButton 
              onClick={handleGoBack} 
              sx={{ color: 'white', padding: '10px', backgroundColor: '#9bd9ad' }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant={'h5'} color={'white'} textAlign={'center'} fontWeight={"bold"} backgroundColor={'#E27396'} padding={'20px'} flexGrow={1} paddingLeft={'0px'}>
              CyberFit Assistant
            </Typography>
          </Stack>
          <Chat />
        </Stack>
      ) : (
        <>
          <Box display="flex" flexDirection="column" alignItems="flex-start" paddingLeft="20px" width='50vw'>
            <Typography variant={'h1'} color={'#3B4144'} textAlign={'left'} fontWeight={"bold"} paddingBottom={'25px'}>
              CyberFit
            </Typography>
            <Typography variant={'p'} color={'#304840'} textAlign={'left'} paddingBottom={'60px'} paddingRight={'60px'}>
              Your AI CyberFit assistant, offering expert advice on helping you to secure your device.
            </Typography>
            <Box
              component="img"
              src="/hello.png"
              alt="PlantPal Avatar"
              sx={{ maxWidth: '300px', width: '100%', height: 'auto', paddingBottom: '10px' }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleGoToChat}
              sx={{ 
                backgroundColor: '#2A2E2B', 
                color: 'white', 
                borderRadius: "30px",
                width: '300px', 
                height: '50px',
                '&:hover': {
                  backgroundColor: '#9bd9ad',
                },
                marginTop: '10px' 
              }}
            >
              Start Chat
            </Button>
          </Box>
          <Box
            component="img"
            src={'/giphy.webp'}
            alt="AI Robot"
            sx={{ 
              maxWidth: '400px', 
              height: 'auto', 
              backgroundColor: '#FAFAF8', 
              borderRadius: '50px', 
              padding: '20px', 
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              display: showChat ? 'none' : 'block' // Hide the image when on chat page
            }}
          />
        </>
      )}
    </Stack>
  );
}
