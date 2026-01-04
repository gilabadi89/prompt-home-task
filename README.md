Prompt Security File Inspector
A monorepo containing a Chrome Extension and a Node.js Service designed to intercept, inspect, and validate PDF files for security violations before they are processed by https://gemini.google.com
The extension supports inspection of PDS files when using upload and drag&drop methods. 

🚀 Getting Started:
Prerequisites
Node.js: v23.0.0 or higher
npm: v10.0.0 or higher

Installation & Setup:
From the root directory, run the following to clean old artifacts and install all dependencies for both the server and extension:
npm run install:fresh

Running the Project:
To run the server and the extension builder simultaneously in watch mode:

From the root directory, run the following command:
npm run dev:file-inspector
The Server will run on http://localhost:3000

The Extension will be built in the extension folder. Load this folder into Chrome via chrome://extensions (Developer Mode).

Testing
From the file-inspector directory, run the following command:
npm test

🔍 How to Use
Load the Extension: Open Chrome and load the extension folder.
Trigger Inspection: Navigate to https://gemini.google.com and upload a pds file/s or drag-and-drop area.
Upload a PDF: When a PDF is detected, the extension intercepts it and sends it to the local Service for inspection.
View Results:
If Safe: The file proceeds normally.
If Violation: The extension alerts with a proper message and the violation that was found.
The popup blocks until the user clicks the "I Understand" button and continue the upload process.

⚠️ Current Limitations
PDF Only: The current version only supports .pdf files. Other formats (Docx, Txt) are currently ignored.
Localhost Dependency: The extension expects the inspector service to be running on a specific local port.
Large File Memory: Files are processed in-memory as Buffers; extremely large PDFs (100MB+) may cause memory spikes in the current Node process.
Many files limitation: All the files are sent at once, need to test if this is the correct approach for the usage. Maybe we should send 1 by 1, maybe chunks etc. 
Basic OCR: Text extraction relies on standard PDF layers; scanned PDFs (images) without an OCR layer may return empty results.

🛠 Features and Production Readiness Roadmap
Need to add more file types for the system to support - txt, json etc.
Add more abilities such as prompt inspector.
Actionability - We should do more than just alert. We can ask the user to act on the file, or we can try to mask the file with a give permission.
Logging & Observability: Integrate with tools like ELK Stack or Datadog to track inspection latency and error rates.
Persistent Storage: Cache inspection results in a database (e.g., Redis) to avoid re-inspecting the same file multiple times.
Error handling - need to define and implement what should be the behavior of files with password and more scenarios.

📈 Scaling & Performance Improvements 
Streaming Extraction: Instead of loading the entire file into a Buffer, use Streams to parse and inspect the PDF chunk-by-chunk.
Load Balancing: Deploy the service in a containerized environment (Kubernetes) with an Nginx load balancer to distribute traffic across multiple nodes.
Support multiple number of files: we can consider implement SSE to extension to avoid blocking the UI.
Global CDN: Deploy the Prompt Security Client closer to the users via Edge Functions (e.g., Cloudflare Workers) to reduce latency in the "Examine" phase.
