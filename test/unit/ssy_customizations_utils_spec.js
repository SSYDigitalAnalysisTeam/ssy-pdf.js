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
  buildSsyAllowedViewerOrigins,
  getSsyOptionOverrides,
  isSsyBlockedShortcut,
  SSY_ALLOWED_VIEWER_ORIGINS,
} from "../../web/ssy_customizations_utils.js";

describe("ssy_customizations_utils", function () {
  it("returns the expected viewer option overrides", function () {
    expect(getSsyOptionOverrides()).toEqual({
      localeProperties: { lang: "en-US" },
      annotationEditorMode: -1,
      enableSignatureEditor: false,
      enableSplitMerge: false,
      viewerCssTheme: 1,
    });
  });

  it("builds the SSY viewer allowlist with the current origin appended once", function () {
    expect(
      buildSsyAllowedViewerOrigins("https://viewer.example.test")
    ).toEqual([
      ...SSY_ALLOWED_VIEWER_ORIGINS,
      "https://viewer.example.test",
    ]);

    expect(
      buildSsyAllowedViewerOrigins("http://localhost:8888")
    ).toEqual(SSY_ALLOWED_VIEWER_ORIGINS);
  });

  it("blocks the SSY-disallowed keyboard shortcuts", function () {
    for (const key of ["p", "P", "s", "S", "o", "O"]) {
      expect(isSsyBlockedShortcut({ key, ctrlKey: true, metaKey: false }))
        .withContext(`ctrl+${key}`)
        .toBeTrue();
      expect(isSsyBlockedShortcut({ key, ctrlKey: false, metaKey: true }))
        .withContext(`meta+${key}`)
        .toBeTrue();
    }
  });

  it("allows unrelated shortcuts and keys", function () {
    expect(
      isSsyBlockedShortcut({ key: "f", ctrlKey: true, metaKey: false })
    ).toBeFalse();
    expect(
      isSsyBlockedShortcut({ key: "p", ctrlKey: false, metaKey: false })
    ).toBeFalse();
    expect(
      isSsyBlockedShortcut({ key: "o", ctrlKey: false, metaKey: false })
    ).toBeFalse();
    expect(
      isSsyBlockedShortcut({
        key: "s",
        ctrlKey: true,
        metaKey: false,
        altKey: true,
      })
    ).toBeFalse();
  });
});
