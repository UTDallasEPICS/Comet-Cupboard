import * as React from 'react';
import styled from "styled-components"
import Box from '@mui/material/Box';
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
            <Box height={75} width={75} display="flex" p={1} sx={{border: '2px solid #CCCCCC'}}> 
                <Image src={image} alt={name} />
            </Box>
            <StyledText>{name}</StyledText>
        </Container>
    );
}