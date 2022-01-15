import vue from "@vitejs/plugin-vue";

/**
 * Build configuration for client code, executed in the browser
 */
export default {
  plugins: [vue()],

  build: {
    lib: {
      entry: "src/index.js",
    },
    external: ["vue", "vuex", "vue-router"],
    minify: "eslint",
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue", "compressorjs"],
      // output: {
      // Provide global variables to use in the UMD build
      // for externalized deps
      output: {
        globals: {
          vue: "Vue",
          compressorjs: "compressorjs",
        },
      },
    },
  },
};

// build: {
//   lib: {
//     entry: path.resolve(__dirname, "src/index.js"),
//     name: "CompositionUtils",
//   },
//   rollupOptions: {
//     // make sure to externalize deps that shouldn't be bundled
//     // into your library
//     external: ["vue"],
//     output: {
//       // Provide global variables to use in the UMD build
//       // for externalized deps
//       globals: {
//         vue: "Vue",
//       },
//     },
//   },
// },
