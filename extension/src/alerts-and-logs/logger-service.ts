import { FileInspectResponse } from '@shared/types';
import { showSecurityWarning } from "./alerting-service";

export async function logResults(result: FileInspectResponse) {
    if (!result) {
        console.error('Received wrong result');
    }

    if (! result.inspectPassed) {
        console.log('Inspection Failed!');
        console.log('Found ', result.violations, ' in ', result.fileName);
        await showSecurityWarning(result?.violations);
    } else {
        console.log('Inspection Passed!')
    }


}