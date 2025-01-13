import { expect } from "jsr:@std/expect";
import { StackImageUpdateAvailable, ServerCPU } from "../tests/fixtures.ts";
import { program } from "../gotify/program.ts";
import { sleep } from "../common/dataUtils.ts";

Deno.test({
  name: "Gotify - run memory alert",
  async fn() {
    const server = program();
    try {
    
      const req = new Request("http://127.0.0.1:7000", {
        method: "POST",
        body: JSON.stringify({...ServerCPU, resolved: false}),
      });
      const resp = await fetch(req);
      expect(resp.ok).toBeTruthy();

      await sleep(2400);

      const reqResolved = new Request("http://127.0.0.1:7000", {
        method: "POST",
        body: JSON.stringify({...ServerCPU, resolved: true}),
      });
      const respResolved = await fetch(reqResolved);
      expect(respResolved.ok).toBeTruthy();
    } catch (e) {
      throw e;
    } finally {
      await server.shutdown();
    }
  },
});

Deno.test({
  name: "Gotify - stack image update",
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
