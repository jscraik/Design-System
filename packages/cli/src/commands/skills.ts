import path from "node:path";
import type { SkillPlatform } from "@design-studio/skill-ingestion";
import {
  installSkillFromZip,
  platformRootPath,
  platformStorageKey,
  publishSkill,
  RemoteSkillClient,
} from "@design-studio/skill-ingestion";
import type { Argv } from "yargs";
import { CliError, ERROR_CODES, EXIT_CODES } from "../error.js";
import type { CliArgs } from "../types.js";
import { emitPublishResult, emitSkillInstall, emitSkillResults } from "../utils/output.js";

export async function skillsSearchCommand(args: {
  query: string;
  limit?: number;
  allowUnsafe?: boolean;
  argv: CliArgs;
}): Promise<void> {
  const { query, limit, allowUnsafe, argv } = args;
  const client = new RemoteSkillClient({ strictIntegrity: !allowUnsafe });
  const results = await client.search(query, limit ?? 20);
  emitSkillResults(argv, results);
}

export async function skillsInstallCommand(args: {
  slug: string;
  platform: SkillPlatform;
  version?: string;
  checksum?: string;
  destination?: string;
  allowUnsafe?: boolean;
  argv: CliArgs;
}): Promise<void> {
  const { slug, platform, version, checksum, destination, allowUnsafe, argv } = args;
  const strict = !allowUnsafe;

  if (strict && !checksum) {
    throw new CliError(
      "Checksum is required in strict mode. Pass --checksum <sha256> or --allow-unsafe.",
      {
        code: ERROR_CODES.policy,
        exitCode: EXIT_CODES.policy,
      },
    );
  }

  const client = new RemoteSkillClient({ strictIntegrity: strict });
  const download = await client.download(slug, {
    version,
    expectedChecksum: checksum,
    strictIntegrity: strict,
  });
  const root = destination ?? platformRootPath(platform);
  const result = await installSkillFromZip(
    download.zipPath,
    [{ rootPath: root, storageKey: platformStorageKey(platform) }],
    { slug, version: version ?? null },
  );
  emitSkillInstall(argv, result.installPaths, platform);
}

export async function skillsPublishCommand(args: {
  skillPath: string;
  slug?: string;
  latestVersion?: string;
  bump?: "major" | "minor" | "patch";
  changelog?: string;
  tags?: string;
  dryRun?: boolean;
  argv: CliArgs;
}): Promise<void> {
  const { skillPath, slug, latestVersion, bump, changelog, tags, dryRun, argv } = args;
  const resolvedSlug = slug ?? path.basename(skillPath);
  const parsedTags = tags
    ?.split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const result = await publishSkill({
    skillPath,
    slug: resolvedSlug,
    latestVersion,
    bump: bump ?? "patch",
    changelog,
    tags: parsedTags,
    dryRun,
  });
  emitPublishResult(argv, result, resolvedSlug);
}

export function skillsCommand(yargs: Argv): Argv {
  return yargs
    .command(
      "search <query>",
      "Search Clawdhub skills",
      (cmd) =>
        cmd
          .positional("query", { type: "string", demandOption: true })
          .option("limit", { type: "number", default: 20 })
          .option("allow-unsafe", {
            type: "boolean",
            default: false,
            describe: "Allow requests without checksum enforcement",
          }),
      async (argv) => {
        await skillsSearchCommand({
          query: argv.query as string,
          limit: argv.limit as number | undefined,
          allowUnsafe: argv["allow-unsafe"] as boolean,
          argv: argv as CliArgs,
        });
      },
    )
    .command(
      "install <slug>",
      "Download and install a skill",
      (cmd) =>
        cmd
          .positional("slug", { type: "string", demandOption: true })
          .option("platform", {
            type: "string",
            choices: ["codex", "claude", "opencode", "copilot"],
            demandOption: true,
          })
          .option("version", {
            type: "string",
            describe: "Version to install (defaults to latest)",
          })
          .option("checksum", {
            type: "string",
            describe: "Expected SHA-256 checksum of the zip (required in strict mode)",
          })
          .option("destination", {
            type: "string",
            describe: "Override install root (defaults to platform root)",
          })
          .option("allow-unsafe", {
            type: "boolean",
            default: false,
            describe: "Allow install without checksum (NOT recommended)",
          }),
      async (argv) => {
        await skillsInstallCommand({
          slug: argv.slug as string,
          platform: argv.platform as SkillPlatform,
          version: argv.version as string | undefined,
          checksum: argv.checksum as string | undefined,
          destination: argv.destination as string | undefined,
          allowUnsafe: argv["allow-unsafe"] as boolean,
          argv: argv as CliArgs,
        });
      },
    )
    .command(
      "publish <path>",
      "Publish or update a local skill using bunx clawdhub",
      (cmd) =>
        cmd
          .positional("path", { type: "string", demandOption: true })
          .option("slug", { type: "string", describe: "Skill slug (defaults to folder name)" })
          .option("latest-version", {
            type: "string",
            describe: "Current published version (semantic)",
          })
          .option("bump", {
            type: "string",
            choices: ["major", "minor", "patch"],
            default: "patch",
          })
          .option("changelog", { type: "string" })
          .option("tags", { type: "string", describe: "Comma-separated tags" })
          .option("dry-run", { type: "boolean", default: false }),
      async (argv) => {
        await skillsPublishCommand({
          skillPath: path.resolve(argv.path as string),
          slug: argv.slug as string | undefined,
          latestVersion: argv["latest-version"] as string | undefined,
          bump: (argv.bump as "major" | "minor" | "patch") ?? "patch",
          changelog: argv.changelog as string | undefined,
          tags: argv.tags as string | undefined,
          dryRun: argv["dry-run"] as boolean | undefined,
          argv: argv as CliArgs,
        });
      },
    )
    .demandCommand(1, "Specify a skills subcommand");
}
