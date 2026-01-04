import { inspectFiles } from '../clients/file-inspector-client';
import { FileInspectResponse } from '../../../shared/types';
import { logResults } from '../alerts-and-logs/logger-service';


export const dropHandler = async (e: DragEvent) => {
    const files = Array.from(e.dataTransfer?.files || []);
    const pdfFiles = files.filter(f => f.type === "application/pdf");

    if (pdfFiles.length > 0) {
        e.preventDefault();
        e.stopPropagation();

        //Calling clear gemini UI to remove the 'Drop File here'
        clearGeminiDragUI();

        const result: FileInspectResponse = await inspectFiles(pdfFiles);
        await logResults(result);

        //Simulating paste to continue the process.
        await simulatePaste(files);
    }
}

function clearGeminiDragUI() {
    const target = document.querySelector('div[contenteditable="true"]') || document.body;

    // Create a drop event with NO files
    const emptyDrop = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
    });
    target.dispatchEvent(emptyDrop);
}

async function simulatePaste(files: File[]) {
    const textArea = document.querySelector('div[contenteditable="true"]') as HTMLElement;

    if (!textArea) {
        console.error("Gemini prompt area not found.");
        return;
    }

    // 1. Focus the area so the paste has a target
    textArea.focus();

    // 2. Create a DataTransfer to hold the file (this acts as the clipboard container)
    const dataTransfer = new DataTransfer();
    for (const file of files) {
        dataTransfer.items.add(file);
    }

    // 3. Create the ClipboardEvent
    // Note: We use 'paste' as the event type
    const pasteEvent = new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData: dataTransfer
    });

    // 4. Dispatch the event
    console.log("Simulating paste for all files");
    textArea.dispatchEvent(pasteEvent);
}
