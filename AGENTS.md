# Nex 0 Agents settings

## Project basics
| Name | Function |
|---|---|
| Stack | NextJS 16 + Supabase |
| Language | TypeScript |
| Compiler | Eslint 9+ |
| Package manager | node + pnpm |

## Project settings
1. **env:**
  ```bash
  SUPABASE_URL=string
  SUPABASE_KEY=string
  ```
2. Commands
  ```bash
  pnpm dev
  pnpm build
  pnpm start
  ```

## Rules
./rules/*

## DON'T - DO
- **DON'T**
  1. **READ / EDIT / DELETE** .env, .env.local, .env.production, .gitignore
  2. **NEVER** make a query in *databases*
  3. **NEVER** commit changes to the repository
  4. **NEVER** push changes to the repository
  5. **NEVER** make changes to the repository

- **DO**
  1. Think - Plan - Build - Verify
  2. Ask when you need
  3. Create code based in developer code
