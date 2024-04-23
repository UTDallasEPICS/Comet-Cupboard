import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";

// navLinks for sideBar
const navLinks = [
  {
    name: "Home",
    icon: HomeIcon,
    link: "/",
  },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  return (
    <Box
      sx={{
        backgroundColor: "161d2f",
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
