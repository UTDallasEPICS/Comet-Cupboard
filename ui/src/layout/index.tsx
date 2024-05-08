import { Box } from "@mui/material";
import { ReactNode } from "react";
import Sidebar from "../components/sidebar";
import { Navbar } from "../components/navbar/Navbar";

interface LayoutProps {
  children: ReactNode;
}

// const Layout = ({ children }: LayoutProps) => {
//   return (
//     <Box
//       sx={{
//         backgroundColor: "#fffff",
//         display: "flex",
//         flexDirection: {
//           xs: "column",
//           lg: "row",
//         },
//         color: "white",
//         padding: 3,
//         gap: 3,
//         overflowY: "hidden",
//         height: "100vh",
//       }}
//     >
//       <Sidebar />
//       <Navbar />
//       <Grid container sx={{ width: "100%", overflowY: "scroll" }}>
//         <Grid item xs={12} sm={6} md={2}>
//           {children}
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

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
        //color: "white",
        overflowY: "hidden",
        height: "100vh",
        marginTop: '10vh',
      }}
    >
      <Navbar />
      <Sidebar />
      <Box sx={{ width: "100%", overflowY: "scroll" }}>{children}</Box>
    </Box>
  );
};

export default Layout;
