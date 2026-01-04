🛡️ Prompt Security File Inspector
A monorepo containing a Chrome Extension and a Node.js Service designed to intercept, inspect, and validate PDF files for security violations before they are processed by Gemini.

The extension supports real-time inspection of PDF files via both traditional file upload and drag-and-drop methods.

🚀 Getting Started
Prerequisites
Node.js: v23.0.0 or higher

npm: v10.0.0 or higher

Installation & Setup
From the root directory, run the following to clean old artifacts and install all dependencies for the entire workspace (server, extension, and shared):

Bash

npm run install:fresh
Running the Project
To run the server and the extension builder simultaneously in watch mode, execute the following from the root directory:

Bash

npm run dev:file-inspector
The Server: Runs on http://localhost:3000.

The Extension: Compiled in the extension folder. Load this as an "Unpacked Extension" in Chrome via chrome://extensions with Developer Mode enabled.

🧪 Testing
To run the unit tests, navigate to the file-inspector directory and run:

Bash

npm test
🔍 How to Use
Load the Extension: Open Chrome and load the extension folder.

Trigger Inspection: Navigate to Gemini and upload or drag-and-drop PDF file(s).

Detection: The extension intercepts the PDF and sends it to the local Node.js Service.

View Results:

✅ If Safe: The file proceeds to upload normally.

❌ If Violation: An alert appears detailing the specific security violation. The upload is blocked until the user acknowledges the warning by clicking "I Understand".

⚠️ Current Limitations
File Support: Currently supports .pdf files only. Formats like .docx or .txt are not yet supported.

Service Dependency: The extension requires the local inspector service to be active on a specific port.

Memory Usage: Files are processed in-memory as Buffers; files over 100MB may cause performance issues in the Node process.

Batch Handling: All files are currently sent simultaneously; optimization for 1-by-1 or chunked processing is pending.

OCR: Relies on standard text layers; scanned images within PDFs without OCR layers may return empty results.

🛠 Features & Production Roadmap
Extended File Support: Expand inspection to .txt, .json, and other common formats.

Prompt Inspection: Add the ability to inspect the actual text prompts alongside file attachments.

Enhanced Actionability: Move beyond simple alerts to allow data masking or permission-based file modification.

Observability: Integrate ELK Stack or Datadog for monitoring latency and error rates.

Persistence: Implement Redis caching to avoid redundant inspections of the same file.

Advanced Error Handling: Define workflows for password-protected or corrupted files.

📈 Scaling & Performance Improvements
Streaming: Implement Node.js Streams to parse and inspect PDFs chunk-by-chunk to save memory.

Infrastructure: Deploy the service in Kubernetes with an Nginx load balancer for high availability.

Non-blocking UI: Utilize Server-Sent Events (SSE) to provide asynchronous updates to the extension UI.

Edge Computing: Deploy the security client via Cloudflare Workers or similar Edge Functions to reduce global latency.