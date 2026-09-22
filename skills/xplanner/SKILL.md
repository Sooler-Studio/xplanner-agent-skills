---
name: xplanner
description: "Use when the user asks an agent to work inside XPlanner through its connected MCP server: discover Workspaces and Social Sets, manage ideas or folders, turn ideas into platform-specific X, LinkedIn, and Threads drafts, manage media, schedule or reschedule posts, or explicitly publish or delete content. Do not use for generic social copy that does not need to be read from or saved to XPlanner."
---

# XPlanner Content Manager

Manage the user's real XPlanner content system instead of treating XPlanner as a blank text generator.

## Operating Model

- The AI client writes and reasons; XPlanner stores content context, source relationships, targets, and schedules.
- Match the user's language. Preserve proper Turkish characters in Turkish content.
- Read before writing. Reuse existing ideas, folders, posts, and target context when the request depends on them.
- Use one post record with platform-specific `publishTargets[].textOverride` values when one idea should become related X, LinkedIn, and Threads versions. Create separate post records only when the user wants independent lifecycles.
- Save new work as drafts unless the user explicitly requests scheduling or immediate publishing.
- Treat one natural-language request as an orchestration of tool calls, not as an atomic bulk transaction. Report partial success accurately.

## Default Workflow

1. Resolve the account context with `xplanner_list_workspaces` and `xplanner_list_social_sets`.
2. Use `xplanner_list_accounts` only when an idea, folder, or media tool requires the legacy `accountId` field.
3. Inspect relevant folders, ideas, and existing posts before generating content.
4. Call `xplanner_get_platform_capabilities` before preparing `publishTargets` or media.
5. Preserve provenance:
   - For a saved idea, prefer `xplanner_convert_idea_to_post`, then update the returned post with the intended targets and platform copy.
   - For source-free content, use `xplanner_create_post` with the correct `workspaceId`, `socialSetId`, and `publishTargets`.
6. Create distinct copy for each selected platform rather than cross-posting identical text by default.
7. Keep the result as a draft, or schedule it only when the user requested a date or planning outcome.
8. Re-read the created or updated post before reporting completion.

For exact tool names, scopes, data-model rules, and unsupported surfaces, read [references/tool-contract.md](references/tool-contract.md). For reusable task sequences, read [references/workflows.md](references/workflows.md) only when the request matches one of those workflows.

## Permission and Mutation Rules

- OAuth authenticates the connected XPlanner account and grants action scopes. It does not create a Workspace or Social Set allowlist; pass the intended identifiers in each operation.
- Do not infer publish or delete permission from requests such as “prepare,” “create,” “adapt,” or “plan.”
- Do not use `xplanner_create_post` with `mode: "publish_now"` as the normal creation path. Create a draft first, verify the result, and use `xplanner_publish_post` only when the user explicitly requested immediate publishing.
- A clear current-turn request such as “publish this now” is authorization for that exact post and target; do not ask for duplicate confirmation unless the target is ambiguous or has changed.
- Before any delete, identify the exact resource and confirm that the user's request covers permanent deletion. Never broaden a singular delete into a batch delete.
- Do not blindly retry a timed-out or uncertain mutation. Read the resource or list results first to avoid duplicates.
- If a required scope, connection, target, or MCP tool is unavailable, explain the missing prerequisite. Never simulate a successful XPlanner mutation.

## Planning Rules

- XPlanner MCP has post scheduling operations, not a separate calendar resource. Derive open days from scheduled posts returned by `xplanner_list_posts`.
- Use an ISO 8601 timestamp with an explicit offset for scheduling. If the user's date or timezone is materially ambiguous, ask one concise question before writing the schedule.
- Paginate list calls when the requested operation can exceed one page; do not assume the first page is complete.
- For multi-brand work, resolve and keep each Workspace and Social Set context separate throughout the run.

## Report the Result

Summarize only what actually succeeded. Include the relevant Workspace/Social Set, source-idea count, post-record count, platform-text count, schedule, and publish state when useful. Distinguish clearly between:

- drafted;
- scheduled;
- queued or published;
- failed or not attempted.

Do not describe multiple platform texts as multiple posts when they belong to one post record.
