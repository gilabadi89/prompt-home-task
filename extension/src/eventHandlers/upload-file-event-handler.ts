import { inspectFiles } from '../clients/file-inspector-client';
import { logResults } from '../alerts-and-logs/logger-service';

export const uploadFileEventHandler = async (e: Event) => {
    const target = e.target as HTMLInputElement;

    // If this is our own 'resume' event, ignore it and let Gemini have it!
    if (target?.dataset.isResuming === "true") {
        console.log('resuming');
        return;
    }

    if (target && target.type === 'file' && target.files?.length) {
        const files = Array.from(target.files);
        const pdfFiles = files.filter(f => f.type === "application/pdf");

        // Stop Gemini's initial attempt
        e.preventDefault();
        e.stopImmediatePropagation();

        // Clear the input so it's fresh for our resume later
        target.value = '';

        // Start the security flow
        const result = await inspectFiles(pdfFiles);
        await logResults(result);

        resumeNativeUpload(files, target);
    }
}


function resumeNativeUpload(files: File[], input: HTMLInputElement) {
    // 1. Create a new FileList-like object
    const dataTransfer = new DataTransfer();
    files.forEach(f => dataTransfer.items.add(f));

    // 2. IMPORTANT: Set a flag so our listener ignores this specific change
    input.dataset.isResuming = "true";

    // 3. Put the files back in
    input.files = dataTransfer.files;

    // 4. Fire the change event that Gemini is listening for
    const event = new Event('change', { bubbles: true });
    input.dispatchEvent(event);

    console.log("Native upload resumed with safe files.");

    // 5. Clean up the flag
    delete input.dataset.isResuming;
}