# Rel.AI OfficeCLI Extension

[![Validate extension](https://github.com/Kyne0328/rel-ai-extension-officecli/actions/workflows/validate.yml/badge.svg)](https://github.com/Kyne0328/rel-ai-extension-officecli/actions/workflows/validate.yml)

This repository contains the Rel.AI extension for [OfficeCLI](https://github.com/iOfficeAI/OfficeCLI).

The extension lets Rel.AI use OfficeCLI for Word, Excel, and PowerPoint work.
The extension does not contain OfficeCLI binaries.

## Status

| Item | Value |
| --- | --- |
| Extension ID | `officecli` |
| Extension version | `1.0.0` |
| Type | `cli` |
| Rel.AI version | `>=1.1.2 <2.0.0` |
| OfficeCLI version | `1.0.151` |
| Managed install | Yes |

## What it does

The extension supports these tasks:

- Inspect and edit `.docx`, `.xlsx`, and `.pptx` files.
- Check document issues.
- Validate Office files.
- Render files for visual checks.
- Use `officecli watch` for local preview.
- Use high-level document commands before raw OOXML commands.

## Supported platforms

The manifest contains a verified OfficeCLI artifact for each target.

| Platform | x64 | arm64 |
| --- | --- | --- |
| Windows | Yes | Yes |
| macOS | Yes | Yes |
| Linux | Yes | Yes |

## Installation model

Rel.AI reads this extension from the public catalog.

The catalog repository is:

https://github.com/Kyne0328/rel-ai-extensions

The public manifest is:

https://raw.githubusercontent.com/Kyne0328/rel-ai-extension-officecli/main/relai-extension.json

If OfficeCLI is not available, Rel.AI can install the declared binary.

Rel.AI uses this procedure:

1. Select the artifact for the current platform and architecture.
2. Download the artifact from the official OfficeCLI GitHub release.
3. Check the pinned SHA-256 value.
4. Install the binary in Rel.AI local data.
5. Add the managed binary directory to Rel.AI child process PATH.

Rel.AI does not change the system PATH.

## Update model

The extension pins OfficeCLI `v1.0.151`.

Managed commands set `OFFICECLI_SKIP_UPDATE=1`.
OfficeCLI does not update the managed binary itself.

To publish a new OfficeCLI version:

1. Update the artifact URLs.
2. Update all SHA-256 values.
3. Increase the extension version.
4. Update `CHANGELOG.md`.
5. Run the repository checks.
6. Update the public catalog entry.

## Repository layout

```text
rel-ai-extension-officecli/
├── relai-extension.json
├── SKILL.md
├── agents/
│   └── openai.yaml
├── scripts/
│   └── validate.mjs
├── .github/
│   └── workflows/
│       └── validate.yml
├── .gitattributes
├── CHANGELOG.md
└── README.md
```

`relai-extension.json` is the package manifest.
`SKILL.md` contains the Rel.AI workflow instructions.

## Validation

Run:

```bash
node scripts/validate.mjs
```

The check verifies the manifest structure and local package hashes.
GitHub Actions runs the same check on pushes and pull requests.

The public catalog also downloads this manifest and checks the published package data.

## Security

The extension does not run an upstream install script.
It does not start another model or MCP server.

Rel.AI checks the declared binary hash before installation.
Rel.AI still controls local permissions and execution.

Review the manifest before installation if you need to inspect the declared permissions or binary sources.

## Upstream

OfficeCLI is maintained by iOfficeAI:

https://github.com/iOfficeAI/OfficeCLI

This repository is a Rel.AI integration.
It is not the upstream OfficeCLI project.
