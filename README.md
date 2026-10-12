# Obsidian Change Review

**Knowledge Change Control for Markdown Vaults.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/sjfakharian/obsidian-jules/actions/workflows/ci.yml/badge.svg)](https://github.com/sjfakharian/obsidian-jules/actions/workflows/ci.yml)
[![Status: Experimental](https://img.shields.io/badge/status-experimental-orange.svg)](docs/PROJECT_STATUS.md)

When a critical decision, policy, or technical fact changes, how do you know which notes in your personal vault are now obsolete? 

**Obsidian Change Review** is a focused tool for engineers and knowledge workers who need to safely propagate changes across an Obsidian Markdown vault. It finds outdated claims, proposes specific structural updates, and strictly protects historical records (like past meeting notes) from being overwritten or falsified.

## Core Philosophy

We believe that **"automating low-value work just scales its low value."** We also know that increasing the number of AI agents doesn't inherently make a system smarter—it just increases the error surface.

This project is built on three fundamental constraints:
1. **Detect, Don't Write (Yet):** The agent identifies contradictory claims and produces a structured review queue (Candidate ➡️ Reason ➡️ Proposed Fix). The user decides what to accept.
2. **History is Sacred:** Notes in `archive/`, `meetings/`, or notes with dates in their filenames are classified as `HISTORICAL`. If they assert a now-obsolete fact, that fact must be preserved as "what was believed at the time." History must never be rewritten to match today's truth.
3. **Semantic + Literal Search:** It combines exact string matching (Grep) with semantic similarity (via QMD) to find paraphrased claims that structural scans miss.

## The Workflow: Correction Sweep

The main capability of this repository is the `correction-sweep` agent.

**Scenario:** 
You document a change: *"From this week, releases require two approvals, not one."*

**The Sweep:**
You trigger a sweep against this new authoritative fact. The system returns a structured plan:
- ❌ **Release Guide (Active):** Mentions one approval. *Proposed fix: Update to two approvals.*
- ❌ **Onboarding Checklist (Active):** Still has the old rule. *Proposed fix: Update checklist.*
- 🕒 **Last Month's Meeting Notes (Historical):** Mentions the one-approval rule. *Action: Preserve without changes.*
- ❓ **Vague Doc (Uncertain):** Refers to "the standard approval process". *Action: Needs human review.*

This replaces the chaotic "find in files" approach with a surgical, verifiable Knowledge Pull Request.

## What is Included?

- **`correction-sweep.md`**: The core AI agent definition that categorizes search hits into `AUTHORITATIVE`, `HISTORICAL`, `RESTATEMENT`, and `UNCERTAIN`.
- **`.claude/scripts/`**: TypeScript hook validation, context loading, and search tooling.
- **QMD adapter**: Optional semantic search integration for finding paraphrased claims.

*Note: Previous versions of this repository contained exploratory features ("Mind OS", automated career tracking, Slack connectors, background cron jobs). These have been decisively removed to focus on one problem that actually matters: safe, reviewable knowledge propagation.*

## Quick Start

Use Git, Obsidian, and a recent Node.js release supporting TypeScript type stripping; Node.js 22.18+ is recommended.

```sh
git clone https://github.com/sjfakharian/obsidian-jules.git obsidian-change-review
cd obsidian-change-review
```

Install local script dependencies:
```sh
npm --prefix .claude/scripts install
npm --prefix .claude/scripts test
```

Start Claude Code to run a sweep:
```sh
claude
# Inside Claude Code:
# > /om-correct "Releases now require two approvals"
```

## Contributing

Focused contributions are welcome, specifically in:
- Improving the classification accuracy of `correction-sweep.md`.
- Building a UI/CLI tool for the "Review Queue" (Accept/Reject/Modify proposals).
- Hardening the detection of historical vs. active documents.

## Acknowledgments and License

This project includes code and conventions adapted from [Obsidian Mind](https://github.com/breferrari/obsidian-mind). Modifications are MIT-licensed. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for upstream provenance.
