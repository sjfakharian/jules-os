## 2026-10-12 - Command Injection in Spawn Fallback
**Vulnerability:** Command injection when invoking `qmd` CLI in environments where its JS entrypoint is unresolvable. The code intentionally joined array arguments and passed them to `shell: true` to suppress a Node 24 warning (DEP0190), exposing unsanitized inputs to the shell.
**Learning:** Developers might introduce severe security flaws (like command injection) as workarounds for warnings designed to prevent those exact flaws (Node.js DEP0190 warns against passing arrays to `shell: true` because they are concatenated unsafely).
**Prevention:** If falling back to single-string shell commands to dodge `DEP0190`, always apply strict platform-aware shell escaping (e.g. `quoteForShell`) before joining arguments.
