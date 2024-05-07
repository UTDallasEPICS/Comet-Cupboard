import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import { useLocation, Link } from "react-router-dom";
import { Box, Hidden, Typography } from "@mui/material";

// navLinks for sideBar
const navLinks = [
  {
    name: "Home",
    icon: HomeIcon,
    link: "/",
  },
  {
    name: "Pantry Staples",
    icon: HomeIcon,
    link: "/pantry-staples",
  },
  {
    name: "Snacks",
    icon: HomeIcon,
    link: "/snacks",
  },
  {
    name: "Grains",
    icon: HomeIcon,
    link: "/grains",
  },
  {
    name: "Breakfast Grains",
    icon: HomeIcon,
    link: "/breakfast-grains",
  },

  {
    name: "Soup",
    icon: HomeIcon,
    link: "/soup",
  },
  {
    name: "Protien",
    icon: HomeIcon,
    link: "/protien",
  },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  return (
    <Box
      sx={{
        backgroundColor: "#154734",
        padding: 2,
        borderRadius: 0,
        display: "flex",
        flexDirection: {
          xs: "row",
          lg: "column",
        },
        alignItems: "center",
        justifyContent: "space-between",
        width: {
          sm: "100%",
          lg: 200,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "row",
            lg: "column",
          },
          gap: 5,
          alignItems: {
            xs: "center",
            lg: "start",
          },
          width: "100%",
        }}
      >
        <Box
          sx={{
            py: {
              xs: "0px",
              lg: "16px",
            },
            display: "flex",
            flexDirection: {
              xs: "row",
              lg: "column",
            },
            gap: 4,
          }}
        >
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              style={{ textAlign: "center", textDecoration: "none" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  color: "white",
                  textDecoration: "none",
                }}
              >
                <Hidden mdDown>
                  <Typography align="center">{item.name}</Typography>
                </Hidden>
              </Box>
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
