// tailwind.config.js
module.exports = {
  content: ["./**/*.{html,js}", "node_modules/preline/dist/*.js"],
  plugins: [
    // require('@tailwindcss/forms'),
    require("preline/plugin"),
  ],
};
