import { Box } from "@mui/material";
import { ListItem } from "@mui/material";
import styled from "styled-components"
interface BottomBarProps{
    image: string;
}

const BottomStyle = styled.div`
    margin-top: 1rem;
    width: 100%;
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: auto;
    background-color: grey;
`
const StyledText = styled.p`
    color: white;
    margin-left: 10rem;
    margin-bottom: 0px;
    font-weight: bold;
    font-style: italic;
    font-size: 1.1rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const StyledImage = styled.img`
    margin-top: 0.5rem;
    width: 350px;
    height: 100px;
    
`

const StyledWrapper = styled.div`
    display: flex;
`

const StyledInfo = styled.p`
    color: white;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    white-space: pre-line;
    display: inline;
    width: 50%;

`


export default function BottomBar({ image }: BottomBarProps){
    return(
        <BottomStyle>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridAutoColumns: '1fr'}}>
                    <ListItem sx={{justifyContent: 'center'}}>
                        <StyledImage src={image} alt=""/>
                    </ListItem>
                    <ListItem sx={{justifyContent: 'center'}}>
                        <StyledInfo>
                            Office Telephone: 972-883-6613 <br />
                            Email: cupboard@utdallas.edu  <br />
                            Location: MC 1.604
                        </StyledInfo>
                    </ListItem>

                </Box>

                <Box sx={{textAlign: 'center'}}>
                    <StyledText>The Comet Cupboard is a UT Dallas food pantry initiative dedicated to helping students in need. Its primary <br /> mission is to provide necessary food and personal care items to members of the UT Dallas community.</StyledText>
                </Box>
              
        </BottomStyle>
    );
}
