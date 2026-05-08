import Button from '@mui/material/Button';

/**
 * OutlinedLinkButton - Single Link Material UI Outlined Button
 * 
 * Renders a single link outlined button variant for the builder.
 * Supports comprehensive styling and layout properties.
 * 
 * @component
 * @example
 * <OutlinedLinkButton text="Help" href="/help" color="primary" size="medium" padding="8px 16px" />
 */
export default function OutlinedLinkButton({
  text = 'Link Button',
  href = '#',
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
      href={href}
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
