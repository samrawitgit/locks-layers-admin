import { styled } from "@mui/material/styles";
import { FormGroup, Input, Button, InputLabel } from "@mui/material";

export const StyledFormGroup = styled(FormGroup)`
  max-width: "300px";
`;

export const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 500,
  marginBottom: "0.25rem",
}));

export const StyledInput = styled(Input)(({ theme }) => ({
  marginBottom: "0.5rem",
  input: {
    background: theme.palette.primary.main,
    width: "100%",
    fontSize: "1rem",
    padding: "0.5rem 1rem",
    color: theme.palette.primary.contrastText,
    display: "block",
    borderRadius: "0.5rem",
    /*":autofill": {
      background: theme.palette.primary.main,
    },
    ":-webkit-autofill": {
      background: theme.palette.primary.main,
    },*/
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  width: "100%",
  alignItems: "center",
  backgroundColor: theme.palette.primary.light,
  borderColor: "rgba(0,0,0,.1)",
  borderRadius: 5,
  color: theme.palette.primary.contrastText,
  display: "flex",
  fontSize: "1.1rem",
  fontWeight: 500,
  justifyContent: "center",
  margin: " 0 0 0.75rem",
  minHeight: "62px",
  padding: "0.75rem 1rem",
  position: "relative",
  transition: "all .1s ease-in-out",
}));
