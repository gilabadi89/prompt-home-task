import { FileInspectResponse } from '@shared/types';

export async function inspectFiles(files: File[]): Promise<FileInspectResponse> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
        // 2. Send to your local or remote server
        const response = await fetch('http://localhost:3000/inspect-pdf', {
            method: 'POST',
            body: formData
        });

        const { results } = await response.json();
        return results
    } catch (error) {
        console.error("Server connection failed:", error);
        //Need to decide what should be returned to the user incase the server failed.
        //Here I chose to return that the inspection passed since in any case we are not blocking.
    }
    return {inspectPassed: true, violations: []};
}