import path from "path";
export default {
  test: { include: ["tests/**/*.test.ts"], globals: true },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
};
