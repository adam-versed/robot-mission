# CLAUDE.md - Unit Tests

## Directory Guidelines

This directory contains unit test files for components and domain logic.

## Coding Standards

### Test Structure
- Use AAA pattern: Arrange, Act, Assert
- One assertion per test when possible
- Descriptive test names that explain behavior
- Group related tests in describe blocks

### File Organization
```typescript
// tests/unit/feature/component.test.ts
import { render, screen } from "@testing-library/react"
import { Component } from "@/components/feature/component"

describe("Component", () => {
  describe("when rendering", () => {
    it("should display the title", () => {
      // Arrange
      const title = "Test Title"
      
      // Act
      render(<Component title={title} />)
      
      // Assert
      expect(screen.getByText(title)).toBeInTheDocument()
    })
  })
})
```

### Testing Patterns
- Mock external dependencies
- Test both happy path and edge cases
- Use data-driven tests for multiple scenarios
- Prefer integration over unit tests when practical

### Assertions
- Use specific matchers: `toBeInTheDocument()` vs `toBeTruthy()`
- Test user behavior, not implementation details
- Verify accessibility with screen reader queries

### Biome Linting Guidelines for Tests

#### Array Iteration in Tests (lint/complexity/noForEach)
```typescript
// ❌ Avoid forEach in test loops
const testCases = [{ input: 1, expected: 2 }];
testCases.forEach(({ input, expected }) => {
  expect(transform(input)).toBe(expected);
});

// ✅ Use for...of loops in tests
const testCases = [{ input: 1, expected: 2 }];
for (const { input, expected } of testCases) {
  expect(transform(input)).toBe(expected);
}

// ✅ Or use test.each for parameterized tests
test.each([
  { input: 1, expected: 2 },
  { input: 2, expected: 4 },
])('should transform $input to $expected', ({ input, expected }) => {
  expect(transform(input)).toBe(expected);
});
```

#### Type Safety in Tests (lint/suspicious/noExplicitAny)
```typescript
// ❌ Avoid any types in test helpers
function createMockState(overrides: any) {
  return { ...defaultState, ...overrides };
}

// ✅ Use proper typing in test helpers
function createMockState(overrides: Partial<RobotState>) {
  return { ...defaultState, ...overrides };
}

// ✅ Use unknown for truly dynamic test data
function createMockApiResponse(data: unknown) {
  return { success: true, data };
}
```

#### Import Organization in Tests
```typescript
// ✅ Organize test imports: test utilities first, then source code
import { describe, expect, it } from "vitest";
import { createMockRobot, expectRobotState } from "@/test/robot-test-utils";
import { MarsRobot } from "@/lib/robot-engine/robot";
import { SAMPLE_DATA } from "@/test/sample-data";
```