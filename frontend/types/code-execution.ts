export interface CodeExecutionRequest {
    code: string;
    language: string;
    stdin?: string;
  }
  
  export interface CodeExecutionResponse {
    stdout: string;
    stderr: string;
    exit_code: number;
    execution_time: number;
    error?: string;
  }
  
  export interface SupportedLanguagesResponse {
    languages: string[];
  }
  
  export interface ExampleCode {
    [key: string]: string;
  }