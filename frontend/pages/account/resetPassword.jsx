import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { makeStyles } from "@mui/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

import { Layout } from "components/account";
import { userService, alertService } from "services";
import FormPasswordField from "components/form/Password";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { Link } from "components";

export default ResetPassword;

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
    top: 10,
  },
  reset: {
    float: "right",
    textDecorationLine: "underline",
    marginTop: 7,

    lineHeight: "18px",
    letterSpacing: "0em",
    textAlign: "right",
  },
  login: {
    fontFamily: "Gilroy",
    fontWeight: 700,
    fontSize: 13,
    fontStyle: "normal",
  },
}));

const validationSchema = Yup.object().shape({
  password: Yup.string().required("Password is required"),
  confirm_password: Yup.string().required("Password confirmation is required").oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

const formOptions = { resolver: yupResolver(validationSchema) };

function ResetPassword() {
  const router = useRouter();
  const classes = useStyles();

  const { control, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit({ password }) {
    return userService
      .login(password)
      .then(() => {
        router.push("/account/login");
      })
      .catch(alertService.error);
  }

  return (
    <Card className={classes.card}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Box sx={{ textAlign: "center" }} my={3}>
            <Typography variant="h3">Reset Password</Typography>
            <Typography variant="body1">
              Please enter a new password. To change your current password.
            </Typography>
          </Box>

          <Grid container>
            <Grid item sm={12} md={12} xs={12}></Grid>
            <Grid item xs={12} md={12} xs={12} mt={2}>
              <FormPasswordField
                label="Password"
                fullWidth
                error={errors.password}
                control={control}
                name="password"
              />
            </Grid>
          </Grid>
          <Grid item sm={12} md={12} xs={12} mt={2}>
            <FormPasswordField
              label="Confirm Password"
              fullWidth
              error={errors.confirm_password}
              control={control}
              name="confirm_password"
            />
          </Grid>

          <Button
            variant="contained"
            type="submit"
            disabled={formState.isSubmitting}
            size="large"
            fullWidth
            color="secondary"
            className={classes.button}
          >
            {formState.isSubmitting ? <CircularProgress /> : "Reset password"}
          </Button>
          <Typography
            sx={{ my: 6, textAlign: "center" }}
            variant="body2"
            mt={4}
          >
            I remember my password now.{" "}
            <Link className={classes.login} href="/account/login">
              Log in here
            </Link>
          </Typography>
        </CardContent>
      </form>
    </Card>
  );
}
ResetPassword.getLayout = (page) => <Layout>{page}</Layout>;
