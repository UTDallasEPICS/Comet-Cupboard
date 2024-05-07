// SimpleErrorPage.js
import { Container, Typography, Button, Box } from "@mui/material";

const Error = () => {
  const handleGoBack = () => {
    window.history.back(); // Goes back to the previous page
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h2" color="error" gutterBottom>
          Error
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          There's an error. Please try again.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGoBack}>
          Go Back
        </Button>
      </Box>
    </Container>
  );
};

export default Error;
