# XPlanner Content Workflows

Read only the workflow that matches the user's requested outcome.

## Capture an Idea

1. Resolve the intended legacy account with `xplanner_list_accounts`.
2. If the user named a folder, locate it with `xplanner_list_folders`; create it only when requested or clearly necessary for the stated organization outcome.
3. Create the idea with `xplanner_create_idea` and the exact account/folder context.
4. Read the created idea and report its title, folder, and saved state.

Do not create a post when the user asked only to capture an idea.

## Turn a Saved Idea into Platform Drafts

1. List Workspaces and the selected Workspace's Social Sets.
2. Resolve the idea's account/folder context and retrieve the exact source idea.
3. Read live platform capabilities.
4. Convert the idea with `xplanner_convert_idea_to_post` to preserve provenance.
5. Update the returned post with one target per requested platform and distinct `textOverride` values.
6. Keep it as a draft unless scheduling was requested.
7. Retrieve the post and report one post record plus the number of platform texts.

Example outcome: one source idea → one post record → three platform texts.

## Run a Multi-Brand Content Plan

There is no atomic batch tool.

1. Resolve each Workspace and Social Set independently.
2. Read scheduled posts and derive open dates per brand.
3. Gather the relevant source ideas and existing posts per brand.
4. Present or internally establish a bounded plan: source count, post-record count, platforms, and dates.
5. Execute mutations sequentially with stable source/target mappings. Do not mix identifiers between brands.
6. After each mutation, verify the written resource before continuing when a duplicate would be costly.
7. Summarize succeeded, failed, and not-attempted items separately. Never report the run as atomic or rolled back.

## Create and Schedule a New Post

1. Resolve Workspace, Social Set, and Social Account targets.
2. Read platform capabilities.
3. Prepare common copy plus per-platform overrides.
4. Create a draft first.
5. If scheduling was requested, update the verified draft with an ISO 8601 `scheduledAt` value and the appropriate scheduled status.
6. Retrieve the final post and report the localized date, timezone, targets, and state.

When the date is vague and a wrong day or timezone would matter, ask before mutating.

## Reschedule or Remove from the Calendar

1. Retrieve the exact post.
2. For rescheduling, update `scheduledAt` with an explicit offset and verify the final state.
3. To remove a planned post from the calendar, use `xplanner_cancel_post` only when the user's request clearly covers that post.
4. Report whether the post remains a draft, is scheduled, or was canceled.

## Publish Now

1. Require an explicit current-turn instruction to publish the exact post now.
2. Retrieve the post and verify its Workspace, Social Set, platform targets, copy, and media.
3. If the user asked to create and publish new content, create it as a draft first; do not use `mode: "publish_now"` as the shortcut.
4. Use `xplanner_publish_post` for the verified post.
5. Re-read the post and report queued/published/failed state exactly. Do not blindly retry an uncertain result.

Scheduling is not authorization for immediate publishing.

## Delete Content

1. Require an explicit request that identifies the exact idea, folder, post, or media asset.
2. Retrieve or list the resource to disambiguate the target.
3. Explain if deletion is permanent or could affect related content.
4. Invoke the matching delete tool only for the resolved target.
5. Verify absence or the returned deletion state before reporting success.

Never turn “clean this up” into a broad permanent deletion without clarification.

## Attach Media

1. Resolve the account/context and inspect existing assets with `xplanner_list_media_assets`.
2. If a new file must be uploaded, create an upload URL.
3. Upload the binary using an available file/network capability.
4. Register the asset only after the upload succeeds.
5. Read platform capabilities and assign media references per target.
6. Verify the post after the media update.

If the environment cannot upload the binary, stop after explaining the missing capability; do not claim the asset was registered.
