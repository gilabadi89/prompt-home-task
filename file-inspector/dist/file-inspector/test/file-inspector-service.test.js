"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const proxyquire_1 = __importDefault(require("proxyquire"));
const promptClient = __importStar(require("../src/clients/prompt-security-client"));
describe('File Inspector Service Tests', () => {
    let extractTextStub;
    let postTextExamineStub;
    let processPdfFiles;
    beforeEach(() => {
        extractTextStub = sinon_1.default.stub();
        postTextExamineStub = sinon_1.default.stub(promptClient, 'postTextExamine');
        //Need this since sinon have hard time to moch unpdf
        processPdfFiles = (0, proxyquire_1.default)('../src/services/file-inspector-service', {
            'unpdf': {
                extractText: extractTextStub
            },
            '../clients/prompt-security-client': {
                postTextExamine: postTextExamineStub
            }
        }).processPdfFiles;
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it('should successfully process a safe PDF', async () => {
        // Setup
        extractTextStub.resolves({
            text: ['This content is safe'],
            metadata: { totalPages: 1 }
        });
        postTextExamineStub.resolves({
            inspectPassed: true,
            violations: []
        });
        const mockFiles = [{
                originalname: 'test.pdf',
                buffer: Buffer.from('fake-data'),
                mimetype: 'application/pdf'
            }];
        //Act
        const result = await processPdfFiles(mockFiles);
        // Test
        (0, chai_1.expect)(result.inspectPassed).to.be.true;
        (0, chai_1.expect)(result.fileName).to.be.undefined;
        (0, chai_1.expect)(extractTextStub.calledOnce).to.be.true;
    });
    it('should catch violations returned by the API', async () => {
        extractTextStub.resolves({ text: ['Bad word'], metadata: {} });
        postTextExamineStub.resolves({
            inspectPassed: false,
            violations: ['Secrets']
        });
        const result = await processPdfFiles([{
                originalname: 'bad.pdf',
                buffer: Buffer.from('...')
            }]);
        (0, chai_1.expect)(result.inspectPassed).to.be.false;
        (0, chai_1.expect)(result.fileName).to.equal('bad.pdf');
        (0, chai_1.expect)(result.violations[0]).to.equal('Secrets');
    });
});
