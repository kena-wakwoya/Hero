import StyleTextField from "components/StyledTextField";
import { Controller } from "react-hook-form";
import ErrorIcon from "@mui/icons-material/Error";
import { Grid } from "@mui/material";

const FormTextField = ({
  name,
  type,
  label,
  variant = "filled",
  control,
  fullWidth,
  required,
  error,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <StyleTextField
          InputProps={{ disableUnderline: true }}
          onChange={onChange}
          value={value}
          label={label}
          fullWidth={fullWidth}
          error={error}
          type={type}
          variant={variant}
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
          {...rest}
        />
      )}
    />
  );
};

export default FormTextField;
