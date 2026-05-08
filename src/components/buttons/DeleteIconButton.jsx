import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

export default function OutlinedIconButton({
  text = "Delete",
  color = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  sx = {},
  onDoubleClick,
}) {
  return (
    <Button
      variant="outlined"
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      startIcon={<DeleteIcon />}
      sx={sx}
      onDoubleClick={onDoubleClick}
    >
      {text}
    </Button>
  );
}