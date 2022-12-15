import { makeStyles } from "@mui/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

import { Layout } from "components/account";
import { Box, Divider, Typography } from "@mui/material";
import Image from "next/image";
import theme from "src/theme";

export default PasswordResetEmail;

const useStyles = makeStyles(() => ({
  box: {
    padding: "30px 65px",
  },
  card: {
    border: "1px solid #F1F1F1",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    fontFamily: "Roboto",
    fontSize: 14,
  },
  button: {
    top: 8,
  },
}));

function PasswordResetEmail({ user, token, expiry }) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Box className={classes.box}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 0 }}>
            <Image
              src="/img/logo.svg"
              alt="Hero Logo"
              width={107}
              height={107}
            />
          </Box>
          <Box sx={{ textAlign: "center", my: 3, mx: 2 }}>
            <Typography variant="h5">Ressetting your Password</Typography>
            <Typography variant="body2">
              Hi <b>{user.name}</b>, You’ve recently asked to reset the password for
              your HERO account. To update your password please click the button
              below
            </Typography>
            <Typography sx={{ mt: 3, textAlign: "center" }} variant="subtitle1">
              Note: This email will expire in 24hrs.
            </Typography>
            <Button
              variant="contained"
              size="large"
              fullWidth
              color="secondary"
              className={classes.button}
            >
              Reset my password
            </Button>
          </Box>
        </Box>

        <Divider color={theme.palette.divider} />
        <Box className={classes.box}>
          <Typography sx={{ textAlign: "center" }} variant="body2">
            If you didn’t request this, please ignore this email. Your password
            will not change until you access the link above and create a new
            one.
          </Typography>
          <Typography
            component="p"
            sx={{ textAlign: "center" }}
            variant="caption"
            mt={4}
          >
            Copyright © {new Date().getFullYear()}
            <br />
            {window.location.hostname}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
PasswordResetEmail.getLayout = (page) => <Layout>{page}</Layout>;
