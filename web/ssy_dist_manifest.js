/* Copyright 2026 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const SSY_DIST_RELATIVE_GLOBS = Object.freeze([
  "LICENSE",
  "build/pdf.mjs",
  "build/pdf.sandbox.mjs",
  "build/pdf.worker.mjs",
  "web/viewer.html",
  "web/viewer.mjs",
  "web/viewer.css",
  "web/ssy_viewer.css",
  "web/ssy_customizations.mjs",
  "web/ssy_customizations_utils.js",
  "web/images/**/*",
  "web/locale/**/*",
  "web/cmaps/**/*",
  "web/iccs/**/*",
  "web/standard_fonts/**/*",
  "web/wasm/**/*",
  "!**/*.map",
  "!web/debugger.*",
  "!web/compressed.tracemonkey-pldi-09.pdf",
]);

const SSY_DIST_BUILD_ROOT_GLOBS = Object.freeze(["version.json"]);

function getSsyDistGlobPatterns(root = "") {
  if (!root) {
    return [...SSY_DIST_RELATIVE_GLOBS];
  }
  return SSY_DIST_RELATIVE_GLOBS.map(pattern =>
    pattern.startsWith("!")
      ? `!${root}${pattern.slice(1)}`
      : `${root}${pattern}`
  );
}

function getSsyDistBuildGlobPatterns(root = "") {
  if (!root) {
    return [...SSY_DIST_BUILD_ROOT_GLOBS];
  }
  return SSY_DIST_BUILD_ROOT_GLOBS.map(pattern => `${root}${pattern}`);
}

export {
  getSsyDistBuildGlobPatterns,
  getSsyDistGlobPatterns,
  SSY_DIST_BUILD_ROOT_GLOBS,
  SSY_DIST_RELATIVE_GLOBS,
};
