# XPlanner Agent Skills

[![Validate agent skill](https://github.com/Sooler-Studio/xplanner-agent-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/Sooler-Studio/xplanner-agent-skills/actions/workflows/validate.yml)
[![skills.sh](https://skills.sh/b/Sooler-Studio/xplanner-agent-skills)](https://skills.sh/Sooler-Studio/xplanner-agent-skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Official agent skills for operating an XPlanner content workspace from compatible AI agents.

The `$xplanner` skill teaches an agent how to discover the correct Workspace and Social Set, work from saved ideas, create platform-specific drafts for X, LinkedIn, and Threads, manage media, plan posts, and preserve user control over publishing and deletion.

Real account actions run through the [XPlanner remote MCP server](https://mcp.xplanner.co/mcp) and OAuth. This repository does not ship a separate XPlanner CLI and does not store API keys.

## Install

```bash
npx skills add Sooler-Studio/xplanner-agent-skills --skill xplanner
```

The open skills installer can place the skill in Codex, Claude Code, Cursor, and other supported agent environments.

## Connect XPlanner MCP

Installing the skill teaches the workflow. Connect XPlanner MCP to give the agent the tools needed to perform real actions.

### Codex

```bash
codex mcp add xplanner --url https://mcp.xplanner.co/mcp
```

### Claude Code

```bash
claude mcp add --transport http xplanner https://mcp.xplanner.co/mcp
```

Complete the XPlanner OAuth flow when your client asks you to sign in. See the [XPlanner MCP setup guide](https://xplanner.co/en/docs/app/mcp) for connector-based setup and other clients.

## Example Requests

- “Show me the ideas saved for this Workspace.”
- “Turn these three ideas into distinct X, LinkedIn, and Threads drafts.”
- “Find open days next week and schedule the approved drafts.”
- “Prepare the next two weeks for both brands, but keep everything as drafts.”

## Safety Defaults

- Read the relevant XPlanner context before writing.
- Preserve the source idea relationship when turning an idea into a post.
- Represent related platform versions as one post record with platform-specific text.
- Create drafts by default.
- Publish or permanently delete only when the user explicitly requests the exact action.
- Report partial batch outcomes accurately; XPlanner does not currently expose an atomic Content Run tool.

## Repository Structure

```text
skills/
└── xplanner/
    ├── SKILL.md
    ├── agents/
    │   └── openai.yaml
    └── references/
        ├── tool-contract.md
        └── workflows.md
```

## Development

```bash
npm test
```

The verifier checks the canonical skill name, remote MCP endpoint, current 27-tool contract, safety boundaries, and repository installation instructions.

Learn more at [XPlanner for AI Agents](https://xplanner.co/en/ai-agents).

## License

[MIT](LICENSE)
