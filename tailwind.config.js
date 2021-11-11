module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito"],
      },
    },
    container: {
      center: true,
    },
  },
  variants: {
    extend: {
      display: ["group-hover"],
      backgroundColor: ["active"],
      borderRadius: ["group-hover"],
    },
  },
  plugins: [],
};
