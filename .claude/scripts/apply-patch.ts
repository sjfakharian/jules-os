#!/usr/bin/env node

/**
 * apply-patch.ts - Safely applies a textual replacement to a file.
 * 
 * Enforces the "Obsidian Change Review" Week 3 requirement:
 * - Only applies if the search string perfectly matches (guards against drift).
 * - Creates a backup before modifying.
 * - Refuses to act if the search string is missing or ambiguous (multiple matches).
 * 
 * Usage: node apply-patch.ts --file <path> --search <exact_string> --replace <new_string>
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

function parseArgs() {
    const args = process.argv.slice(2);
    const params = { file: '', search: '', replace: '' };
    
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--file' && args[i+1]) params.file = args[++i];
        if (args[i] === '--search' && args[i+1]) params.search = args[++i];
        if (args[i] === '--replace' && args[i+1]) params.replace = args[++i];
    }
    
    const c = {
        reset: '\x1b[0m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        cyan: '\x1b[36m'
    };

    if (!params.file || !params.search || params.replace === undefined) {
        console.error(`${c.cyan}💡 Usage:${c.reset} node apply-patch.ts --file <path> --search <string> --replace <string>`);
        process.exit(1);
    }
    return params;
}

function backupFile(filePath: string): string {
    const root = process.env["CLAUDE_PROJECT_DIR"] ?? ".";
    const backupDir = join(root, '.claude', 'backups');
    if (!existsSync(backupDir)) {
        mkdirSync(backupDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = join(backupDir, `${basename(filePath)}.${timestamp}.bak`);
    
    const content = readFileSync(filePath);
    writeFileSync(backupPath, content);
    return backupPath;
}

function applyPatch() {
    const { file, search, replace } = parseArgs();
    
    const c = {
        reset: '\x1b[0m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        cyan: '\x1b[36m'
    };

    if (!existsSync(file)) {
        console.error(`${c.red}❌ [ERROR] File not found:${c.reset} ${file}`);
        process.exit(1);
    }

    const content = readFileSync(file, 'utf-8');
    
    // Check occurrences
    const occurrences = content.split(search).length - 1;
    
    if (occurrences === 0) {
        console.error(`${c.red}❌ [ERROR] Search string not found in file.${c.reset} The file may have drifted or been edited.\n${c.yellow}Search string:${c.reset} "${search}"`);
        process.exit(1);
    }
    
    if (occurrences > 1) {
        console.error(`${c.red}❌ [ERROR] Ambiguous replacement.${c.reset} Search string found ${occurrences} times. Provide a more specific search string containing surrounding context.`);
        process.exit(1);
    }

    // Safe to replace
    const backupPath = backupFile(file);
    const newContent = content.replace(search, replace);
    writeFileSync(file, newContent, 'utf-8');
    
    console.log(`${c.green}✅ [SUCCESS] Patch applied to${c.reset} ${file}`);
    console.log(`${c.cyan}ℹ️  [INFO] Backup saved to${c.reset} ${backupPath}`);
    console.log(`${c.yellow}ℹ️  [INFO] To rollback, run:${c.reset} cp "${backupPath}" "${file}"`);
}

applyPatch();
