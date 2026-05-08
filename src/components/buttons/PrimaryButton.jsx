import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

/**
 * PrimaryButton - Reusable Material UI Contained Button Group Component
 * 
 * A professional wrapper component that renders a group of contained buttons
 * with support for primary, disabled, and link states.
 * 
 * Designed for:
 * - Builder architecture
 * - Dynamic prop editing
 * - Drag/drop integration
 * - Code generation
 * - Inspector panel
 * 
 * @component
 * @example
 * <PrimaryButton
 *   primaryText="Save"
 *   disabledText="Processing"
 *   linkText="Learn More"
 *   direction="row"
 *   spacing={2}
 *   color="primary"
 *   fullWidth={false}
 *   showPrimary={true}
 *   showDisabled={true}
 *   showLink={true}
 *   linkHref="/docs"
 * />
 */
export default function PrimaryButton({
  // Button texts
  primaryText = 'Contained',
  disabledText = 'Disabled',
  linkText = 'Link',

  // Layout props
  direction = 'row',
  spacing = 2,

  // Button styling
  color = 'primary',
  fullWidth = false,

  // Visibility toggles
  showPrimary = true,
  showDisabled = true,
  showLink = true,

  // Link props
  linkHref = '#',

  // Custom styling
  sx = {},
}) {
  return (
    <Stack
      direction={direction}
      spacing={spacing}
      sx={{
        width: fullWidth ? '100%' : 'auto',
        ...sx,
      }}
    >
      {/* Primary Contained Button */}
      {showPrimary && (
        <Button
          variant="contained"
          color={color}
          fullWidth={fullWidth}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {primaryText}
        </Button>
      )}

      {/* Disabled Contained Button */}
      {showDisabled && (
        <Button
          variant="contained"
          disabled
          fullWidth={fullWidth}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {disabledText}
        </Button>
      )}

      {/* Link Contained Button */}
      {showLink && (
        <Button
          variant="contained"
          href={linkHref}
          fullWidth={fullWidth}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {linkText}
        </Button>
      )}
    </Stack>
  );
}
