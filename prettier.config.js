/** @type {import("prettier").Config} */
const config = {
  htmlWhitespaceSensitivity: 'ignore',
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  plugins: ['prettier-plugin-tailwindcss'],
};
module.exports = config;
