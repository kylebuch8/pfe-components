const { src, dest } = require("gulp");
const replace = require("gulp-replace");

function defaultTask() {
  return src("dist/pfe-card.js")
    .pipe(replace("../../@patternfly", "../.."))
    .pipe(dest("dist"));
}

exports.default = defaultTask;
