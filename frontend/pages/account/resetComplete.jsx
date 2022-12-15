import Image from "next/image";
import { makeStyles } from "@mui/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

import { Layout } from "components/account";
import { Box, Typography } from "@mui/material";
import { Link } from "components";

export default ResetComplete;

const useStyles = makeStyles(() => ({
  card: {
    border: "1px solid #F1F1F1",
    boxSizing: "border-box",
    padding: "30px 65px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    top: 20,
  },
}));

function ResetComplete() {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 0 }}>
          {/* <Image src="/img/done.svg" alt="Hero Logo" width={107} height={107} /> */}
        </Box>
        <Box sx={{ textAlign: "center" }} my={3}>
          <Typography variant="h4">Password Reset</Typography>
          <Typography variant="body1">
            We’ve sent you a password reset link to your email address.
            <Typography variant="body1" color="primary">
              user@email.com
            </Typography>
          </Typography>
          <Button size="small" color="inherit" variant="outlined">
            Open email app
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
ResetComplete.getLayout = (page) => <Layout>{page}</Layout>;
