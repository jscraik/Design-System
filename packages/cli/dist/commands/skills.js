import { RemoteSkillClient, installSkillFromZip, platformRootPath, platformStorageKey, publishSkill } from "@design-studio/skill-ingestion";
import { emitSkillResults, emitSkillInstall, emitPublishResult } from "../utils/output.js";
import { CliError, ERROR_CODES, EXIT_CODES } from "../error.js";
import path from "node:path";
export async function skillsSearchCommand(args) {
    const { query, limit, allowUnsafe, argv } = args;
    const client = new RemoteSkillClient({ strictIntegrity: !allowUnsafe });
    const results = await client.search(query, limit ?? 20);
    emitSkillResults(argv, results);
}
export async function skillsInstallCommand(args) {
    const { slug, platform, version, checksum, destination, allowUnsafe, argv } = args;
    const strict = !allowUnsafe;
    if (strict && !checksum) {
        throw new CliError("Checksum is required in strict mode. Pass --checksum <sha256> or --allow-unsafe.", {
            code: ERROR_CODES.policy,
            exitCode: EXIT_CODES.policy,
        });
    }
    const client = new RemoteSkillClient({ strictIntegrity: strict });
    const download = await client.download(slug, {
        version,
        expectedChecksum: checksum,
        strictIntegrity: strict,
    });
    const root = destination ?? platformRootPath(platform);
    const result = await installSkillFromZip(download.zipPath, [{ rootPath: root, storageKey: platformStorageKey(platform) }], { slug, version: version ?? null });
    emitSkillInstall(argv, result.installPaths, platform);
}
export async function skillsPublishCommand(args) {
    const { skillPath, slug, latestVersion, bump, changelog, tags, dryRun, argv } = args;
    const resolvedSlug = slug ?? path.basename(skillPath);
    const parsedTags = tags?.split(",").map((t) => t.trim()).filter(Boolean);
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
export function skillsCommand(yargs) {
    return yargs
        .command("search <query>", "Search Clawdhub skills", (cmd) => cmd
        .positional("query", { type: "string", demandOption: true })
        .option("limit", { type: "number", default: 20 })
        .option("allow-unsafe", {
        type: "boolean",
        default: false,
        describe: "Allow requests without checksum enforcement",
    }), async (argv) => {
        await skillsSearchCommand({
            query: argv.query,
            limit: argv.limit,
            allowUnsafe: argv["allow-unsafe"],
            argv: argv,
        });
    })
        .command("install <slug>", "Download and install a skill", (cmd) => cmd
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
    }), async (argv) => {
        await skillsInstallCommand({
            slug: argv.slug,
            platform: argv.platform,
            version: argv.version,
            checksum: argv.checksum,
            destination: argv.destination,
            allowUnsafe: argv["allow-unsafe"],
            argv: argv,
        });
    })
        .command("publish <path>", "Publish or update a local skill using bunx clawdhub", (cmd) => cmd
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
        .option("dry-run", { type: "boolean", default: false }), async (argv) => {
        await skillsPublishCommand({
            skillPath: path.resolve(argv.path),
            slug: argv.slug,
            latestVersion: argv["latest-version"],
            bump: argv.bump ?? "patch",
            changelog: argv.changelog,
            tags: argv.tags,
            dryRun: argv["dry-run"],
            argv: argv,
        });
    })
        .demandCommand(1, "Specify a skills subcommand");
}
//# sourceMappingURL=skills.js.map