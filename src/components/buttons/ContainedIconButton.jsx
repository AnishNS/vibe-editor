import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

export default function ContainedIconButton({
  text = "Send",
  color = "primary",
  size = "medium",
  fullWidth = false,
  sx = {},
  onDoubleClick,
}) {
  return (
    <Button
      variant="contained"
      color={color}
      size={size}
      fullWidth={fullWidth}
      endIcon={<SendIcon />}
      sx={sx}
      onDoubleClick={onDoubleClick}
    >
      {text}
    </Button>
  );
}