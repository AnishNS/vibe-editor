import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

export default function OutlinedIconButton({
  text = "Delete",
  color = "primary",
  size = "medium",
  fullWidth = false,
  sx = {},
}) {
  return (
    <Button
      variant="outlined"
      color={color}
      size={size}
      fullWidth={fullWidth}
      startIcon={<DeleteIcon />}
      sx={sx}
    >
      {text}
    </Button>
  );
}