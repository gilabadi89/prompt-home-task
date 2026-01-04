# 🛡️ Prompt Security File Inspector
A monorepo containing a **Chrome Extension** and a **Node.js Service** designed to intercept, inspect, and validate PDF files for security violations before they are processed by Gemini.

The extension supports real-time inspection of PDF files via both traditional file upload and drag-and-drop methods.

## 🚀 Getting Started
### Prerequisites
*  **Node.js:** v23.0.0 or higher

* **npm:** v10.0.0 or higher

### Installation & Setup
From the root directory, run the following to clean old artifacts and install all dependencies for the entire workspace (server, extension, and shared):

```Bash
npm run install:fresh
```

#### Running the Project
To run the server and the extension builder simultaneously in watch mode, execute the following from the root directory:

```Bash
npm run start:file-inspector
```
* **The Server:** Runs on http://localhost:3000.

* **The Extension:** Compiled in the extension folder. Load this as an "Unpacked Extension" in Chrome via chrome://extensions with Developer Mode enabled.

### 🧪 Testing
To run the unit tests, navigate to the file-inspector directory and run:

```Bash
npm test
```

### 🔍 How to Use
1. Run the file-inspector service as decribed above.
2. **Load the Extension:** Open Chrome and load the extension folder.
3. **Trigger Inspection:** Navigate to https://gemini.google.com/ and upload or drag-and-drop PDF file(s).
4. **Detection:** The extension intercepts the PDF and sends it to the local Node.js Service.
5. **View Results:**

✅ **If Safe:** The file proceeds to upload normally.

❌ **If Violation:** An alert appears detailing the specific security violation. The upload is blocked until the user acknowledges the warning by clicking "I Understand".

### ⚠️ Current Limitations
1. **File Support:** Currently supports .pdf files only. Formats like .docx or .txt are not yet supported.
2. **Service Dependency:** The extension requires the local inspector service to be active on a specific port.
3. **Memory Usage:** Files are processed in-memory as Buffers; files over 100MB may cause performance issues in the Node process.
4. **Batch Handling:** All files are currently sent simultaneously; optimization for 1-by-1 or chunked processing is pending.
5. **OCR:** Relies on standard text layers; scanned images within PDFs without OCR layers may return empty results.

### 🛠 Features & Production Roadmap
1. **Extended File Support:** Expand inspection to .txt, .json, and other common formats.
2. **Prompt Inspection:** Add the ability to inspect the actual text prompts alongside file attachments.
3. **Enhanced Actionability:** Move beyond simple alerts to allow data masking or permission-based file modification.
4. **Observability:** Integrate ELK Stack or Datadog for monitoring latency and error rates.
5. **Persistence:** Implement Redis caching to avoid redundant inspections of the same file.
6. **Advanced Error Handling:** Define workflows for password-protected or corrupted files.

### 📈 Scaling & Performance Improvements
1. **Streaming:** Implement Node.js Streams to parse and inspect PDFs chunk-by-chunk to save memory.
2. **Infrastructure:** Deploy the service in Kubernetes with an Nginx load balancer for high availability.
3. **Non-blocking UI:** Utilize Server-Sent Events (SSE) to provide asynchronous updates to the extension UI.
4. **Edge Computing:** Deploy the security client via Cloudflare Workers or similar Edge Functions to reduce global latency.