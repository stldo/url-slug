export default {
  "**/*": "npm run format",
  "src/*.{ts,tsx}": () => "npm run typecheck",
};
