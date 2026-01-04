
export interface FileInspectResponse {
    inspectPassed: boolean;
    violations: string[];
    fileName?: string;
}