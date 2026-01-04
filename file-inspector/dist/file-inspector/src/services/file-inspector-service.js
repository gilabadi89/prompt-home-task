"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPdfFiles = processPdfFiles;
const unpdf_1 = require("unpdf");
const prompt_security_client_1 = require("../clients/prompt-security-client");
async function processPdfFiles(pdfFiles) {
    let result = {
        inspectPassed: true,
        violations: [],
    };
    for (const pdfFile of pdfFiles) {
        console.log("PDF detected and intercepted: ", pdfFile.originalname);
        try {
            const { text } = await (0, unpdf_1.extractText)(new Uint8Array(pdfFile.buffer));
            for (const currentChunk of text) {
                result = await (0, prompt_security_client_1.postTextExamine)(currentChunk);
                if (!result.inspectPassed) {
                    result.fileName = pdfFile.originalname;
                    return result;
                }
            }
        }
        catch (error) {
            console.error("Error parsing PDF:", error);
        }
    }
    return result;
}
