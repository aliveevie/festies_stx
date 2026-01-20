# Components Documentation

This directory contains reusable React components for the Festies STX application.

## Common Components

### LoadingSpinner
Beautiful animated loading spinner with progress indicators.

### ErrorFallback
Error boundary component with gradient styling and retry functionality.

## UI Components

### Button
Reusable button component with multiple variants (primary, secondary, success, danger, outline, ghost) and sizes.

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `disabled`: boolean
- `icon`: ReactNode
- `iconPosition`: 'left' | 'right'
- `fullWidth`: boolean

### Input
Form input component with validation states and icons.

**Props:**
- `label`: string
- `error`: string
- `success`: string
- `helperText`: string
- `icon`: ReactNode
- `iconPosition`: 'left' | 'right'
- `fullWidth`: boolean

### Card
Card component with hover effects and gradient options.

**Props:**
- `title`: string
- `subtitle`: string
- `footer`: ReactNode
- `hover`: boolean
- `gradient`: boolean

### Modal
Modal dialog component with backdrop and animations.

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `showCloseButton`: boolean

### Tooltip
Tooltip component that displays helpful information on hover.

**Props:**
- `content`: string | ReactNode
- `position`: 'top' | 'bottom' | 'left' | 'right'
- `delay`: number (ms)

### Badge
Status badge component with icons and color variants.

**Props:**
- `variant`: 'default' | 'success' | 'error' | 'warning' | 'info' | 'purple' | 'pink'
- `size`: 'sm' | 'md' | 'lg'
- `icon`: ReactNode

### ProgressBar
Animated progress bar with milestones and color options.

**Props:**
- `progress`: number (0-100)
- `label`: string
- `showPercentage`: boolean
- `color`: 'blue' | 'purple' | 'green' | 'orange'
- `milestones`: array of { position: number, label: string }

### StatsCard
Statistics card with animated numbers and trend indicators.

**Props:**
- `title`: string
- `value`: string | number
- `subtitle`: string
- `icon`: ReactNode
- `trend`: 'up' | 'down' | null
- `trendValue`: string
- `gradient`: string (Tailwind gradient classes)

### NotificationCenter
Notification center component with animated notifications.

**Props:**
- `className`: string

### ThemeToggle
Theme toggle button for switching between light and dark themes.

**Props:**
- `className`: string

## Usage Examples

```jsx
import Button from './components/Button';
import Input from './components/Input';
import Card from './components/Card';

function MyComponent() {
  return (
    <Card title="Example" subtitle="This is a card">
      <Input 
        label="Name" 
        placeholder="Enter your name"
        icon={<FaUser />}
      />
      <Button variant="primary" size="md">
        Submit
      </Button>
    </Card>
  );
}
```
