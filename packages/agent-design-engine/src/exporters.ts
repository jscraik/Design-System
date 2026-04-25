import type { DesignContract, ExportFormat, ExportResult } from "./types.js";

function toDtcg(contract: DesignContract): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(contract.tokens).map(([name, value]) => [
      name.replace(/^--/, "").replaceAll("-", "."),
      { $type: value.startsWith("#") ? "color" : "dimension", $value: value },
    ]),
  );
}

function toTailwind(contract: DesignContract): Record<string, unknown> {
  return {
    theme: {
      extend: {
        colors: Object.fromEntries(
          Object.entries(contract.tokens)
            .filter(([, value]) => value.startsWith("#"))
            .map(([name, value]) => [name.replace(/^--/, "").replaceAll("-", "."), value]),
        ),
      },
    },
  };
}

export function exportDesignContract(contract: DesignContract, format: ExportFormat): ExportResult {
  const artifact =
    format === "json@agent-design.v1"
      ? contract
      : format === "dtcg@2025"
        ? toDtcg(contract)
        : toTailwind(contract);

  return {
    kind: "astudio.design.export.v1",
    format,
    contract,
    artifact,
  };
}
