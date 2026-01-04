"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postTextExamine = postTextExamine;
const API_URL = 'https://eu.prompt.security/api/protect';
const APP_ID = 'cc6a6cfc-9570-4e5a-b6ea-92d2adac90e4';
async function postTextExamine(text) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'APP-ID': APP_ID,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: text
            })
        });
        if (!response.ok) {
            throw new Error(`Security API Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.status != 'success' || !data.result || !data.result.prompt) {
            throw new Error(`Failed to inspect the given text`);
        }
        const prompt = data.result.prompt;
        const passed = prompt.passed;
        const violations = prompt.violations;
        return {
            inspectPassed: passed,
            violations: violations,
        };
    }
    catch (error) {
        console.error("Failed to call Security API:", error);
        throw error;
    }
}
