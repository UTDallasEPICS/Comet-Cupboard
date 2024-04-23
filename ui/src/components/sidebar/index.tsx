import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";

// navLinks for sideBar
const navLinks = [
  {
    name: "Home",
    icon: HomeIcon, // commet cupboard icon
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
  {
    name: "Household Items",
    icon: HomeIcon,
    link: "/household-items",
  },
  {
    name: "Personal Care",
    icon: HomeIcon,
    link: "/personal-care",
  },
  {
    name: "Fruits",
    icon: HomeIcon,
    link: "/fruits",
  },
  {
    name: "Vegetables",
    icon: HomeIcon,
    link: "/vegetables",
  },
  {
    name: "Refrigerated Items",
    icon: HomeIcon,
    link: "/refrigerated-items",
  },
  {
    name: "Frozen Items",
    icon: HomeIcon,
    link: "/frozen-items",
  },
  {
    name: "Miscellaneous",
    icon: HomeIcon,
    link: "/miscellaneous",
  },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  return (
    <Box
      sx={{
        backgroundColor: "#154734",
        padding: 2,
        borderRadius: 2,
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
    ></Box>
  );
};

export default Sidebar;
