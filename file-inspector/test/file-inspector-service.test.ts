import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import * as promptClient from '../src/clients/prompt-security-client';

describe('File Inspector Service Tests', () => {
    let extractTextStub: sinon.SinonStub;
    let postTextExamineStub: sinon.SinonStub;
    let processPdfFiles: any;

    beforeEach(() => {
        extractTextStub = sinon.stub();
        postTextExamineStub = sinon.stub(promptClient, 'postTextExamine');

        //Need this since sinon have hard time to moch unpdf
        processPdfFiles = proxyquire('../src/services/file-inspector-service', {
            'unpdf': {
                extractText: extractTextStub
            },
            '../clients/prompt-security-client': {
                postTextExamine: postTextExamineStub
            }
        }).processPdfFiles;
    });

    afterEach(() => {
        sinon.restore();
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
        }] as any;

        //Act
        const result = await processPdfFiles(mockFiles);

        // Test
        expect(result.inspectPassed).to.be.true;
        expect(result.fileName).to.be.undefined;
        expect(extractTextStub.calledOnce).to.be.true;
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
        } as any]);

        expect(result.inspectPassed).to.be.false;
        expect(result.fileName).to.equal('bad.pdf');
        expect(result.violations[0]).to.equal('Secrets');
    });
});