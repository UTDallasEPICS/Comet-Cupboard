import { AppBar, Button, Toolbar } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SummarizeIcon from "@mui/icons-material/Summarize";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { useNavigate } from 'react-router-dom';



const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.25),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const Navbar = () => {
  const navigate = useNavigate();
  return (
    <AppBar
      position="fixed"
      sx={{ background: "#154734", blockSize: "10vh", width: "100%" }}
    >
      <Toolbar>
        <div
          style={{
            width: "10vw",
            height: "5vh",
            overflow: "hidden",
            marginTop: 15,
          }}
        >
          <img
            src="src/assets/CometCupboard_transparent_orange.png"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          ></img>
        </div>
        <Button sx={{ marginLeft: "auto", color: "white", marginTop: 2 }} onClick={() => navigate('/cart')}>
          <ShoppingCartIcon sx={{ fontSize: "5vh" }} />
        </Button>
        <Button sx={{ color: "white", marginTop: 2 }}>
          <SummarizeIcon sx={{ fontSize: "5vh" }} />
        </Button>
        <Button sx={{ color: "white", marginTop: 2 }}>
          <AccountCircleIcon sx={{ fontSize: "5vh" }} />
        </Button>
        <Search sx={{ marginLeft: "auto", marginTop: 2 }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
      </Toolbar>
    </AppBar>
  );
};
