import React from 'react';
import { Container, Typography, Button } from '@mui/material';

const HelpPage = () => {
    return (
        <Container>
            <Typography variant="h1" gutterBottom>
                Help Page
            </Typography>
            <Typography variant="body1" paragraph>
                This is the help page content.
            </Typography>
            <Button variant="contained" color="primary">
                Get Help
            </Button>
        </Container>
    );
};

export default HelpPage;
