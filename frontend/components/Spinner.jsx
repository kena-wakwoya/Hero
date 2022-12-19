import { Box, CircularProgress } from "@mui/material";

export { Spinner };

function Spinner() {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
}
