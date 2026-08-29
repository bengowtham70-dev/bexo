import path from "path";
export default {
  test: {
    include: ["tests/**/*.test.ts"],
    globals: true,
    testTimeout: 30000,
  },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
};
