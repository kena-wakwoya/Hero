import React from 'react'
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const Callout = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.background.paper,
    boxShadow:
      "0px 0px 4px rgba(0, 0, 0, 0.04), 0px 4px 32px rgba(0, 0, 0, 0.16)",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: "60%",
    backgroundColor: theme.palette.background.paper,
    boxShadow:
      "0px 0px 4px rgba(0, 0, 0, 0.04), 0px 4px 32px rgba(0, 0, 0, 0.16)",
  },
}));

export { Callout };