# Cursor Rules Directory

This directory contains Cursor rules for the Freebox project. These rules provide AI assistance with consistent coding patterns, best practices, and project-specific conventions.

## Rule Files

### `project.mdc` - General Project Rules

- **Scope**: All files (`**/*`)
- **Type**: Always Applied
- **Content**: Overall coding standards, file organization, naming conventions, and project structure

### `nextjs.mdc` - Next.js 15 Rules

- **Scope**: `src/app/**/*`, `next.config.ts`, `next-env.d.ts`
- **Type**: Auto Attached
- **Content**: Next.js 15 best practices, App Router patterns, API routes, and performance optimization

### `react.mdc` - React 19 Rules

- **Scope**: `src/components/**/*`, `src/app/**/*.tsx`, `src/lib/**/*.tsx`
- **Type**: Auto Attached
- **Content**: React 19 patterns, hooks best practices, component structure, and performance optimization

### `typescript.mdc` - TypeScript Rules

- **Scope**: `**/*.ts`, `**/*.tsx`
- **Type**: Auto Attached
- **Content**: TypeScript best practices, type safety, code organization, and type definitions

### `prisma.mdc` - Prisma ORM Rules

- **Scope**: `prisma/**/*`, `src/lib/prisma.ts`, `src/app/api/**/*`
- **Type**: Auto Attached
- **Content**: Prisma schema design, database operations, migrations, and error handling

### `tailwind.mdc` - Tailwind CSS Rules

- **Scope**: `src/**/*.tsx`, `src/**/*.css`, `tailwind.config.*`
- **Type**: Auto Attached
- **Content**: Tailwind CSS patterns, component styling, responsive design, and utility organization

### `redux.mdc` - Redux Toolkit Rules

- **Scope**: `src/lib/store.ts`, `src/lib/features/**/*`, `src/app/StoreProvider.tsx`
- **Type**: Auto Attached
- **Content**: Redux Toolkit patterns, state management, slices, selectors, and RTK Query

### `nextauth.mdc` - NextAuth.js Rules

- **Scope**: `src/app/api/auth/**/*`, `src/components/auth-provider.tsx`, `src/lib/auth.ts`
- **Type**: Auto Attached
- **Content**: NextAuth.js configuration, authentication patterns, session management, and route protection

## How to Use

### Automatic Application

Most rules are set to "Auto Attached" and will automatically apply when you're working with files in their respective scopes.

### Manual Application

You can manually reference specific rules using the `@ruleName` syntax in your conversations with Cursor.

### Rule Types

- **Always Applied**: Rules that are always included in the AI context
- **Auto Attached**: Rules that are included when files matching their glob patterns are referenced
- **Agent Requested**: Rules that the AI can decide to include based on relevance
- **Manual**: Rules that are only included when explicitly mentioned

## Adding New Rules

1. Create a new `.mdc` file in this directory
2. Use the proper frontmatter format:
   ```yaml
   ---
   description: Brief description of the rule
   globs: ['path/patterns/**/*']
   alwaysApply: false
   ---
   ```
3. Write your rule content in markdown format
4. Include practical examples and code snippets

## Best Practices

- Keep rules focused and specific to their domain
- Include practical examples and code snippets
- Use clear, actionable language
- Update rules as the project evolves
- Test rules to ensure they provide helpful guidance

## Rule Organization

Rules are organized by technology and concern:

- **Framework-specific**: Next.js, React, TypeScript
- **Database**: Prisma
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Authentication**: NextAuth.js
- **General**: Project-wide conventions

This organization makes it easy to find and maintain rules for specific areas of the codebase.
