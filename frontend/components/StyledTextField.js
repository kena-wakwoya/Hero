import { alpha, styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import theme from "src/theme";

const StyleTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#EC8841',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#EC8841',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'red',
    },
    '&:hover fieldset': {
      borderColor: 'yellow',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#EC8841',
    },
  },
  '& .MuiFilledInput-root': {
    border: "2px solid #FFF",
    overflow: "hidden",
    borderRadius: 0,
    fontWeight: "bold",
    backgroundColor: theme.palette.mode === "light" ? theme.palette.background : "#2b2b2b",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&:hover": {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid",
      borderColor: theme.palette.primary.light,
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `${alpha(theme.palette.primary.light, 0.25)} 0 0 0 1px`,
      borderColor: theme.palette.primary.light,
    },
    "&.Mui-error": {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `${alpha(theme.palette.primary.light, 0.25)} 0 0 0 1px`,
      borderColor: theme.palette.error.main,
    },
  },
});

export default StyleTextField;
