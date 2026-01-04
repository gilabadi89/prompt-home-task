"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_inspector_service_1 = require("../src/services/file-inspector-service");
const prompt_security_client_1 = require("../src/clients/prompt-security-client");
const unpdf_1 = require("unpdf");
// 1. Mock the dependencies
jest.mock('unpdf');
jest.mock('../clients/prompt-security-client');
const mockedExtractText = unpdf_1.extractText;
const mockedPostTextExamine = prompt_security_client_1.postTextExamine;
describe('File Inspector Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should pass when PDF content is safe', async () => {
        // Setup: Mock PDF text extraction
        mockedExtractText.mockResolvedValue({ text: ['Hello world'], metadata: {} });
        // Setup: Mock Security API to return passed
        mockedPostTextExamine.mockResolvedValue({
            inspectPassed: true,
            violations: []
        });
        const mockFile = {
            originalname: 'safe.pdf',
            buffer: Buffer.from('fake-pdf-content')
        };
        const result = await (0, file_inspector_service_1.processPdfFiles)([mockFile]);
        expect(result.inspectPassed).toBe(true);
        expect(result.fileName).toBeUndefined();
        expect(mockedPostTextExamine).toHaveBeenCalledWith('Hello world');
    });
    it('should fail and return fileName when a violation is found', async () => {
        mockedExtractText.mockResolvedValue({ text: ['Dangerous content'], metadata: {} });
        mockedPostTextExamine.mockResolvedValue({
            inspectPassed: false,
            violations: ['MALICIOUS_PROMPT']
        });
        const mockFile = {
            originalname: 'bad.pdf',
            buffer: Buffer.from('fake-pdf-content')
        };
        const result = await (0, file_inspector_service_1.processPdfFiles)([mockFile]);
        expect(result.inspectPassed).toBe(false);
        expect(result.fileName).toBe('bad.pdf');
        expect(result.violations).toContain('MALICIOUS_PROMPT');
    });
});
