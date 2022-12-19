import { useState } from "react";

import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import { Controller } from "react-hook-form";
import ErrorIcon from "@mui/icons-material/Error";
import { Grid, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import StyleTextField from "../StyledTextField";
import { passwordRules } from "./utils";
import { Callout } from "components/Callout";
import theme from "src/theme";

const FormPasswordField = ({
  name,
  control,
  label,
  fullWidth,
  required,
  error,
  ...rest
}) => {
  const [showPass, setShowPass] = useState(false);

  const handleClickShowPassword = () => {
    setShowPass(!showPass);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Callout
          title={<PasswordRulesList password={value} />}
          placement="bottom-start"
          arrow
        >
          <StyleTextField
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={onChange}
            value={value}
            label={label}
            fullWidth={fullWidth}
            error={error}
            helperText={
              error && (
                <Grid
                  container
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    fontFamily: "Gilroy",
                    fontWeight: 600,
                    fontStyle: "normal",
                    fontSize: 13,
                    marginLeft: 0
                  }}
                >
                  <Grid item md={1}>
                    <ErrorIcon color="error" />
                  </Grid>
                  <Grid item md={11}>
                    {error.message}
                  </Grid>
                </Grid>
              )
            }
            variant="filled"
            type={showPass ? "text" : "password"}
            {...rest}
          />
        </Callout>
      )}
    />
  );
};

const PasswordRulesList = ({ password = "" }) => {
  return (
    <>
      <Typography variant="body1" color={theme.palette.text.primary}>Must contain:</Typography>
      <Grid container>
        {(passwordRules || []).map(({ rule, valid }) => {
          const color = valid(password) && "success";
          return (
            <Grid item md={6} sm={6} xs={12} key={rule} color="success">
              <IconButton variant="text" color={color || "default"}>
                <CheckIcon /> <Typography variant="body2">{rule}</Typography>
              </IconButton>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default FormPasswordField;
