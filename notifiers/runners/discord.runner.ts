import { expect } from "jsr:@std/expect";
import { ServerMem, StackImageUpdateAvailable } from "../tests/fixtures.ts";
import { program } from "../discord/program.ts";

Deno.test({
  name: "Discord - run memory alert",
  async fn() {
    const server = program();
    try {
    
      const req = new Request("http://127.0.0.1:7000", {
        method: "POST",
        body: JSON.stringify(ServerMem),
      });
      const resp = await fetch(req);
      expect(resp.ok).toBeTruthy();
    } catch (e) {
      throw e;
    } finally {
      await server.shutdown();
    }
  },
});

Deno.test({
  name: "Discord - stack image update",
  async fn() {
    const server = program();
    try {
    
      const req = new Request("http://127.0.0.1:7000", {
        method: "POST",
        body: JSON.stringify(StackImageUpdateAvailable),
      });
      const resp = await fetch(req);
      expect(resp.ok).toBeTruthy();
    } catch (e) {
      throw e;
    } finally {
      await server.shutdown();
    }
  },
});
