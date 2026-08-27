import { existsSync, readFileSync } from "fs";
test("package.json has next + typescript", () => {
  const pkg = JSON.parse(readFileSync("package.json","utf8"));
  expect(pkg.dependencies.next).toBeDefined();
  expect(pkg.devDependencies.typescript).toBeDefined();
});
test("globals has lime token", () => {
  const css = readFileSync("src/app/globals.css","utf8");
  expect(css).toContain("#C8FF3D");
});
test("prisma schema has Boost", () => {
  const s = readFileSync("prisma/schema.prisma","utf8");
  expect(s).toContain("model Boost");
});
