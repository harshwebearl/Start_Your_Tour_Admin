/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================
*/

import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";

export default styled(Drawer)(({ theme, ownerState }) => {
  const { boxShadows, functions, transitions, breakpoints } = theme;
  const { openConfigurator } = ownerState;

  const { lg } = boxShadows;
  const { pxToRem } = functions;

  return {
    "& .MuiDrawer-paper": {
      height: "100vh",
      margin: 0,
      padding: `0 ${pxToRem(10)}`,
      borderRadius: 0,
      boxShadow: lg,
      overflowY: "auto",
      width: pxToRem(360),
      right: 0,
      left: "initial",
      transition: transitions.create("right", {
        easing: transitions.easing.sharp,
        duration: transitions.duration.short,
      }),

      ...(openConfigurator
        ? { right: 0 }
        : { right: pxToRem(-350) }),

      // ✅ Responsive fix for small screens
      [breakpoints.down("sm")]: {
        width: pxToRem(280), // 👈 Smaller drawer on xs screens
        ...(openConfigurator
          ? { right: 0 }
          : { right: pxToRem(-270) }),
      },
    },
  };
});
