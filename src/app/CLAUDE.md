# CLAUDE.md - Next.js 15 App Router

## Directory Guidelines

This directory contains Next.js 15 App Router pages and API routes.

## Coding Standards

### File Structure
- Use file-based routing: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- Group related routes in folders with `(groupName)` for organization
- Place API routes in `api/` subdirectories

### Component Patterns
```typescript
// page.tsx - Server Component by default
export default async function PageName() {
  // Direct data fetching
  const data = await fetchData()
  
  return <div>{/* JSX */}</div>
}

// layout.tsx - Shared layout
export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
```

### TypeScript Rules
- Use strict TypeScript: `"use client"` only when necessary
- Server Components: async functions, direct DB access
- Client Components: interactive features, hooks, browser APIs
- Export metadata for SEO: `export const metadata: Metadata = {}`

### Performance
- Leverage React Server Components (RSC) by default
- Use `loading.tsx` for instant loading states
- Implement `error.tsx` for error boundaries
- Optimize images with `next/image`

### File Naming
- `kebab-case` for directories
- `PascalCase` for component files
- Use route groups `(auth)` for organization without affecting URL structure

### Biome Linting Guidelines for App Router

#### Tailwind Class Sorting (lint/nursery/useSortedClasses)
```typescript
// ❌ Unsorted Tailwind classes
<div className="text-xl text-center max-w-2xl">

// ✅ Sorted Tailwind classes (alphabetical order)
<div className="max-w-2xl text-center text-xl">
```

#### String Formatting in JSX
```typescript
// ❌ Long strings causing formatter issues
<p>
  Welcome to the Mars Mission Control System. 
  Manage robot deployments, execute exploration missions, 
  and track the status of your Mars fleet.
</p>

// ✅ Proper string handling for formatter
<p>
  Welcome to the Mars Mission Control System. Manage robot deployments,
  execute exploration missions, and track the status of your Mars fleet.
</p>

// ✅ For strings with intentional spacing
<span>Mars <span className="text-accent">Mission</span>{" "}Control</span>
```

#### Import Organization for App Router
```typescript
// ✅ Standard import order for pages
import { Metadata } from "next";
import { HydrateClient } from "@/trpc/server";
import { Button } from "@/components/ui/button";
import { RobotPanel } from "@/components/features/robot-control/panel";
```