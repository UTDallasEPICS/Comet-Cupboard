import styled from "styled-components"
interface BottomBarProps{
    image: string;
}

const BottomStyle = styled.div`
    width: 100%;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100px;
    background-color: grey;
`
const StyledText = styled.p`
    color: white;
    margin-left: 10rem;
    font-weight: bold;
    font-size: 1.1rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const StyledImage = styled.img`
    margin-top: 0.5rem;
    width: 350px;
    height: 75px;
`

const StyledWrapper = styled.div`
    display: flex;
`

const StyledInfo = styled.p`
    color: white;
    font-weight: bold;
    margin-left: 10rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    white-space: pre-line;
`

export default function BottomBar({ image }: BottomBarProps){
    return(
        <BottomStyle>
            <StyledWrapper>
                <StyledImage src={image} alt=""/>
                <StyledText>The Comet Cupboard is a UT Dallas food pantry initiative dedicated to helping students in need. Its primary <br /> mission is to provide necessary food and personal care items to members of the UT Dallas community.</StyledText>
                <StyledInfo>
                    Office Telephone: 972-883-6613 <br />
                    Email: cupboard@utdallas.edu  <br />
                    Location: MC 1.604
                </StyledInfo>
            </StyledWrapper>
            <StyledText>The Comet Cupboard is a UT Dallas food pantry initiative dedicated to helping students in need. Its primary mission is to provide necessary food and personal care items to members of the UT Dallas community.</StyledText>
        </BottomStyle>
    );
}
