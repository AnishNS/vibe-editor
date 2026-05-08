import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

export default function OutlinedButtonGroup({
  firstText = "One",
  secondText = "Two",
  thirdText = "Three",

  color = "primary",
  size = "medium",
  orientation = "horizontal",

  sx = {},
}) {
  return (
    <ButtonGroup
      variant="outlined"
      color={color}
      size={size}
      orientation={orientation}
      sx={sx}
    >
      <Button>{firstText}</Button>
      <Button>{secondText}</Button>
      <Button>{thirdText}</Button>
    </ButtonGroup>
  );
}