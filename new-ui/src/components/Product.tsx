import * as React from 'react';
import styled from "styled-components"
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
interface ProductProps{
    name: string;
    image: string;
}

const Container = styled.div`
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
`
const StyledText = styled.p`
    font-weight = bold;
    font-size: 1.5rem;
    margin-top: 0.5rem;
    text-align: center;
    justify-content: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const Image = styled.img`
    height: 75px;
    width: 75px;
    object-fit: contain; /* Maintain aspect ratio while fitting within container */
    margin: auto;
`;


export default function Product({ image, name }: ProductProps){
    return(
        <Container>
            <Card variant="outlined"><Image src={image} alt={name} /></Card>
            <StyledText>{name}</StyledText>
        </Container>
    );
}