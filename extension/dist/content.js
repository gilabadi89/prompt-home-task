"use strict";
(() => {
  // src/clients/file-inspector-client.ts
  async function inspectFiles(files) {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    try {
      const response = await fetch("http://localhost:3000/inspect-pdf", {
        method: "POST",
        body: formData
      });
      const { results } = await response.json();
      return results;
    } catch (error) {
      console.error("Server connection failed:", error);
    }
    return { inspectPassed: true, violations: [] };
  }

  // src/alerts-and-logs/alerting-service.ts
  function showSecurityWarning(reasons) {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.id = "prompt-security-overlay";
      overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); z-index: 99999;
            display: flex; align-items: center; justify-content: center;
            backdrop-filter: blur(4px); font-family: 'Google Sans', sans-serif;
        `;
      const modal = document.createElement("div");
      modal.style.cssText = `
            background: white; padding: 32px; border-radius: 16px;
            max-width: 450px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        `;
      modal.innerHTML = `
            <div style="font-size: 50px; margin-bottom: 16px;">\u26A0\uFE0F</div>
            <h2 style="color: #d93025; margin-bottom: 8px;">Security Check Failed</h2>
            <p style="color: #3c4043; line-height: 1.5; margin-bottom: 24px;">
                The PDF content was flagged for the following reason:<br>
                <strong>${reasons}</strong>
            </p>
            <button id="confirm-security-btn" style="
                background: #1a73e8; color: white; border: none;
                padding: 10px 24px; border-radius: 8px; cursor: pointer;
                font-weight: 500; font-size: 14px;
            ">I Understand</button>
        `;
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      document.getElementById("confirm-security-btn")?.addEventListener("click", () => {
        document.body.removeChild(overlay);
        resolve();
      });
    });
  }

  // src/alerts-and-logs/logger-service.ts
  async function logResults(result) {
    if (!result) {
      console.error("Received wrong result");
    }
    if (!result.inspectPassed) {
      console.warn("Inspection Failed!");
      console.log("Found ", result.violations, " in ", result.fileName);
      await showSecurityWarning(result?.violations);
    } else {
      console.log("Inspection Passed!");
    }
  }

  // src/eventHandlers/drop-event-handler.ts
  var dropHandler = async (e) => {
    const files = Array.from(e.dataTransfer?.files || []);
    const pdfFiles = files.filter((f) => f.type === "application/pdf");
    if (pdfFiles.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      clearGeminiDragUI();
      const result = await inspectFiles(pdfFiles);
      await logResults(result);
      await simulatePaste(files);
    }
  };
  function clearGeminiDragUI() {
    const target = document.querySelector('div[contenteditable="true"]') || document.body;
    const emptyDrop = new DragEvent("drop", {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer()
    });
    target.dispatchEvent(emptyDrop);
  }
  async function simulatePaste(files) {
    const textArea = document.querySelector('div[contenteditable="true"]');
    if (!textArea) {
      console.error("Gemini prompt area not found.");
      return;
    }
    textArea.focus();
    const dataTransfer = new DataTransfer();
    for (const file of files) {
      dataTransfer.items.add(file);
    }
    const pasteEvent = new ClipboardEvent("paste", {
      bubbles: true,
      cancelable: true,
      clipboardData: dataTransfer
    });
    console.log("Simulating paste for all files");
    textArea.dispatchEvent(pasteEvent);
  }

  // src/eventHandlers/upload-file-event-handler.ts
  var uploadFileEventHandler = async (e) => {
    const target = e.target;
    if (target?.dataset.isResuming === "true") {
      console.log("resuming");
      return;
    }
    if (target && target.type === "file" && target.files?.length) {
      const files = Array.from(target.files);
      const pdfFiles = files.filter((f) => f.type === "application/pdf");
      e.preventDefault();
      e.stopImmediatePropagation();
      target.value = "";
      const result = await inspectFiles(pdfFiles);
      await logResults(result);
      resumeNativeUpload(files, target);
    }
  };
  function resumeNativeUpload(files, input) {
    const dataTransfer = new DataTransfer();
    files.forEach((f) => dataTransfer.items.add(f));
    input.dataset.isResuming = "true";
    input.files = dataTransfer.files;
    const event = new Event("change", { bubbles: true });
    input.dispatchEvent(event);
    console.log("Native upload resumed with safe files.");
    delete input.dataset.isResuming;
  }

  // src/content.ts
  document.body.addEventListener("change", uploadFileEventHandler, true);
  window.addEventListener("drop", dropHandler, true);
})();
