import type { CliArgs } from "../types.js";
import { doctor as runDoctor } from "../utils/health.js";

export function doctorCommand(argv: CliArgs): Promise<number> {
  return runDoctor(argv);
}
