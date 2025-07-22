# CLAUDE.md - Utilities & Domain Logic

## Directory Guidelines

This directory contains utilities, types, constants, and core domain logic.

## Coding Standards

### File Organization
- `utils.ts`: General utility functions (`cn`, `formatDate`, etc.)
- `types.ts`: Shared TypeScript definitions
- `constants.ts`: Application constants
- Feature domains: `robot-engine/`, `grid/`, `commands/`

### Utility Functions
```typescript
// Pure functions only
export function calculateDistance(
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  )
}

// Use proper TypeScript generics
export function isNotNull<T>(value: T | null | undefined): value is T {
  return value != null
}
```

### Domain Logic Patterns
```typescript
// Use classes for stateful domain objects
export class Robot {
  constructor(
    private position: Position,
    private orientation: Orientation
  ) {}

  public move(command: Command): Result<Robot, Error> {
    // Domain logic here
    return Result.ok(new Robot(newPosition, this.orientation))
  }
}

// Use Result type for error handling
export type Result<T, E> = 
  | { success: true; data: T }
  | { success: false; error: E }
```

### TypeScript Rules
- Use strict typing: no `any` types
- Define discriminated unions for state
- Use `readonly` for immutable data structures
- Leverage branded types for domain primitives

### Biome Linting Guidelines

#### Static-Only Classes (lint/complexity/noStaticOnlyClass)
```typescript
// ❌ Avoid classes with only static methods
export class Utils {
  static formatDate() { /* ... */ }
  static parseDate() { /* ... */ }
}

// ✅ Use simple functions instead
export function formatDate() { /* ... */ }
export function parseDate() { /* ... */ }
```

#### Array Iteration (lint/complexity/noForEach)
```typescript
// ❌ Avoid forEach for simple iterations
items.forEach(item => {
  console.log(item);
});

// ✅ Use for...of loops
for (const item of items) {
  console.log(item);
}

// ✅ forEach is acceptable for side effects with complex logic
items.forEach((item, index) => {
  complexSideEffectOperation(item, index);
});
```

#### Type Safety (lint/suspicious/noExplicitAny)
```typescript
// ❌ Never use any type
function processData(data: any) { /* ... */ }

// ✅ Use proper typing or generics
function processData<T>(data: T): ProcessedData<T> { /* ... */ }
function processRobotState(state: RobotState) { /* ... */ }
```

#### Import Organization (organizeImports)
```typescript
// ❌ Unsorted imports
import { z } from "zod";
import { createTRPCRouter } from "@/server/api/trpc";
import { Button } from "@/components/ui/button";

// ✅ Alphabetically sorted imports
import { Button } from "@/components/ui/button";
import { createTRPCRouter } from "@/server/api/trpc";
import { z } from "zod";
```

### Constants Organization
```typescript
// Group by domain
export const ROBOT_CONFIG = {
  MAX_GRID_SIZE: 50,
  VALID_ORIENTATIONS: ['N', 'S', 'E', 'W'] as const,
} as const

// Use const assertions for type safety
export type Orientation = typeof ROBOT_CONFIG.VALID_ORIENTATIONS[number]
```

### Testing Strategy
- Pure functions are easily testable
- Use dependency injection for testability
- Mock external dependencies
- Test error conditions explicitly