const compress = require("compression");
const bs = require("browser-sync").create();

const serverConfig = {
  baseDir: "./",
  middleware: function(req, res, next) {
    var gzip = compress();
    gzip(req, res, next);
  }
};

bs.watch(["packages/**/demo/index.html", "packages/**/dist/**/*"]).on(
  "change",
  bs.reload
);

bs.watch(["packages/**/src/**/*"]).on("change", (event, file) => {
  console.log(event);
  console.log(file);
});

bs.init({
  server: serverConfig,
  reloadDebounce: 2000
});
