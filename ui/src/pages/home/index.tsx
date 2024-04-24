import React from "react";
import Layout from "../../layout";
import BottomBar from "../../components/BottomBar"
import image from "../../assets/CometCupboard_transparent.png"
import styled from "styled-components"
import Product from "../../components/Product"
import Testimg from "../../assets/CometCupboard_transparent_orange.png"
const Wrapper = styled.div`
  display: flex;
`
const ProductWrapper = styled.div`
  margin-left: 5rem;
  margin-top: 3rem;
  display: flex;
`
const Home = () => {
  return (
  <Wrapper>
    <BottomBar image={image} />
    <Layout>Home</Layout>
    <ProductWrapper>
    <Product image={Testimg} name="item1"></Product>
    </ProductWrapper>
  </Wrapper>
  );
};

export default Home;
