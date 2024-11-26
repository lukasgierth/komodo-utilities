import { expect } from "jsr:@std/expect";
import { parseAlert } from "../common/alertParser.ts";
import { ServerCPU, ServerDisk, ServerMem } from "./fixtures.ts";
import { formatNumber } from "../../common/utils.ts";

Deno.test({
  name: "Parses server cpu without decimals",
  fn() {
    const data = parseAlert(ServerCPU);
    expect(data.message).toContain(
      formatNumber(ServerCPU.data.data.percentage, { max: 0 }),
    );
  },
});

Deno.test({
  name: "Parses disk GB with 2 decimals",
  fn() {
    const data = parseAlert(ServerDisk);
    expect(data.message).toContain(
      formatNumber(ServerDisk.data.data.used_gb, { max: 2 }),
    );
    expect(data.message).toContain(
      formatNumber(ServerDisk.data.data.total_gb, { max: 2 }),
    );
  },
});

Deno.test({
  name: "Parses memory GB with 2 decimals",
  fn() {
    const data = parseAlert(ServerMem);
    expect(data.message).toContain(
      formatNumber(ServerMem.data.data.used_gb, { max: 2 }),
    );
    expect(data.message).toContain(
      formatNumber(ServerMem.data.data.total_gb, { max: 2 }),
    );
  },
});


Deno.test({
  name: "Parses level in title based on options",
  fn() {
    expect(parseAlert(ServerCPU, {levelInTitle: false}).title).not.toContain(`[${ServerCPU.level}]`);
    expect(parseAlert(ServerCPU).title).toContain(`[${ServerCPU.level}]`);
  },
});