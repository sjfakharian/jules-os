#!/usr/bin/env node
/**
 * CLI for markdown section character counting.
 *
 * Usage: node --experimental-strip-types charcount.ts <file> <section> [subsection] [limit]
 *
 * Examples:
 *   charcount.ts review.md "Project Name"                    → 847
 *   charcount.ts review.md "Project Name" "" 1000            → 847/1000 ✓
 *   charcount.ts review.md "Project Name" "" 500             → 847/500 ✗ (over by 347)
 *   charcount.ts review.md "Competency Name" "Current Level" 1000
 */

import { readFileSync, existsSync } from "node:fs";
import { countSection, formatResult } from "./lib/charcount.ts";

const [, , file, section, subArg, limitArg] = process.argv;

if (!file || !section) {
	process.stderr.write(
		'\x1b[33mUsage: charcount.ts <file> "Section Header" [subsection] [limit]\x1b[0m\n',
	);
	process.stderr.write('\x1b[90m  subsection: use "" to skip when passing a limit\x1b[0m\n');
	process.exit(1);
}

if (!existsSync(file)) {
	process.stderr.write(`\x1b[31mFile not found: ${file}\x1b[0m\n`);
	process.exit(1);
}

const sub = subArg ? subArg : undefined;
const limit = limitArg ? Number(limitArg) : undefined;

if (limit !== undefined && (!Number.isFinite(limit) || limit < 0)) {
	process.stderr.write(`\x1b[31mInvalid limit: ${limitArg}\x1b[0m\n`);
	process.exit(1);
}

const content = readFileSync(file, { encoding: "utf-8" });
const count = countSection(content, sub ? { section, sub } : { section });
const result = formatResult(count, limit);
process.stdout.write(result.output + "\n");
process.exit(result.ok ? 0 : 1);
