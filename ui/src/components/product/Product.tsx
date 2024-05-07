import React from "react";
import styled from "styled-components";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Button } from "@mui/material";

interface ProductProps {
  name: string;
  image: string;
}

const Container = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
`;
// const StyledText = styled.p`
//     font-weight = bold;
//     font-size: 1.5rem;
//     margin-top: 0.5rem;
//     text-align: center;
//     justify-content: center;
//     text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
// `;

// const Image = styled.img`
//   height: 100%;
//   width: 100%;
//   margin: auto;
// `;

const PopupOverlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 999; /* Ensure the overlay is above other content */
`;

const Popup = styled.div`
  position: fixed;
  top: 40%;
  left: 10%;
  width: 1500px;
  height: 170px;
  gap: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

// const Close = styled.button`
//   margin: 0 auto;
//   color: red;
//   font-weight: bold;
// `;

const Imageinbox = styled.img`
  object-fit: contain;
  height: 100%;
  width: 100%;
`;

export default function Product({ image, name }: ProductProps) {
  const [makePopup, setPopup] = React.useState(false);
  function handleOpen() {
    setPopup(true);
  }
  function handleClose() {
    setPopup(false);
  }

  return (
    <Container>
      {makePopup && (
        <Card>
          <PopupOverlay />
          <Popup>
            <Box>
              <Typography>{name}</Typography>
              <Imageinbox src={image} alt={name} />
            </Box>
            <Button color="info" size="medium">
              Add to cart
            </Button>
            <Button size="medium" onClick={handleClose}>
              CLOSE
            </Button>
          </Popup>
        </Card>
      )}
      <Card sx={{ maxWidth: 345 }} onClick={handleOpen}>
        <CardActionArea>
          <CardMedia component="img" height="140" image={image} alt={name} />
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Container>
  );
}
