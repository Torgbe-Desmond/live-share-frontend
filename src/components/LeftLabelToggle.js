import {
  FormControlLabel,
  Switch,
  styled,
  Typography,
  Box,
} from "@mui/material";

// Optional: make the switch look a bit more modern / iOS-like
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

/**
 * Left-label toggle component
 *
 * @param {object} props
 * @param {string} props.label - Text shown on the left
 * @param {boolean} props.checked - Controlled checked state
 * @param {(checked: boolean) => void} props.onChange - Called when toggled
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.labelPlacement="start"] - usually "start" for left label
 * @param {string} [props.size="medium"] - "small" | "medium"
 */
export default function LeftLabelToggle({
  label,
  checked,
  onChange,
  disabled = false,
  size = "medium",
  ...rest
}) {
  const handleChange = (event) => {
    onChange?.(event.target.checked);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
      }}
    >
      <Typography
        variant="body1"
        color={disabled ? "text.disabled" : "text.primary"}
        sx={{ flex: 1 }}
      >
        {label}
      </Typography>

      <FormControlLabel
        control={
          size === "small" ? (
            <IOSSwitch
              checked={checked}
              onChange={handleChange}
              disabled={disabled}
              size="small"
              {...rest}
            />
          ) : (
            <IOSSwitch
              checked={checked}
              onChange={handleChange}
              disabled={disabled}
              {...rest}
            />
          )
        }
        label={null} // we put label on left manually
        labelPlacement="start"
        componentsProps={{
          typography: { sx: { mr: 2 } },
        }}
        sx={{ m: 0 }}
      />
    </Box>
  );
}
