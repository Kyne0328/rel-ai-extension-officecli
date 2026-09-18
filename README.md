# Rel.AI OfficeCLI Extension

Rel.AI extension source for [OfficeCLI](https://github.com/iOfficeAI/OfficeCLI).

This repository contains the Rel.AI adapter and workflow instructions. It does **not** vendor OfficeCLI or run a separate agent/MCP server. Rel.AI remains the authorization, workspace, execution, browser, and audit boundary.

## What it adds

The extension teaches Rel.AI/ChatGPT to use OfficeCLI for Word, Excel, and PowerPoint work, including:

- structured inspection and edits for `.docx`, `.xlsx`, and `.pptx`
- issue detection and validation
- layout-sensitive visual review through `officecli watch`
- higher-level document operations before raw OOXML fallbacks
- managed CLI installation when OfficeCLI is not already available

## Auto-install model

`relai-extension.json` declares platform/architecture-specific OfficeCLI binaries from the official `iOfficeAI/OfficeCLI` GitHub releases.

Rel.AI:

1. selects the artifact for the current platform and architecture
2. downloads it over HTTPS
3. verifies the pinned SHA-256 hash
4. installs it under Rel.AI-owned local state
5. exposes it to Rel.AI child processes without modifying the user's system PATH

The extension currently pins OfficeCLI **v1.0.151**.

Managed invocations set `OFFICECLI_SKIP_UPDATE=1` so the reviewed binary does not self-update in place. Updates should be published by changing the extension manifest and its pinned hashes.

## Files

- `relai-extension.json` — Rel.AI extension manifest and pinned OfficeCLI artifacts
- `SKILL.md` — reusable workflow instructions
- `agents/openai.yaml` — ChatGPT Skill UI metadata
- `.gitattributes` — stable LF line endings for reproducible hashes
- `.github/workflows/validate.yml` — repository integrity checks

## Publishing

The public Rel.AI catalog lives separately at:

https://github.com/Kyne0328/rel-ai-extensions

The catalog entry should point to:

https://raw.githubusercontent.com/Kyne0328/rel-ai-extension-officecli/main/relai-extension.json

The extension source stays in this repository; the catalog repository contains only the catalog/specification/examples/validator.

## Upstream

OfficeCLI is developed by iOfficeAI:

https://github.com/iOfficeAI/OfficeCLI

This repository is an integration layer and is not the upstream OfficeCLI project.
