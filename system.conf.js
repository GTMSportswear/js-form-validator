System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "traceur",
  paths: {
    "systemjs": "node_modules/systemjs/dist/system.js",
    "traceur": "node_modules/traceur/bin/traceur.js",
    "github:*": "src/github/*"
  },

  map: {
    "GTMSportswear/js-utilities": "github:GTMSportswear/js-utilities@1.0.0"
  }
});
