import IconButton from "@mui/material/IconButton";
import AlarmIcon from "@mui/icons-material/Alarm";

export default function AlarmIconButton({
  color = "secondary",
  disabled = false,
  size = "medium",
  sx = {},
}) {
  return (
    <IconButton
      aria-label="alarm"
      color={color}
      disabled={disabled}
      size={size}
      sx={sx}
    >
      <AlarmIcon />
    </IconButton>
  );
}