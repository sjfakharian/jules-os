## 2024-10-17 - CLI output readability as UX
**Learning:** In a CLI-only environment like Jules-OS, Developer Experience (DX) essentially acts as the user experience (UX). Plain text outputs from scripts are hard to scan and can lead to important information (like rollbacks or errors) being missed.
**Action:** Always prefer native ANSI escape codes (e.g., \x1b[36m, \x1b[0m) combined with clear emojis to improve scannability of terminal outputs. This enhances the interface without introducing external dependencies like chalk.
