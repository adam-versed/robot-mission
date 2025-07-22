# CLAUDE.md - React Components

## Directory Guidelines

This directory contains reusable React components with TypeScript and Tailwind CSS.

## Coding Standards

### Component Structure
```typescript
// Component template
interface ComponentNameProps {
  children?: React.ReactNode
  className?: string
  // Specific props
}

export function ComponentName({ 
  children,
  className,
  ...props 
}: ComponentNameProps) {
  return (
    <div className={cn("base-classes", className)} {...props}>
      {children}
    </div>
  )
}
```

### TypeScript Rules
- Use interface for props, type for unions/intersections
- Enable React.StrictMode compatibility
- Prefer `React.ReactNode` over `JSX.Element`
- Use discriminated unions for variant props

### UI Components (`ui/` subdirectory)
- Headless, reusable primitives
- Use `cn()` utility for className merging
- Export both named and default exports
- Include forwardRef for DOM elements

### Feature Components (`features/` subdirectory)
- Business logic components
- Can use tRPC hooks and context
- Organize by feature domain
- Keep components focused and single-responsibility

### Tailwind Integration
- Use `cn()` from `lib/utils` for conditional classes
- Follow responsive-first approach: `sm:`, `md:`, `lg:`
- Prefer composition over configuration
- Use CSS variables for theme consistency

### File Naming
- `PascalCase.tsx` for components
- `index.ts` for barrel exports
- Co-locate tests as `ComponentName.test.tsx`