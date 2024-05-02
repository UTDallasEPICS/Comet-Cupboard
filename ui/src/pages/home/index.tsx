import styled from "styled-components";
import { Navbar } from "../../components/navbar/Navbar";
import Searchbar from "../../components/searchbar/SearchBar";
import { Box, Grid } from "@mui/material";
import Product from "../../components/product/Product";
import { SideBarNav } from "../../components/sidebar-nav/SideBarNav";
import Layout from "../../layout";
import ItemCard from "../../components/item-card";
// import BottomBar from "../../components/BottomBar";

const Wrapper = styled.div`
  display: flex;
  //
`;
// const ProductWrapper = styled.div`
//   margin-left: 5rem;
//   margin-top: 3rem;
//   display: flex;
// `
const Home = () => {
  return (
    // <Wrapper>
    //   <Navbar />
    //   {/* <Searchbar/> */}
    //   <Box display="flex" sx={{ marginTop: "10vh" }}>
    //     {/* <SideBarNav/> */}
    //     <Grid container spacing={1}>
    //       {/**This is for testing purposes. Do not actually do this.*/}
    //       <Grid item xs={12} sm={6} md={2}>
    //         <Product image={"/images/apple.png"} name={"apple"} />
    //       </Grid>
    //       <Grid item xs={12} sm={6} md={2}>
    //         <Product image={"/images/banana.png"} name={"banana"} />
    //       </Grid>
    //       <Grid item xs={12} sm={6} md={2}>
    //         <Product image={"/images/beef.png"} name={"beef"} />
    //       </Grid>
    //       <Grid item xs={12} sm={6} md={2}>
    //         <Product image={"/images/bread.png"} name={"bread"} />
    //       </Grid>
    //       <Grid item xs={12} sm={6} md={2}>
    //         <Product image={"/images/carrot.png"} name={"carrot"} />
    //       </Grid>
    //       <Grid item xs={12} sm={6} md={2}>
    //         <Product image={"/images/cheese.png"} name={"cheese"} />
    //       </Grid>
    //       <Grid item xs={12} sm={6} md={2}>
    //         <Product image={"/images/chicken.png"} name={"chicken"} />
    //       </Grid>
    //       <Grid item xs={12} sm={6} md={2}>
    //         <Product image={"/images/cookie.png"} name={"cookie"} />
    //       </Grid>
    //       <Grid item xs={12} sm={6} md={2}>
    //         <Product image={"/images/milk.png"} name={"milk"} />
    //       </Grid>
    //       <Grid item xs={12} sm={6} md={2}>
    //         <Product image={"/images/tomato.png"} name={"tomato"} />
    //       </Grid>
    //     </Grid>
    //     {/* <BottomBar/> */}
    //   </Box>
    // </Wrapper>

    // //Header [Searchbar]
    // //Drawer [For Categories]
    // //Grid [Item Cards]
    // //Footer

    // // <Wrapper>

    /////////////// CALEB TEST ///////////////////
    <>
      <Navbar />
      <Layout>
        <Product image={"/images/tomato.png"} name={"tomato"} />
      </Layout>
    </>
  );
};

export default Home;
