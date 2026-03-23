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

import {
  getSsyDistBuildGlobPatterns,
  getSsyDistGlobPatterns,
  SSY_DIST_BUILD_ROOT_GLOBS,
  SSY_DIST_RELATIVE_GLOBS,
} from "../../web/ssy_dist_manifest.js";

describe("ssy_dist_manifest", function () {
  it("contains the expected deployable viewer assets", function () {
    expect(SSY_DIST_RELATIVE_GLOBS).toEqual([
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
  });

  it("contains the expected build-root payload files", function () {
    expect(SSY_DIST_BUILD_ROOT_GLOBS).toEqual(["version.json"]);
  });

  it("prefixes relative globs for the generic build output", function () {
    expect(getSsyDistGlobPatterns("build/generic/")).toEqual([
      "build/generic/LICENSE",
      "build/generic/build/pdf.mjs",
      "build/generic/build/pdf.sandbox.mjs",
      "build/generic/build/pdf.worker.mjs",
      "build/generic/web/viewer.html",
      "build/generic/web/viewer.mjs",
      "build/generic/web/viewer.css",
      "build/generic/web/ssy_viewer.css",
      "build/generic/web/ssy_customizations.mjs",
      "build/generic/web/ssy_customizations_utils.js",
      "build/generic/web/images/**/*",
      "build/generic/web/locale/**/*",
      "build/generic/web/cmaps/**/*",
      "build/generic/web/iccs/**/*",
      "build/generic/web/standard_fonts/**/*",
      "build/generic/web/wasm/**/*",
      "!build/generic/**/*.map",
      "!build/generic/web/debugger.*",
      "!build/generic/web/compressed.tracemonkey-pldi-09.pdf",
    ]);
  });

  it("prefixes build-root globs for the build output", function () {
    expect(getSsyDistBuildGlobPatterns("build/")).toEqual([
      "build/version.json",
    ]);
  });
});
