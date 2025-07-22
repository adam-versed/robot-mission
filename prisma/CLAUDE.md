# CLAUDE.md - Prisma Database

## Directory Guidelines

This directory contains Prisma schema, migrations, and database configuration.

## Coding Standards

### Schema Structure
```prisma
// schema.prisma
model Robot {
  id        String   @id @default(cuid())
  name      String
  position  Position
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  missions Mission[]

  @@map("robots")
}
```

### Naming Conventions
- Models: `PascalCase` (singular): `Robot`, `Mission`
- Fields: `camelCase`: `createdAt`, `robotId`
- Database tables: `snake_case` via `@@map("robot_missions")`
- Enums: `PascalCase` values: `enum Status { ACTIVE, INACTIVE }`

### TypeScript Integration
```typescript
// Use generated types
import type { Robot, Prisma } from "@prisma/client"

// Complex queries with GetPayload
export type RobotWithMissions = Prisma.RobotGetPayload<{
  include: { missions: true }
}>

// Partial types for updates
export type RobotUpdate = Prisma.RobotUpdateInput
```

### Migration Best Practices
- Always review generated migrations before applying
- Use descriptive migration names
- Test migrations on development data first
- Keep migrations atomic and reversible

### Database Operations
```typescript
// Use transactions for related operations
await prisma.$transaction([
  prisma.robot.create({ data: robotData }),
  prisma.mission.create({ data: missionData }),
])

// Leverage Prisma's type safety
const robots = await prisma.robot.findMany({
  where: { status: "ACTIVE" },
  include: { missions: { take: 5 } },
})
```

### Performance Optimization
- Use `select` to fetch only required fields
- Implement proper indexing with `@@index`
- Use connection pooling for production
- Monitor query performance with Prisma metrics

### Environment Configuration
- Use `DATABASE_URL` environment variable
- Separate development/production databases
- Implement proper backup strategies