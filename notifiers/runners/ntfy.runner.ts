import { expect } from "jsr:@std/expect";
import { ServerMem, StackImageUpdateAvailable, StackAutoUpdated } from "../tests/fixtures.ts";
import { program } from "../ntfy/program.ts";

Deno.test({
  name: "Ntfy - run cpu alert",
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
  name: "Ntfy - stack image update",
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

Deno.test({
  name: "Ntfy - stack auto updated",
  async fn() {
    const server = program();
    try {
    
      const req = new Request("http://127.0.0.1:7000", {
        method: "POST",
        body: JSON.stringify(StackAutoUpdated),
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
