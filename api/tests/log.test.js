// tests/log.test.js
import test from "node:test";
import assert from "node:assert";

test("addition works", () => {
  const result = 2 + 2;
  console.log("Résultat du calcul :", result);
  assert.strictEqual(result, 4);
});
