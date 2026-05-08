import Button from '@mui/material/Button';

/**
 * OutlinedDisabledButton - Single Disabled Material UI Outlined Button
 * 
 * Renders a single disabled outlined button variant for the builder.
 * Supports comprehensive styling and layout properties.
 * 
 * @component
 * @example
 * <OutlinedDisabledButton text="Disabled" color="primary" size="medium" padding="8px 16px" />
 */
export default function OutlinedDisabledButton({
  text = 'Disabled Button',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  padding = '8px 16px',
  margin = '0px',
  fontSize = '14px',
  fontWeight = '600',
  border = '1px solid',
  borderRadius = '4px',
  backgroundColor = '',
  textColor = '',
  boxShadow = 'none',
  sx = {},
}) {
  return (
    <Button
      variant="outlined"
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled
      sx={{
        textTransform: 'none',
        fontWeight: fontWeight,
        padding: padding,
        margin: margin,
        fontSize: fontSize,
        border: border,
        borderRadius: borderRadius,
        backgroundColor: backgroundColor || undefined,
        color: textColor || undefined,
        boxShadow: boxShadow,
        ...sx,
      }}
    >
      {text}
    </Button>
  );
}
