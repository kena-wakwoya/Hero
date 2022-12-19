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
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { Link } from "components";

export default ForgotPassword;

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
  login: {
    fontFamily: "Gilroy",
    fontWeight: 700,
    fontSize: 13,
    fontStyle: "normal",
  },
}));

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required("Email field cannot be empty"),
});

const formOptions = { resolver: yupResolver(validationSchema) };

function ForgotPassword() {
  const router = useRouter();
  const classes = useStyles();

  const { control, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit({ email, password }) {
    console.log({ email, errors });
    return userService
      .login(email, password)
      .then(() => {
        const returnUrl = router.query.returnUrl || "/";
        router.push(returnUrl);
      })
      .catch(alertService.error);
  }

  return (
    <Card className={classes.card}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Box sx={{ textAlign: "center" }} my={3}>
            <Typography variant="h4">Forgot your password</Typography>
            <Typography variant="body1">
              We will email you instructions on how to reset your password.
            </Typography>
          </Box>
          <Grid container>
            <Grid item xs={12} md={12} xs={12}>
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

          <Button
            variant="contained"
            type="submit"
            disabled={formState.isSubmitting}
            size="large"
            fullWidth
            color="secondary"
            className={classes.button}
          >
            {formState.isSubmitting ? <CircularProgress /> : 'Reset password'}
            
          </Button>
          <Typography sx={{ my: 6, textAlign: 'center' }} variant="body2" mt={4}>
            I remember my password now. <Link className={classes.login} href="/account/login">Log in here</Link>
          </Typography>
        </CardContent>
      </form>
    </Card>
  );
}
ForgotPassword.getLayout = (page) => <Layout>{page}</Layout>;
