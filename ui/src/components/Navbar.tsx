import { AppBar, Button, Toolbar } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const Navbar = () => {
    return (
        <AppBar position="fixed" sx={{background: "#154734", blockSize: '10vh', width: "100%"}}>
            <Toolbar>
            <img src="src/images/CometCupboard_transparent_orange.png" style={{marginRight: '1vw', height: '5vh', width: '10vw'}}></img>
            
            <Button sx={{marginLeft: 'auto', color: "white"}}>
                <ShoppingCartIcon sx={{fontSize: '5vh'}}/>
            </Button>
            <Button sx={{color: "white"}}>
                <SummarizeIcon sx={{fontSize: '5vh'}}/>
            </Button>
            <Button sx={{color: "white"}}>
                <AccountCircleIcon sx={{fontSize: '5vh'}}/>
            </Button>
            </Toolbar>
        </AppBar>
    )
}
