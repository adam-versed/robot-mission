# Mars Mission Control System - CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Biome Linting Guidelines (Project-Wide)

This project uses Biome for linting and formatting. These guidelines prevent common linting issues:

### Critical Linting Rules to Follow

#### 1. Static-Only Classes (lint/complexity/noStaticOnlyClass)
**Issue**: Classes containing only static methods
```typescript
// ❌ Avoid - triggers linting error
export class CommandProcessor {
  static isValid(cmd: string) { return true; }
  static process(cmd: string) { /* ... */ }
}

// ✅ Use functions instead
export function isValidCommand(cmd: string) { return true; }
export function processCommand(cmd: string) { /* ... */ }
```

#### 2. Array Iteration (lint/complexity/noForEach)
**Issue**: Performance concerns with forEach in loops
```typescript
// ❌ Avoid forEach for simple iterations
items.forEach(item => console.log(item));
testCases.forEach(({ input, expected }) => {
  expect(fn(input)).toBe(expected);
});

// ✅ Use for...of loops
for (const item of items) {
  console.log(item);
}
for (const { input, expected } of testCases) {
  expect(fn(input)).toBe(expected);
}
```

#### 3. Type Safety (lint/suspicious/noExplicitAny)
**Issue**: Use of `any` type disables type checking
```typescript
// ❌ Never use any
function helper(state: any, data: any) { /* ... */ }

// ✅ Use proper types
function helper(state: RobotState, data: CommandData) { /* ... */ }

// ✅ Use generics for flexibility
function helper<T extends BaseState>(state: T) { /* ... */ }

// ✅ Use unknown for truly dynamic data
function parseApiResponse(response: unknown) { /* ... */ }
```

#### 4. Import Organization (organizeImports)
**Issue**: Unsorted imports cause consistency issues
```typescript
// ❌ Random import order
import { z } from "zod";
import { createTRPCRouter } from "@/server/api/trpc";
import { Button } from "@/components/ui/button";

// ✅ Alphabetical import order
import { Button } from "@/components/ui/button";
import { createTRPCRouter } from "@/server/api/trpc";
import { z } from "zod";
```

#### 5. Tailwind Class Sorting (lint/nursery/useSortedClasses)
**Issue**: Unsorted Tailwind classes
```typescript
// ❌ Random class order
<div className="text-xl text-center max-w-2xl bg-white p-4">

// ✅ Alphabetical class order
<div className="bg-white max-w-2xl p-4 text-center text-xl">
```

### Pre-commit Hooks

This project uses Husky with lint-staged to run:
```bash
# Automatic formatting and validation on commit
biome check --write --unsafe  # Auto-fix issues
biome check                   # Validate formatting  
tsc --noEmit                  # Type check
```

### Running Linting Manually

```bash
# Check for issues
bun run check

# Auto-fix issues (safe fixes only)
bun run check:write

# Auto-fix issues (including unsafe fixes)
bun run check:unsafe

# Type checking
bun run typecheck
```

### Quality Gates (Must Pass)

1. **Lint**: `bun run check` - Zero errors
2. **Type Check**: `bun run typecheck` - Zero type errors  
3. **Build**: `bun run build` - Successful compilation
4. **Tests**: `bun test` - All tests passing

### Directory-Specific Guidelines

- **`/src/lib/`**: See `src/lib/CLAUDE.md` for domain logic patterns
- **`/src/components/`**: See `src/components/CLAUDE.md` for UI component patterns
- **`/tests/`**: Unit tests following AAA pattern with Vitest

### Common Patterns to Remember

1. **Functions over static classes** for utility code
2. **for...of over forEach** for simple iterations  
3. **Explicit types over any** for type safety
4. **Sorted imports** for consistency
5. **Sorted Tailwind classes** for maintainability

Following these guidelines will prevent 95% of the linting issues encountered in this codebase.