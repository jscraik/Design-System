# Desktop App (Tauri)

This is the canonical location for the desktop shell.

## Status

Deferred. The desktop shell is intentionally **not** scaffolded yet, and workspace scripts
return a non-zero exit to prevent treating this as a runnable target.

## Next steps (when ready to resume)

1. Scaffold a Tauri + Vite app (adds `src-tauri/`, `src/`, and runtime deps).
2. Update the workspace build/dev scripts to point at the new entrypoints.
3. Replace the placeholder scripts in `package.json` with real `tauri` commands.
