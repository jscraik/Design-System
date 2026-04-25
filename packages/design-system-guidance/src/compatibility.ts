import { SUPPORTED_DESIGN_PROFILES } from "./profiles.js";
import type { DesignCompatibilityManifest } from "./types.js";
import { GuidanceError } from "./types.js";

export const DESIGN_COMPATIBILITY_MANIFEST: DesignCompatibilityManifest = {
  schema: "astudio.design.compatibility.v1",
  wrapperVersion: "0.0.2",
  engineVersionRange: "0.0.x",
  minWrapper: "0.0.2",
  maxWrapperTested: "0.0.2",
  supportedDesignSchemas: ["agent-design.v1"],
  supportedCommandSchemas: [
    "astudio.design.lint.v1",
    "astudio.design.diff.v1",
    "astudio.design.export.v1",
    "astudio.design.checkBrand.v1",
    "astudio.design.init.v1",
    "astudio.design.migrate.v1",
    "astudio.design.doctor.v1",
  ],
  supportedMigrationSchemas: ["astudio.design.rollback.v1"],
  supportedProfiles: SUPPORTED_DESIGN_PROFILES,
  parityBaseline: {
    source: "https://github.com/jscraik/system-design.md.git",
    commit: "8ecd4645b957e6a683a05fb9c79cd6c9028873d0",
  },
  legacySupport: {
    policy: "later-of",
    daysAfterGa: 90,
    minorReleasesAfterGa: 2,
    rollbackMetadataMinWrapper: "0.0.1",
  },
};

export function assertDesignCommandSchemaSupported(kind: string): void {
  if (DESIGN_COMPATIBILITY_MANIFEST.supportedCommandSchemas.includes(kind)) return;

  throw new GuidanceError(`Unsupported design command schema: ${kind}`, {
    code: "E_DESIGN_MANIFEST_INVALID",
    exitCode: 3,
    hint: "Update the design compatibility manifest before emitting this command schema.",
  });
}
