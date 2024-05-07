import styled from "styled-components"
import {Navbar} from "../../components/Navbar";
import Searchbar from "../../components/SearchBar"
import { Box, Grid } from "@mui/material";
import Product from "../../components/Product";
import { SideBarNav } from "../../components/SideBarNav";
import BottomBar from "../../components/BottomBar";

const Wrapper = styled.div`
  display: block;
  width: 100%;
// `
// const ProductWrapper = styled.div`
//   margin-left: 5rem;
//   margin-top: 3rem;
//   display: flex;
// `
const Home = () => {
  return (
    <Wrapper>
      <Navbar/>
      {/* <Searchbar/> */}
      <Box display="block" sx={{marginTop: "10vh"}}>
        {/* <SideBarNav/> */}
        <Grid container spacing={1}>
          {/**This is for testing purposes. Do not actually do this.*/}
          <Grid item xs={12} sm={6} md={2}>
            <Product image={"/images/apple.png"} name={"apple"}/>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Product image={"/images/banana.png"} name={"banana"}/>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Product image={"/images/beef.png"} name={"beef"}/>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Product image={"/images/bread.png"} name={"bread"}/>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Product image={"/images/carrot.png"} name={"carrot"}/>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Product image={"/images/cheese.png"} name={"cheese"}/>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Product image={"/images/chicken.png"} name={"chicken"}/>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Product image={"/images/cookie.png"} name={"cookie"}/>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Product image={"/images/milk.png"} name={"milk"}/>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>        
            <Product image={"/images/tomato.png"} name={"tomato"}/>
          </Grid>
        </Grid>
      </Box>
      <BottomBar image={"../src/assets/CometCupboard_transparent.png"}/>
        
    </Wrapper>

    //Header [Searchbar]
    //Drawer [For Categories]
    //Grid [Item Cards]
    //Footer 
    
  // <Wrapper>
    
  );
};

export default Home;
