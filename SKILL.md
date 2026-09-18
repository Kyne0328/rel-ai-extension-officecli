---
name: officecli
description: Use when ChatGPT needs to create, inspect, edit, validate, render, convert, or visually review Word, Excel, or PowerPoint files through Rel.AI with OfficeCLI, including structure-aware DOCX/XLSX/PPTX edits, issue checks, and localhost preview workflows.
---

# OfficeCLI

Use OfficeCLI as the document engine and keep Rel.AI as the execution, authorization, workspace, browser, and audit boundary.

## Workflow

1. Inspect the document before editing it.
2. Use the highest-level OfficeCLI operation that can complete the task.
3. Make targeted mutations; batch related changes when useful.
4. Render or watch the document when layout matters.
5. Run issue checks and validation.
6. Close the document before another program or delivery step reads it.

## Execution

- Use `relai_exec` for one-shot `officecli` commands. Prefer direct executable + argv form when shell syntax is not needed.
- Use `relai_process` for long-lived commands such as `officecli watch`.
- Use `relai_ui` or `relai_browser` for the localhost preview created by `officecli watch`.
- Set `OFFICECLI_SKIP_UPDATE=1` for every managed OfficeCLI invocation. Rel.AI pins the reviewed binary; OfficeCLI must not self-update it in place.
- Prefer `--json` whenever a command supports structured output.
- Run `officecli help ...` instead of guessing command syntax, property names, selectors, or format-specific behavior.

## Operation strategy

Use the simplest layer that can complete the task:

1. L1 read/inspect: `view`, `get`, `query`, `validate`.
2. L2 document operations: `set`, `add`, `remove`, `move`, `swap`, `batch`.
3. L3 raw OOXML: `raw`, `raw-set`, and related low-level operations only when L1/L2 cannot express the required change.

Prefer stable object identifiers over positional selectors when OfficeCLI exposes them. Preserve working content and formatting unless the user asks for a broader redesign.

## Visual QA

For layout-sensitive Word or PowerPoint work:

1. Start `officecli watch <file>` with `relai_process`.
2. Open the localhost preview through Rel.AI browser/UI tools.
3. Inspect the rendered result after meaningful edits.
4. Run `officecli view <file> issues --json` and `officecli validate <file>`.
5. Fix relevant issues and verify the rendered result again.

Use `officecli get <file> selected --json` when a supported Word/PowerPoint selection workflow makes object targeting safer.

## Examples

Read a presentation:

`officecli get deck.pptx / --depth 2 --json`

Check document issues:

`officecli view report.docx issues --json`

Create a presentation:

`officecli create deck.pptx`

`officecli add deck.pptx / --type slide --prop title="Q4 Report"`

Edit an Excel cell:

`officecli set data.xlsx /Sheet1/B2 --prop value="=SUM(B3:B20)"`

Open visual preview:

`officecli watch deck.pptx`

## Boundaries

- Do not start `officecli mcp`; use the existing Rel.AI execution tools instead of nesting another MCP server.
- Do not install a second copy of OfficeCLI with curl, PowerShell, npm, Homebrew, or Scoop during normal extension use. Rel.AI manages the pinned extension binary when the manifest declares a compatible artifact.
- Do not fall back to desktop automation when OfficeCLI's structured operations or renderer can complete the task reliably.
