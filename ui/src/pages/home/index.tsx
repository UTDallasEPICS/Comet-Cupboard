import { Box, Grid, Typography } from "@mui/material";
import Product from "../../components/product/Product";
import Layout from "../../layout";
import BottomBar from "../../components/bottombar/BottomBar";
import MultipleSelect from "../../components/multiple-select";

const Home = () => {
  return (
    /////////////// CALEB TEST ///////////////////

    <Layout>
      <Box
        sx={{
          padding: 5,
          backgroundColor: "#F5F4F4",
          borderRadius: 2,
          boxShadow: 1,
          border: 2,
          m: 1,
          ml: 2,
        }}
      >
        <Grid container rowSpacing={3} columnSpacing={0}>
          <Grid item xs={12} container justifyContent="center">
            <Typography variant="h4" color='#000000'>Available Items</Typography>
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <MultipleSelect />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/tomato.png"} name={"Tomato"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/banana.png"} name={"Banana"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/beef.png"} name={"Beef"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/carrot.png"} name={"Carrot"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/cheese.png"} name={"Cheese"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/chicken.png"} name={"Chicken"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/cookie.png"} name={"Cookie"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/milk.png"} name={"milk"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/tomato.png"} name={"Tomato"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/banana.png"} name={"Banana"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/beef.png"} name={"Beef"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/carrot.png"} name={"Carrot"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/cheese.png"} name={"Cheese"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/chicken.png"} name={"Chicken"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/cookie.png"} name={"Cookie"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/milk.png"} name={"milk"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/tomato.png"} name={"Tomato"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/banana.png"} name={"Banana"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/beef.png"} name={"Beef"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/carrot.png"} name={"Carrot"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/cheese.png"} name={"Cheese"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/chicken.png"} name={"Chicken"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/cookie.png"} name={"Cookie"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/milk.png"} name={"milk"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/tomato.png"} name={"Tomato"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/banana.png"} name={"Banana"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/beef.png"} name={"Beef"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/carrot.png"} name={"Carrot"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/cheese.png"} name={"Cheese"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/chicken.png"} name={"Chicken"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/cookie.png"} name={"Cookie"} />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Product image={"/images/milk.png"} name={"milk"} />
          </Grid>
        </Grid>
      </Box>
      <BottomBar image={"src/assets/CometCupboard_transparent.png"} />
    </Layout>
  );
};

export default Home;
