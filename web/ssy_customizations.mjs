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
} from "./ssy_customizations_utils.js";

const SSY_SCROLL_BUTTON_IDS = {
  horizontal: "ssyScrollHorizontalButton",
  vertical: "ssyScrollVerticalButton",
};

const SSY_SCROLL_MODES = {
  vertical: 0,
  horizontal: 1,
};

const SSY_HIDDEN_IDS = [
  "editorComment",
  "editorFreeText",
  "editorHighlight",
  "editorInk",
  "editorModeButtons",
  "editorModeSeparator",
  "editorSignature",
  "editorStamp",
  "documentProperties",
  "downloadButton",
  "printButton",
  "secondaryDownload",
  "secondaryOpenFile",
  "secondaryPrint",
  "viewBookmark",
  "viewBookmarkSeparator",
];

let ssyCustomizationsApplied = false;

globalThis.PDFJS_EXTRA_ALLOWED_VIEWER_ORIGINS = buildSsyAllowedViewerOrigins(
  window.location.origin
);

const ssyShortcutHandler = event => {
  if (!isSsyBlockedShortcut(event)) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation?.();
};

document.addEventListener("keydown", ssyShortcutHandler, {
  capture: true,
});

function hideSsyDisabledUi() {
  for (const id of SSY_HIDDEN_IDS) {
    const element = document.getElementById(id);
    if (!element) {
      continue;
    }
    element.hidden = true;
    element.classList.add("hidden");
  }
}

function setToggleState(button, toggled) {
  if (!button) {
    return;
  }
  button.classList.toggle("toggled", toggled);
  button.setAttribute("aria-checked", toggled ? "true" : "false");
}

function bindSsyScrollButtons(app) {
  const eventBus = app.eventBus;
  const verticalButton = document.getElementById(SSY_SCROLL_BUTTON_IDS.vertical);
  const horizontalButton = document.getElementById(
    SSY_SCROLL_BUTTON_IDS.horizontal
  );
  if (!eventBus || !verticalButton || !horizontalButton) {
    return;
  }

  const dispatchMode = mode => {
    eventBus.dispatch("switchscrollmode", {
      source: app,
      mode,
    });
  };
  verticalButton.addEventListener("click", () =>
    dispatchMode(SSY_SCROLL_MODES.vertical)
  );
  horizontalButton.addEventListener("click", () =>
    dispatchMode(SSY_SCROLL_MODES.horizontal)
  );

  const syncButtons = ({ mode }) => {
    setToggleState(verticalButton, mode === SSY_SCROLL_MODES.vertical);
    setToggleState(horizontalButton, mode === SSY_SCROLL_MODES.horizontal);
  };
  syncButtons({ mode: app.pdfViewer.scrollMode });
  eventBus.on("scrollmodechanged", syncButtons);
}

function applySsyCustomizations() {
  if (ssyCustomizationsApplied) {
    return;
  }
  const app = window.PDFViewerApplication;
  const options = window.PDFViewerApplicationOptions;
  if (!app || !options) {
    return;
  }
  ssyCustomizationsApplied = true;

  for (const [name, value] of Object.entries(getSsyOptionOverrides())) {
    options.set(name, value);
  }

  const noop = async () => {};
  app.triggerPrinting = () => {};
  app.download = noop;
  app.save = noop;
  app.downloadOrSave = noop;
  window.print = () => {};

  app.initializedPromise.then(() => {
    hideSsyDisabledUi();
    app._openFileInput = null;
    app.pdfDocumentProperties?.open &&
      (app.pdfDocumentProperties.open = () => {});
    bindSsyScrollButtons(app);
  });
}

function registerWebViewerLoadedListener() {
  const handler = () => applySsyCustomizations();
  document.addEventListener("webviewerloaded", handler, { once: true });
  try {
    const parentDocument = window.parent?.document;
    if (parentDocument && parentDocument !== document) {
      parentDocument.addEventListener("webviewerloaded", handler, {
        once: true,
      });
    }
  } catch {
    // Ignore cross-origin embedding.
  }
}

registerWebViewerLoadedListener();
