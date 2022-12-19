import { useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Container } from "@mui/material";

import { userService } from "services";

export { Layout };

function Layout({ children }) {
  const router = useRouter();

  useEffect(() => {
    // redirect to home if already logged in
    if (userService.userValue) {
      router.push("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      component="main"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
      }}
    >
      <Container maxWidth="sm">{children}</Container>
    </Box>
  );
}
