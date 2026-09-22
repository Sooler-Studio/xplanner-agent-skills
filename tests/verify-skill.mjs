import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function read(path) {
  return readFileSync(resolve(repoRoot, path), "utf8");
}

const skill = read("skills/xplanner/SKILL.md");
const toolContract = read("skills/xplanner/references/tool-contract.md");
const workflows = read("skills/xplanner/references/workflows.md");
const openai = read("skills/xplanner/agents/openai.yaml");
const readme = read("README.md");

const expectedTools = [
  "xplanner_cancel_post",
  "xplanner_convert_idea_to_post",
  "xplanner_create_folder",
  "xplanner_create_idea",
  "xplanner_create_media_upload_url",
  "xplanner_create_post",
  "xplanner_delete_folder",
  "xplanner_delete_idea",
  "xplanner_delete_media_asset",
  "xplanner_delete_post",
  "xplanner_get_folder",
  "xplanner_get_idea",
  "xplanner_get_platform_capabilities",
  "xplanner_get_post",
  "xplanner_get_usage",
  "xplanner_list_accounts",
  "xplanner_list_folders",
  "xplanner_list_ideas",
  "xplanner_list_media_assets",
  "xplanner_list_posts",
  "xplanner_list_social_sets",
  "xplanner_list_workspaces",
  "xplanner_publish_post",
  "xplanner_register_media_asset",
  "xplanner_update_folder",
  "xplanner_update_idea",
  "xplanner_update_post",
].sort();

const documentedTools = Array.from(
  new Set(
    Array.from(
      toolContract.matchAll(/`(xplanner_[a-z_]+)`/g),
      (match) => match[1],
    ),
  ),
).sort();

assert.deepEqual(documentedTools, expectedTools);
assert.ok(skill.startsWith("---\nname: xplanner\n"));
assert.ok(skill.includes("references/tool-contract.md"));
assert.ok(skill.includes("references/workflows.md"));
assert.ok(openai.includes("$xplanner"));
assert.ok(openai.includes('url: "https://mcp.xplanner.co/mcp"'));
assert.ok(
  readme.includes(
    "npx skills add Sooler-Studio/xplanner-agent-skills --skill xplanner",
  ),
);

for (const invariant of [
  "Create a draft first",
  "not a separate calendar resource",
  "Report partial success accurately",
  "There is no atomic Content Run tool",
  "Scheduling is not authorization for immediate publishing.",
]) {
  assert.ok(
    `${skill}\n${toolContract}\n${workflows}`.includes(invariant),
    `Missing invariant: ${invariant}`,
  );
}

assert.equal(
  /xplanner-content-manager|xplanner login|xplanner ideas|xplanner posts/.test(
    `${skill}\n${openai}\n${readme}`,
  ),
  false,
  "The public skill must use the canonical name and must not reintroduce a standalone XPlanner CLI",
);

assert.equal(
  /`xplanner_(?:routine|analytics|facebook|instagram)[a-z_]*`/i.test(
    toolContract,
  ),
  false,
  "The public skill must not invent unsupported remote MCP tools",
);

console.log(
  `XPlanner public agent skill verification passed (${expectedTools.length} tools, MCP-first, no standalone CLI).`,
);
