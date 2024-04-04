
import { styled } from "@mui/material/styles";
import { TextField, Typography } from "@mui/material";

const CustomTextFieldStyled = styled(TextField)(({ theme }) => ({
  "& input[type=number]": {
    "-moz-appearance": "textfield",
  },
  "& input[type=number]::-webkit-outer-spin-button": {
    "-webkit-appearance": "none",
    margin: 0,
  },
  "& input[type=number]::-webkit-inner-spin-button": {
    "-webkit-appearance": "none",
    margin: 0,
  },
  "& .MuiOutlinedInput-input": {
    padding: "9px 13px",
    fontSize: "0.8rem",
    color: "rgb(38, 38, 38)",
  },

  "& .MuiOutlinedInput-input::-webkit-input-placeholder": {
    color: "#767e89",
    opacity: "1",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: `${
      theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "#dee3e9"
    }`,
    borderRadius: "5px",
  },
  "& .MuiOutlinedInput-input.Mui-disabled": {
    backgroundColor: `${
      theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.12) " : "#f8f9fb "
    }`,
  },
  "& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder": {
    color: "#767e89",
    opacity: "1",
  },
}));

export const CustomTextField = (props) => {
  const { readOnlyMode = false, ...rest } = props;

  if (readOnlyMode) {
    return (
      <Typography variant="body1" padding={1} fontSize={"0.8rem"}>
        <>{props.value || "--"}</>
      </Typography>
    );
  }

  return <CustomTextFieldStyled {...rest} />;
};
