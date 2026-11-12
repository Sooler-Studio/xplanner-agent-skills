# XPlanner MCP Tool Contract

General-purpose tools on the production MCP worker. Use live capability discovery to decide which formats and options are available to the current identity.

## Connection

- Server name: `xplanner`
- Remote endpoint: `https://mcp.xplanner.co/mcp`
- Transport: Streamable HTTP
- Authentication: OAuth 2.1 with action scopes
- Production platform families: X, LinkedIn, Threads, Facebook Pages, professional Instagram accounts, and YouTube Shorts

OAuth grants account identity and action scopes. Workspace, Social Set, and Social Account identifiers are supplied in tool calls; OAuth does not create a resource-level allowlist.

## Context and Capability Tools

| Tool                                 | Scope              | Use                                                                                                                       |
| ------------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `xplanner_list_workspaces`           | `workspaces:read`  | Discover Workspaces available to the connected account.                                                                   |
| `xplanner_list_social_sets`          | `social-sets:read` | Discover Social Sets and their connected accounts. Filter by `workspaceId` when known.                     |
| `xplanner_get_platform_capabilities` | `accounts:read`    | Read live text and media rules before constructing platform targets.                                                      |
| `xplanner_list_accounts`             | `accounts:read`    | Get legacy `accountId` values needed by current idea, folder, and media tools. Prefer Social Sets for new post targeting. |
| `xplanner_get_usage`                 | `usage:read`       | Inspect available usage information when the user asks about XPlanner usage.                                              |

## Idea and Folder Tools

| Tool                            | Scope                            |
| ------------------------------- | -------------------------------- |
| `xplanner_list_ideas`           | `ideas:read`                     |
| `xplanner_get_idea`             | `ideas:read`                     |
| `xplanner_create_idea`          | `ideas:create`                   |
| `xplanner_update_idea`          | `ideas:update`                   |
| `xplanner_archive_idea`         | `ideas:update`                   |
| `xplanner_unarchive_idea`       | `ideas:update`                   |
| `xplanner_convert_idea_to_post` | `ideas:convert` + `posts:create` |
| `xplanner_delete_idea`          | `ideas:delete`                   |
| `xplanner_list_folders`         | `folders:read`                   |
| `xplanner_get_folder`           | `folders:read`                   |
| `xplanner_create_folder`        | `folders:create`                 |
| `xplanner_update_folder`        | `folders:update`                 |
| `xplanner_delete_folder`        | `folders:delete`                 |

Important boundaries:

- `xplanner_list_ideas` defaults to active ideas. It accepts account and folder context, archive status (`active`, `archived`, or `all`), completion, search, and pagination. Archive is reversible; use it only when it matches the request.
- Converting a saved idea preserves the source relationship. Prefer conversion over recreating the idea as an unrelated post.
- Idea and folder deletion is permanent and requires an explicit user request for the exact target.

## Post Tools

| Tool                    | Scope                                                                  |
| ----------------------- | ---------------------------------------------------------------------- |
| `xplanner_list_posts`   | `posts:read`                                                           |
| `xplanner_get_post`     | `posts:read`                                                           |
| `xplanner_create_post`  | `posts:create`; additionally `posts:publish` for `mode: "publish_now"` |
| `xplanner_update_post`  | `posts:update`                                                         |
| `xplanner_cancel_post`  | `posts:schedule`                                                       |
| `xplanner_publish_post` | `posts:publish`                                                        |
| `xplanner_reconcile_post_target` | `posts:publish`                                                |
| `xplanner_set_post_target_winner` | `posts:update`                                               |
| `xplanner_delete_post`  | `posts:delete`                                                         |

### Platform-native post model

- New post mutations use `workspaceId`, `socialSetId`, and `publishTargets`.
- Each target includes a unique `platform` and `socialAccountId` pair from the selected Social Set. Read `publishTargetEnabled` and the available `publicationKind` values before choosing a target.
- Use `textOverride`, `mediaRefs`, `mediaMetadata`, and closed `providerOptions` as supported for the chosen account and format. Keep delivery IDs, leases, checkpoints, and receipts out of post inputs.
- `text` is the common fallback. Use `textOverride` for genuinely platform-native copy.
- `scheduledAt` must be an ISO 8601 datetime with an offset.
- `xplanner_list_posts` can filter by `socialSetId`, `sourceIdeaId`, and post status and returns pagination cursors.

Default to `mode: "draft"`. Even though `mode: "publish_now"` exists, the skill uses draft → verify → `xplanner_publish_post` for explicit immediate-publish requests so target and content remain observable before the side effect. Reconciliation records a separately verified provider outcome; it is not a retry.

## Media Tools

| Tool                               | Scope          |
| ---------------------------------- | -------------- |
| `xplanner_list_media_assets`       | `media:read`   |
| `xplanner_get_media_download_url`  | `media:read`   |
| `xplanner_create_media_upload_url` | `media:write`  |
| `xplanner_register_media_asset`    | `media:write`  |
| `xplanner_delete_media_asset`      | `media:delete` |

Create an upload URL, upload the binary successfully, then register the asset. Do not register a file before the upload succeeds. Validate target-specific media against `xplanner_get_platform_capabilities`. Use an asset reference for publishing. A temporary signed download URL is for the authorized download only; keep it out of post content and logs.

## Unsupported or Separate Surfaces

- TikTok, Routines, and Barut AI are outside the production publishing contract. ChatGPT App UI helpers are client internals and are outside this skill’s workflow.
- There is no independent Notes, Library, Routines, analytics, social listening, comments, direct messages, or web-research tool family on this remote MCP surface.
- There is no native XPlanner AI writer in this contract. The connected AI client generates copy and XPlanner tools persist or operate on it.
- There is no atomic Content Run tool. Batch outcomes are coordinated through multiple calls and may partially succeed.
