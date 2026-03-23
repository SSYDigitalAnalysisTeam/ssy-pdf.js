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

const SSY_ALLOWED_VIEWER_ORIGINS = Object.freeze([
  "https://ssywebcontent.blob.core.windows.net",
  "http://ssywebcontent.blob.core.windows.net",
  "http://localhost:8888",
]);

function buildSsyAllowedViewerOrigins(currentOrigin) {
  const origins = new Set(SSY_ALLOWED_VIEWER_ORIGINS);
  if (typeof currentOrigin === "string" && currentOrigin) {
    origins.add(currentOrigin);
  }
  return [...origins];
}

function getSsyOptionOverrides() {
  return {
    localeProperties: { lang: "en-US" },
    annotationEditorMode: -1,
    enableSignatureEditor: false,
    enableSplitMerge: false,
    viewerCssTheme: 1,
  };
}

function isSsyBlockedShortcut({
  key,
  ctrlKey = false,
  metaKey = false,
  altKey = false,
} = {}) {
  if (altKey || (!ctrlKey && !metaKey) || typeof key !== "string") {
    return false;
  }
  return ["o", "p", "s"].includes(key.toLowerCase());
}

export {
  buildSsyAllowedViewerOrigins,
  getSsyOptionOverrides,
  isSsyBlockedShortcut,
  SSY_ALLOWED_VIEWER_ORIGINS,
};
