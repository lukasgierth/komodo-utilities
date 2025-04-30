import { expect } from "jsr:@std/expect";
import { normalizeWebAddress } from "../common/stringUtils.ts";

Deno.test({
  name: "Expects fully qualified address to be the same",
  fn() {
    expect(normalizeWebAddress('https://example.com').normal).toBe('https://example.com');
    expect(normalizeWebAddress('http://example.com').normal).toBe('http://example.com');
  },
});

Deno.test({
    name: "Expects address without protocol to be http",
    fn() {
        const addr = normalizeWebAddress('example.com');
        expect(addr.normal).toBe('http://example.com');
        expect(addr.url.hostname).toBe('example.com');
        expect(addr.port).toBe(80);
    },
  });

Deno.test({
name: "Expects address without protocol but port 443 to be https",
fn() {
    expect(normalizeWebAddress('example.com:443').url.protocol).toBe('https:');
},
});

Deno.test({
name: "Expects hostname without extension to be detected",
fn() {
    expect(normalizeWebAddress('example:8080').url.protocol).toBe('http:');
    expect(normalizeWebAddress('example:443').url.protocol).toBe('https:');

    const web = normalizeWebAddress('example:8000/test');
    expect(web.url.protocol).toBe('http:');
    expect(web.url.port).toBe('8000');
    expect(web.url.pathname).toBe('/test');
    expect(web.url.hostname).toBe('example');

    const hostonly = normalizeWebAddress('example');
    expect(hostonly.url.protocol).toBe('http:');
    expect(hostonly.port).toBe(80);
},
});