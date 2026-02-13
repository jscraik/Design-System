import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const ASTUDIO_PACKAGES = [
  "packages/tokens",
  "packages/ui",
  "packages/astudio-icons",
  "packages/astudio-make-template",
];

const getRootVersion = (): string => {
  const rootPackageJson = join(ROOT, "package.json");
  if (!existsSync(rootPackageJson)) {
    throw new Error("Root package.json not found");
  }

  const data = JSON.parse(readFileSync(rootPackageJson, "utf8")) as { version?: string };
  if (!data.version) {
    throw new Error("Root package.json version missing");
  }

  return data.version;
};

const updatePackageVersion = (packagePath: string, version: string): boolean => {
  const packageJsonPath = join(ROOT, packagePath, "package.json");
  if (!existsSync(packageJsonPath)) {
    console.warn(`Skipping ${packagePath}: package.json not found`);
    return false;
  }

  const data = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { version?: string };
  if (data.version === version) {
    return false;
  }

  data.version = version;
  writeFileSync(packageJsonPath, `${JSON.stringify(data, null, 2)}\n`);
  return true;
};

const main = () => {
  const version = getRootVersion();
  let updated = 0;

  for (const packagePath of ASTUDIO_PACKAGES) {
    if (updatePackageVersion(packagePath, version)) {
      updated += 1;
      console.log(`Updated ${packagePath} to ${version}`);
    } else {
      console.log(`No change for ${packagePath}`);
    }
  }

  console.log(`Version sync complete. Updated ${updated} packages.`);
};

main();
