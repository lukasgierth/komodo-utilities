import { expect } from "jsr:@std/expect";
import { parseAlert } from "../common/alertParser.ts";
import { ServerCPU } from "./fixtures.ts";
import { alertResolvedAllowed, parseResolvedTypesString } from "../common/options.ts";

Deno.test({
  name: "Allows all resolved types when no types are defined",
  fn() {
    expect(alertResolvedAllowed(undefined, true)).toBeTruthy;
    expect(alertResolvedAllowed(undefined, false)).toBeTruthy;
  },
});

Deno.test({
  name: "Parses ENV string to allowed resolve types",
  fn() {
    expect(parseResolvedTypesString('resolved')).toContain('resolved');
    expect(parseResolvedTypesString('unresolved')).toContain('unresolved');
    expect(parseResolvedTypesString('resolved, unresolved')).toEqual(['resolved', 'unresolved'])
    expect(parseResolvedTypesString('ReSOLved, unrESOLved')).toEqual(['resolved', 'unresolved'])
  },
});

Deno.test({
  name: "Allows only resolved types when types are defined",
  fn() {
    expect(alertResolvedAllowed(parseResolvedTypesString('resolved'), true)).toBeTruthy;
    expect(alertResolvedAllowed(parseResolvedTypesString('unresolved'), false)).toBeTruthy;
    expect(alertResolvedAllowed(parseResolvedTypesString('resolved,unresolved'), true)).toBeTruthy;
    expect(alertResolvedAllowed(parseResolvedTypesString('resolved'), false)).toBeFalsy;
    expect(alertResolvedAllowed(parseResolvedTypesString('unresolved'), true)).toBeFalsy;
  },
});