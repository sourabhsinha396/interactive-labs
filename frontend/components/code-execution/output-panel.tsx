"use client";

import { Check, Copy, Terminal, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { CodeExecutionResponse } from '@/types/code-execution';

interface OutputPanelProps {
  result: CodeExecutionResponse | null;
  isExecuting: boolean;
}

export function OutputPanel({ result, isExecuting }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result) return;
    
    const output = result.stdout || result.stderr || result.error || '';
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isExecuting) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Executing code...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Terminal className="h-8 w-8" />
          <p className="text-sm">Output will appear here</p>
        </div>
      </div>
    );
  }

  const hasError = result.exit_code !== 0 || result.error;
  const output = result.stdout || result.stderr || result.error || '';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Output</span>
          {hasError ? (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              Error
            </Badge>
          ) : (
            <Badge variant="default" className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20">
              <Check className="h-3 w-3 mr-1" />
              Success
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{result.execution_time.toFixed(3)}s</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!output}
            className="h-8"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Output Content */}
      <div className="flex-1 overflow-auto p-4">
        <pre className={`text-sm font-mono whitespace-pre-wrap ${
          hasError ? 'text-destructive' : 'text-foreground'
        }`}>
          {output || 'No output'}
        </pre>
      </div>
    </div>
  );
}