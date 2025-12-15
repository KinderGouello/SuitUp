module.exports = {
  root: true,
  extends: ['@suitup/eslint-config/node.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    '.turbo',
    'prisma/migrations',
    'vitest.config.ts',
  ],
};
