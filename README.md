# Mars Mission Control System

A TypeScript implementation of the Red Badger coding challenge that simulates Mars robot mission control with intelligent collision avoidance.

## 🎯 Challenge Requirements Met

- ✅ **Robot Movement**: L/R rotation and F forward movement with N/S/E/W orientation
- ✅ **Grid System**: Rectangular coordinate system with (0,0) bottom-left origin
- ✅ **Lost Robot Detection**: Off-grid robots marked as LOST with scent protection
- ✅ **Sequential Processing**: Robots processed in order with scent sharing
- ✅ **Extensible Commands**: Command pattern architecture for future command types
- ✅ **Input/Output Format**: Exact Red Badger format parsing and output generation
- ✅ **Comprehensive Testing**: 39 unit tests covering key functionality mentioned in test script, sample data and edge cases

## 🚀 Quick Start

**Live Demo**: https://robot-mission.vercel.app/

**Local Development**:

```bash
git clone <repository>
cd robot-mission
bun install
bun run dev
```

## 📋 Sample Input/Output

**Input**:

```
5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL
```

**Output**:

```
1 1 E
3 3 N LOST
2 3 S
```

## 🏗️ Architecture

**Tech Stack**: Next.js 15, React 19, TypeScript 5.8, Tailwind CSS v4, Vitest
**Structure**: Domain-driven design with separated core logic (`src/lib/`) and UI (`src/components/`)
**Quality**: Biome linting, pre-commit hooks, type safety with Zod validation

## 🧪 Testing & Development

```bash
bun test              # Run tests
bun run build         # Build for production
bun run check         # Lint and format
bun run typecheck     # Type checking
```
