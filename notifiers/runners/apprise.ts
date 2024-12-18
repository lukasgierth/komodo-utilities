import { expect } from "jsr:@std/expect";
import { ServerMem } from "../tests/fixtures.ts";
import { program } from "../apprise/program.ts";

Deno.test({
  name: "Apprise - run memory alert",
  async fn() {
    let server: Deno.HttpServer | undefined;
    try {
      server = await program();
      const req = new Request("http://127.0.0.1:7000", {
        method: "POST",
        body: JSON.stringify(ServerMem),
      });
      const resp = await fetch(req);
      resp.body?.cancel();
      expect(resp.ok).toBeTruthy();
    } catch (e) {
      throw e;
    } finally {
      if(server !== undefined) {
        await server.shutdown();
      }
    }
  },
});