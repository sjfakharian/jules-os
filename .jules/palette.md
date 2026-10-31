## 2024-10-17 - CLI output readability as UX
**Learning:** In a CLI-only environment like Jules-OS, Developer Experience (DX) essentially acts as the user experience (UX). Plain text outputs from scripts are hard to scan and can lead to important information (like rollbacks or errors) being missed.
**Action:** Always prefer native ANSI escape codes (e.g., \x1b[36m, \x1b[0m) combined with clear emojis to improve scannability of terminal outputs. This enhances the interface without introducing external dependencies like chalk.

## 2024-10-18 - Native ANSI Escape Codes for CLI UX
**Learning:** For a minimal-dependency Node.js environment like `.claude/scripts/`, using third-party libraries like `chalk` for terminal output styling is unnecessary and adds overhead. Native ANSI escape codes (e.g., `\x1b[36m` for cyan, `\x1b[0m` for reset) work perfectly well for coloring CLI output.
**Action:** Always prefer native ANSI escape codes when adding colors and styling to terminal outputs in this project's CLI scripts to maintain the zero-dependency runtime while improving the Developer Experience (DX).

## 2024-11-20 - Safe ANSI styling for CLI UX
**Learning:** Hardcoding raw ANSI color codes (`\x1b[36m`, etc.) without checking if the output is a terminal (`process.stdout.isTTY` / `process.stderr.isTTY`) is an anti-pattern. If the output of a CLI script is piped, redirected, or consumed by an AI agent, the ANSI escape sequences will pollute the text and break downstream parsing.
**Action:** When applying native ANSI escape codes for CLI output styling, always conditionally apply them using `isTTY` checks to ensure raw text is used when output is not directed to an interactive terminal.
