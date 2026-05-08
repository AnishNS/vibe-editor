import IconButton from "@mui/material/IconButton";
import AlarmIcon from "@mui/icons-material/Alarm";

export default function AlarmIconButton({
  text = "Alarm",
  color = "secondary",
  disabled = false,
  size = "medium",
  sx = {},
  onDoubleClick,
}) {
  return (
    <IconButton
      aria-label="alarm"
      color={color}
      disabled={disabled}
      size={size}
      sx={sx}
      onDoubleClick={onDoubleClick}
      title={text}
    >
      <AlarmIcon />
    </IconButton>
  );
}