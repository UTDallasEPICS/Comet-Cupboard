import { Box, Grid } from "@mui/material";
import { ReactNode } from "react";
import Sidebar from "../components/sidebar";
import { Navbar } from "../components/navbar/Navbar";
import styled from "styled-components";

interface LayoutProps {
  children: ReactNode;
}

const Wrapper = styled.div`
  display: flex;
  //
`;

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "#fffff",
        display: "flex",
        flexDirection: {
          xs: "column",
          lg: "row",
        },
        color: "white",
        padding: 3,
        gap: 3,
        overflowY: "hidden",
        height: "100vh",
      }}
    >
      <Sidebar />
      <Grid container sx={{ width: "100%", overflowY: "scroll" }}>
        <Grid item xs={12} sm={6} md={2}>
          {children}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Layout;
