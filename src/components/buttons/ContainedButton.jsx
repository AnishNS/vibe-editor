import Button from '@mui/material/Button';

/**
 * ContainedButton - Single Material UI Contained Button
 * 
 * Renders a single contained button variant for the builder.
 * Supports comprehensive styling and layout properties.
 * 
 * @component
 * @example
 * <ContainedButton text="Click Me" color="primary" size="medium" padding="8px 16px" />
 */
export default function ContainedButton({
  text = 'Contained Button',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  padding = '8px 16px',
  margin = '0px',
  fontSize = '14px',
  fontWeight = '600',
  border = 'none',
  borderRadius = '4px',
  backgroundColor = '',
  textColor = '',
  boxShadow = 'none',
  sx = {},
}) {
  return (
    <Button
      variant="contained"
      color={color}
      size={size}
      fullWidth={fullWidth}
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
