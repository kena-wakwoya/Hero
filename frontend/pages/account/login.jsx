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
import FormTextField from "components/form/Text";
import FormPasswordField from "components/form/Password";
import {
  Alert,
  AlertTitle,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { Link } from "components";
import Image from "next/image";
import LoadingButton from "@mui/lab/LoadingButton";

export default Login;

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
  terms: {
    textAlign: "center",
  },
}));

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const formOptions = { resolver: yupResolver(validationSchema) };

function Login() {
  const router = useRouter();
  const classes = useStyles();

  const { control, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit({ email, password }) {
    console.log({ email, password, errors });
    return userService
      .login(email, password)
      .then(() => {
        // get return url from query parameters or default to '/'
        const returnUrl = router.query.returnUrl || "/";
        router.push(returnUrl);
      })
      .catch(alertService.error);
  }

  console.log(errors);
  return (
    <Card className={classes.card}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 0 }}>
            <Image
              src="/img/logo.svg"
              alt="Hero Logo"
              width={107}
              height={107}
            />
          </Box>

          <Box sx={{ textAlign: "center" }} my={3}>
            <Typography variant="h3">Sign In</Typography>
            <Typography variant="body1">
              Enter your email address and password to access your account
            </Typography>
          </Box>

          <Grid container>
            <Grid item sm={12} md={12} xs={12}>
              {/* <Alert variant="filled" sx={{ display: 'flex'}} severity="error">
              <AlertTitle>Login failed</AlertTitle>
                This is an error alert — check it out!
              </Alert> */}
            </Grid>
            <Grid item xs={12} md={12} xs={12} mt={2}>
              <FormTextField
                label="Email Address"
                error={errors.email}
                fullWidth
                name="email"
                type="email"
                control={control}
              />
            </Grid>
          </Grid>
          <Grid item sm={12} md={12} xs={12} mt={2}>
            <FormPasswordField
              label="Password"
              fullWidth
              error={errors.email}
              control={control}
              name="password"
            />
          </Grid>

          <Link className={classes.reset} href="/account/forgotPassword">
            Forgot Password?
          </Link>
          <LoadingButton
            variant="contained"
            type="submit"
            loading={formState.isSubmitting}
            size="large"
            fullWidth
            color="secondary"
            className={classes.button}
          >
            Login
          </LoadingButton>
          <Typography variant="body1" mt={4} className={classes.terms}>
            By continuing, you agree to our{" "}
            <Link href="/">Terms of Service.</Link>
          </Typography>
          <Typography variant="body1" className={classes.terms}>
            Read our <Link href="/">Privacy Policy.</Link>
          </Typography>
        </CardContent>
      </form>
    </Card>
  );
}
Login.getLayout = (page) => <Layout>{page}</Layout>;
