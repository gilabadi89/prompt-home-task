import { extractText } from 'unpdf';
import { postTextExamine } from '../clients/prompt-security-client';
import { FileInspectResponse } from '../../../shared/types'

export async function processPdfFiles(pdfFiles: Express.Multer.File[]): Promise<FileInspectResponse> {
    let result: FileInspectResponse = {
        inspectPassed: true,
        violations: [],
    }
    for (const pdfFile of pdfFiles) {
        console.log("PDF detected and intercepted: ", pdfFile.originalname);
        try {
            const { text } = await extractText(new Uint8Array(pdfFile.buffer));
            for (const currentChunk of text) {
                result = await postTextExamine(currentChunk);
                if (!result.inspectPassed) {
                    result.fileName = pdfFile.originalname;
                    return result;
                }
            }
        } catch (error) {
            console.error("Error parsing PDF:", error);
        }
    }
    return result
}