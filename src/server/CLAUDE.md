# CLAUDE.md - tRPC Backend

## Directory Guidelines

This directory contains tRPC server setup, routers, and API procedures.

## Coding Standards

### Router Structure
```typescript
// router/example.ts
import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"

export const exampleRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(10) }))
    .query(({ input }) => {
      // Query logic
      return data
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // Mutation logic
      return result
    }),
})
```

### Input Validation
- Always use Zod schemas for input validation
- Define reusable schemas in `lib/validation`
- Use `.min()`, `.max()`, `.email()` for constraints
- Transform inputs with `.transform()`

### Error Handling
```typescript
import { TRPCError } from "@trpc/server"

throw new TRPCError({
  code: "NOT_FOUND", // BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, etc.
  message: "Resource not found",
})
```

### TypeScript Patterns
- Export router types: `export type AppRouter = typeof appRouter`
- Use `Prisma.ExampleGetPayload<{}>` for complex types
- Leverage tRPC's end-to-end type safety
- Define context types in `trpc.ts`

### Procedure Types
- `publicProcedure`: No authentication required
- `protectedProcedure`: Requires authentication
- Use middleware for common logic (auth, rate limiting)

### Performance
- Implement request batching for multiple calls
- Use database transactions for related operations
- Cache frequently accessed data
- Optimize database queries with proper indexes

### File Organization
- One router per feature domain
- Export all routers in `routers/index.ts`
- Keep procedures focused and single-purpose

### Biome Linting Guidelines for tRPC Backend

#### Import Organization for Server Files
```typescript
// ✅ Standard import order for tRPC routers
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

// ✅ Alternative sorted order (alphabetical by module)
import {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
```

#### Procedure Structure
```typescript
// ✅ Consistent procedure formatting
export const robotRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ 
      limit: z.number().min(1).max(100).default(10),
    }))
    .query(async ({ input }) => {
      // Query logic
      return data;
    }),

  create: publicProcedure
    .input(z.object({ 
      name: z.string().min(1),
      position: z.object({
        x: z.number(),
        y: z.number(),
      }),
    }))
    .mutation(async ({ input }) => {
      // Mutation logic
      return result;
    }),
});
```